import { NextResponse } from "next/server";
import { BookingRepository } from "@/repositories/BookingRepository";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const salonId = searchParams.get("salonId");

    if (!salonId) {
      return NextResponse.json({ success: false, message: "Invalid Salon ID" }, { status: 400 });
    }

    // Find the single most recently created booking
    const latestBooking = await BookingRepository.findOne({ salonId });

    if (!latestBooking) {
      return NextResponse.json({
        success: true,
        latestTimestamp: null,
      });
    }

    // Format service names for notification toast
    let serviceNames = "";
    if (latestBooking.serviceIds && Array.isArray(latestBooking.serviceIds)) {
      serviceNames = latestBooking.serviceIds.map((s: any) => s.name).join(", ");
    }

    return NextResponse.json({
      success: true,
      latestTimestamp: latestBooking.createdAt,
      customerName: latestBooking.customerName,
      serviceName: serviceNames || "Service",
    });

  } catch (error) {
    console.error("Latest booking error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
