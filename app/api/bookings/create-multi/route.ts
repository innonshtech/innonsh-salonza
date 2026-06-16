import { NextResponse } from "next/server";
import { SalonRepository } from "@/repositories/SalonRepository";
import { ServiceRepository } from "@/repositories/ServiceRepository";
import { BookingRepository } from "@/repositories/BookingRepository";
import { QueueRepository } from "@/repositories/QueueRepository";

export async function POST(req: Request) {
  try {
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
    const salon = await SalonRepository.findOne({ slug: salonSlug });
    if (!salon) {
      return NextResponse.json({
        success: false,
        message: "Salon not found",
      });
    }

    // 2. Fetch all selected services
    const services = await ServiceRepository.find({ _id: { $in: serviceIds } });

    if (services.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Selected services not found",
      });
    }

    // 3. Calculate total duration & price
    const totalDuration = services.reduce((sum: number, s: any) => sum + Number(s.duration || 0), 0);
    console.log("Adding to Queue - Fetched Services:", services.map((s: any) => ({ name: s.name, duration: s.duration })));
    console.log("Total Calculated Duration:", totalDuration);
    const totalPrice = services.reduce((sum: number, s: any) => sum + Number(s.price || 0), 0);

    // 4. Create booking in DB
    const booking = await BookingRepository.create({
      salonId: salon.id,
      customerName,
      customerPhone,
      serviceIds,
      totalDuration,
      totalPrice,
      date: new Date(date),
      scheduledAt: new Date(date),
      isWalkIn: false,
      status: "upcoming",
    });

    if (!booking) {
      return NextResponse.json({
        success: false,
        message: "Failed to create booking",
      }, { status: 500 });
    }

    // 5. Determine queue position
    const lastQueueItem = await QueueRepository.findOne({
      salonId: salon.id,
      sort: { position: -1 }
    });

    const nextPosition = lastQueueItem ? lastQueueItem.position + 1 : 1;

    // 6. Add to queue
    await QueueRepository.create({
      salonId: salon.id,
      customerName,
      serviceIds,
      position: nextPosition,
      estimatedMinutes: totalDuration,
      scheduledAt: new Date(date),
      isWalkIn: false,
      bookingId: booking.id,
    });

    return NextResponse.json({
      success: true,
      message: "Booking successful",
      bookingId: booking.id,
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
