import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Session from "@/models/Session";
import bcrypt from "bcryptjs";
import { generateToken, generateRefreshToken } from "@/lib/auth";
import { env } from "@/lib/env";
import Salon from "@/models/Salon";
import { withValidation } from "@/lib/validate";
import { loginSchema } from "@/lib/validations";
import { withRateLimit } from "@/lib/rateLimit";
import { securityLogger, auditLogger } from "@/lib/logger";

async function handler(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await req.json();
    console.log("Login attempt for email:", email);
    console.log("Password received:", password ? "Yes" : "No");
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      securityLogger.warn({ event: "brute_force_lockout", email, ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") }, "Account locked due to brute force");
      return NextResponse.json({ success: false, message: "Account is temporarily locked. Try again later." }, { status: 403 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      // Increment login attempts
      user.loginAttempts += 1;
      
      // Lock if max attempts reached (5)
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
        securityLogger.warn({ event: "account_locked", email, ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") }, "Max login attempts reached");
      } else {
        securityLogger.info({ event: "failed_login", email, ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"), attempts: user.loginAttempts }, "Failed login attempt");
      }
      
      await user.save();
      return NextResponse.json({ success: false, message: "Invalid password" });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();
    }

    // create JWT
    const token = generateToken({ 
      userId: user._id,
      role: user.role,
      salonId: user.salonId // Add this
    });
    
    const refreshToken = generateRefreshToken({ 
      userId: user._id,
    });
    
    // --- Session Tracking & Admin Protection ---
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "Unknown IP";
    const userAgent = req.headers.get("user-agent") || "Unknown Device";
    
    // Suspicious Activity Detection for Admins
    if (user.role === "super_admin") {
      const pastSessions = await Session.find({ userId: user._id }).sort({ lastActive: -1 }).limit(5);
      const knownIps = pastSessions.map(s => s.ip);
      if (knownIps.length > 0 && !knownIps.includes(ip)) {
        securityLogger.warn({ event: "admin_suspicious_login", email: user.email, ip }, `Super Admin logged in from completely new IP: ${ip}`);
        // In a real system, we might trigger an email alert here.
      }
    }

    // Save Session
    // We store a hashed version of the refresh token to identify the session uniquely without storing the raw token
    const crypto = require('crypto');
    const hashedSessionToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
    
    await Session.create({
      userId: user._id,
      token: hashedSessionToken,
      userAgent,
      ip,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
    // -------------------------------------------
    
    auditLogger.info({ event: "successful_login", email: user.email, userId: user._id, role: user.role, ip }, "User successfully logged in");

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user,
      salon: await Salon.findOne({ ownerId: user._id })
    });

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 mins
      path: "/",
    });
    
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

export const POST = withRateLimit(withValidation(loginSchema, handler), 5, 15 * 60 * 1000);

