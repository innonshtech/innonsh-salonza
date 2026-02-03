import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "All fields required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ success: false, message: "Email already exists" });
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
    });
  }

}
