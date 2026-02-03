import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Staff from "@/models/Staff";
import Booking from "@/models/Booking";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { bookingId, staffId } = body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { assignedTo: staffId },
      { new: true }
    );

    await Staff.findByIdAndUpdate(staffId, { currentStatus: "busy" });

    return NextResponse.json({ success: true, booking });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Assignment failed" });
  }
}
