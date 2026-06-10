import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { withValidation } from "@/lib/validate";
import { forgotPasswordSchema } from "@/lib/validations";
import { withRateLimit } from "@/lib/rateLimit";

async function handler(req: NextRequest) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Security practice: Don't confirm if user doesn't exist to prevent enumeration
      // But user requested "Check if user exists"
      return NextResponse.json({ success: false, message: "No user found with that email address." }, { status: 404 });
    }

    // Generate secure token
    const rawToken = crypto.randomBytes(32).toString("hex");
    
    // Hash before storing
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    
    // Set token and expiry (15 mins)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    
    await user.save();

    // Create reset link
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password/${rawToken}`;

    // Here you would normally send an email using nodemailer.
    // We return it in response for now as requested.
    console.log(`Reset link for ${email}: ${resetUrl}`);

    return NextResponse.json({
      success: true,
      message: "Password reset link sent to your email (for simulation, see response)",
      resetUrl, // Returning for simulation
    });

  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong"
    }, { status: 500 });
  }
}

export const POST = withRateLimit(withValidation(forgotPasswordSchema, handler), 3, 60 * 60 * 1000);
