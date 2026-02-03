import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Staff from "@/models/Staff";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { staffId, status } = body;

    const staff = await Staff.findByIdAndUpdate(
      staffId,
      { currentStatus: status },
      { new: true }
    );

    return NextResponse.json({ success: true, staff });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Status update failed" });
  }
}
