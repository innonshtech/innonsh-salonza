import { NextResponse, NextRequest } from "next/server";
import { UserRepository } from "@/repositories/UserRepository";
import bcrypt from "bcryptjs";
import { withValidation } from "@/lib/validate";
import { registerSchema } from "@/lib/validations";
import { withRateLimit } from "@/lib/rateLimit";

async function handler(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    const userExists = await UserRepository.findByEmail(email);
    if (userExists) {
      return NextResponse.json({ success: false, message: "Email already exists" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await UserRepository.create({ name, email, password: hashed, role: role || "salon_owner" });

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

export const POST = withRateLimit(withValidation(registerSchema, handler), 10, 60 * 60 * 1000);

