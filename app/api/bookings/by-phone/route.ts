import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ success: false, message: "Phone required" });
    }

    const bookings = await Booking.find({ customerPhone: phone })
      .populate("services")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      bookings,
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message });
  }
}
