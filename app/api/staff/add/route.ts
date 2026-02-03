import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Staff from "@/models/Staff";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { salonId, name, phone, role, skills, profileImage } = body;

    const staff = await Staff.create({
      salonId,
      name,
      phone,
      role,
      skills,
      profileImage
    });

    return NextResponse.json({ success: true, staff });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to add staff" });
  }
}
