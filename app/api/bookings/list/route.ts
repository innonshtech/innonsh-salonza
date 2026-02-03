import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const bookings = await Booking.find({
    salonId: id,
    status: "upcoming",
  }).sort({ date: 1 });

  return NextResponse.json({ success: true, bookings });
}
