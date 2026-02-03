import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Staff from "@/models/Staff";

export async function PUT(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { staffId, updates } = body;

    const staff = await Staff.findByIdAndUpdate(staffId, updates, { new: true });

    return NextResponse.json({ success: true, staff });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Update failed" });
  }
}
