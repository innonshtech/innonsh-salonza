import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Staff from "@/models/Staff";

export async function DELETE(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { staffId } = body;

    const staff = await Staff.findByIdAndUpdate(
      staffId,
      { active: false },
      { new: true }
    );

    return NextResponse.json({ success: true, message: "Staff disabled", staff });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to delete staff" });
  }
}
