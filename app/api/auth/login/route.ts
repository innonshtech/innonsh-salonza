import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";
import Salon from "@/models/Salon";
export async function POST(req: Request) {
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
    const token = generateToken({ userId: user._id });
    console.log("Generated token:", token);
   return NextResponse.json({
  success: true,
  message: "Login successful",
  token,
  user,
  salon: await Salon.findOne({ ownerId: user._id })
});

 } catch (error: any) {
  return NextResponse.json({
    success: false,
    message: error.message || "Something went wrong",
  });
}

}
