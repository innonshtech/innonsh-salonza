import { NextResponse, NextRequest } from "next/server";
import { UserRepository } from "@/repositories/UserRepository";
import { SessionRepository } from "@/repositories/SupportRepositories";
import { SalonRepository } from "@/repositories/SalonRepository";
import bcrypt from "bcryptjs";
import { generateToken, generateRefreshToken } from "@/lib/auth";
import { env } from "@/lib/env";
import { withValidation } from "@/lib/validate";
import { loginSchema } from "@/lib/validations";
import { withRateLimit } from "@/lib/rateLimit";
import { securityLogger, auditLogger } from "@/lib/logger";

async function handler(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log("Login attempt for email:", email);
    
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      securityLogger.warn("Account locked due to brute force", { event: "brute_force_lockout", email, ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") });
      return NextResponse.json({ success: false, message: "Account is temporarily locked. Try again later." }, { status: 403 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      // Increment login attempts
      user.loginAttempts += 1;
      
      // Lock if max attempts reached (5)
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
        securityLogger.warn("Max login attempts reached", { event: "account_locked", email, ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") });
      } else {
        securityLogger.info("Failed login attempt", { event: "failed_login", email, ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"), attempts: user.loginAttempts });
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
      userId: user.id,
      role: user.role,
      salonId: user.salonId
    });
    
    const refreshToken = generateRefreshToken({ 
      userId: user.id,
    });
    
    // --- Session Tracking & Admin Protection ---
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "Unknown IP";
    const userAgent = req.headers.get("user-agent") || "Unknown Device";
    
    // Suspicious Activity Detection for Admins
    if (user.role === "super_admin") {
      const pastSessions = await SessionRepository.find({ userId: user.id });
      const knownIps = pastSessions.map((s: any) => s.ip);
      if (knownIps.length > 0 && !knownIps.includes(ip)) {
        securityLogger.warn(`Super Admin logged in from completely new IP: ${ip}`, { event: "admin_suspicious_login", email: user.email, ip });
      }
    }

    // Save Session
    const crypto = require('crypto');
    const hashedSessionToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
    
    await SessionRepository.create({
      userId: user.id,
      token: hashedSessionToken,
      userAgent,
      ip,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
    // -------------------------------------------
    
    auditLogger.info("User successfully logged in", { event: "successful_login", email: user.email, userId: user.id, role: user.role, ip });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user,
      salon: await SalonRepository.findOne({ ownerId: user.id })
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

