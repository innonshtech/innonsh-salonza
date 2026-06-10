import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Booking from "@/models/Booking";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const salonId = searchParams.get("salonId");

    if (!salonId || !mongoose.Types.ObjectId.isValid(salonId)) {
      return NextResponse.json({ success: false, message: "Invalid Salon ID" }, { status: 400 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Find the single most recently created booking
    const latestBooking = await Booking.findOne({ salonId })
      .sort({ createdAt: -1 })
      .select('createdAt customerName')
      .populate('serviceIds', 'name') // We only populate name so the payload is tiny
      .lean() as any;

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
