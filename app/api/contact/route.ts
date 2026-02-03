import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("bookingId");
    if (!bookingId) {
        return NextResponse.json({ error: "Missing bookingId parameter" }, { status: 400 });

    }

    // Here you would typically call your database to cancel the booking
    // For demonstration, we'll just return a success message
    return NextResponse.json({ message: `Booking with ID ${bookingId} has been cancelled.` });
}