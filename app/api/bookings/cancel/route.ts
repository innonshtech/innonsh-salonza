import { NextResponse } from "next/server";
import { BookingRepository } from "@/repositories/BookingRepository";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");
    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId parameter" }, { status: 400 });
    }

    await BookingRepository.update(bookingId, { status: "cancelled" });

    return NextResponse.json({ message: `Booking with ID ${bookingId} has been cancelled.` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}