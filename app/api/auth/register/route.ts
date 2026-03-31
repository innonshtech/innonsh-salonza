import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { withValidation } from "@/lib/validate";
import { registerSchema } from "@/lib/validations";

async function handler(req: Request) {
  try {
    await dbConnect();
    const { name, email, password, role } = await req.json();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ success: false, message: "Email already exists" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed, role: role || "salon_owner" });

    return NextResponse.json({
      success: true,
      message: "Registered successfully",
      user,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong",
    }, { status: 500 });
  }
}

export const POST = withValidation(registerSchema, handler);

