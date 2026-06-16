import { NextResponse } from "next/server";
import { BookingRepository } from "@/repositories/BookingRepository";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ success: false, message: "Phone required" });
    }

    const bookings = await BookingRepository.find({ customerPhone: phone });

    return NextResponse.json({
      success: true,
      bookings,
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message });
  }
}
