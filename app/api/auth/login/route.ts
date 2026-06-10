import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";
import Salon from "@/models/Salon";
import { withValidation } from "@/lib/validate";
import { loginSchema } from "@/lib/validations";

async function handler(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();
    console.log("Login attempt for email:", email);
    console.log("Password received:", password ? "Yes" : "No");
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ success: false, message: "Invalid password" });
    }

    // create JWT
    const token = generateToken({ 
      userId: user._id,
      role: user.role,
      salonId: user.salonId // Add this
    });
    console.log("Generated token:", token);
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user,
      salon: await Salon.findOne({ ownerId: user._id })
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
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

export const POST = withValidation(loginSchema, handler);

