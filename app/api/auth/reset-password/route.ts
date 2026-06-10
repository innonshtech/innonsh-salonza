import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { withValidation } from "@/lib/validate";
import { resetPasswordSchema } from "@/lib/validations";

async function handler(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log("Reset Password Request Body:", body);
    
    const { token, newPassword } = body;
    console.log("Extracted token:", token ? token.substring(0, 10) + "..." : "missing");
    console.log("Extracted newPassword:", newPassword ? "present" : "missing");

    if (!token) {
      return NextResponse.json({ success: false, message: "Token is required (missing in request body)" }, { status: 400 });
    }

    if (!newPassword) {
      return NextResponse.json({ success: false, message: "New password is required (missing in request body)" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, message: "New password must be at least 8 characters" }, { status: 400 });
    }

    // Hash the raw token sent from frontend to match the stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find valid user (token matches and not expired)
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid or expired reset token" }, { status: 400 });
    }

    // Set new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    
    // Clear reset tokens
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password has been successfully reset. You can now log in.",
    });

  } catch (error: any) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const POST = withValidation(resetPasswordSchema, handler);
