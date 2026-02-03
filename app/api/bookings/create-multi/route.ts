import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Salon from "@/models/Salon";
import Service from "@/models/Service";
import Booking from "@/models/Booking";
import Queue from "@/models/Queue";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { salonSlug, customerName, customerPhone, serviceIds, date } = body;

    // Validate input
    if (!salonSlug || !customerName || !serviceIds || serviceIds.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 1. Find the salon
    const salon = await Salon.findOne({ slug: salonSlug });
    if (!salon) {
      return NextResponse.json({
        success: false,
        message: "Salon not found",
      });
    }

    // 2. Fetch all selected services
    const services = await Service.find({ _id: { $in: serviceIds } });

    if (services.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Selected services not found",
      });
    }

    // 3. Calculate total duration & price
    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);
    const totalPrice = services.reduce((sum, s) => sum + s.price, 0);

    // 4. Create booking in DB
    const booking = await Booking.create({
      salonId: salon._id,
      customerName,
      customerPhone,
      serviceIds,
      totalDuration,
      totalPrice,
      date: new Date(date),
      status: "upcoming",
    });

    // 5. Determine queue position
    const lastQueueItem = await Queue.findOne({ salonId: salon._id })
      .sort({ position: -1 })
      .limit(1);

    const nextPosition = lastQueueItem ? lastQueueItem.position + 1 : 1;

    // 6. Add to queue
    await Queue.create({
      salonId: salon._id,
      customerName,
      serviceIds,
      position: nextPosition,
      estimatedMinutes: totalDuration,
      bookingId: booking._id,
    });

    return NextResponse.json({
      success: true,
      message: "Booking successful",
      bookingId: booking._id,
      queuePosition: nextPosition,
      totalDuration,
      totalPrice,
    });
  } catch (error: any) {
    console.error("Booking error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Booking failed",
    });
  }
}
