import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import Service from "@/models/Service";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    await dbConnect();
    const { bookingId, paidAmount, paymentDone } = await req.json();

    if (!paymentDone) {
      return NextResponse.json({ success: false, message: "Payment required before completion" }, { status: 400 });
    }

    if (!bookingId) {
      return NextResponse.json({ success: false, message: "bookingId is required" }, { status: 400 });
    }

    const salonId = decoded.salonId;
    // For salon_owner, salonId must be present; super_admin can bypass
    if (!salonId && decoded.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    // Build query: if super_admin, we don't filter by salonId (they can complete any)
    const query: any = { _id: bookingId };
    if (salonId) {
      query.salonId = salonId;
    }

    const booking = await Booking.findOne(query);

    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    // Helper: Calculate amount from service IDs
    const calculateAmount = async (b: any) => {
      const serviceIds = b.serviceIds && b.serviceIds.length > 0
        ? b.serviceIds
        : b.serviceId
        ? [b.serviceId]
        : [];

      if (serviceIds.length === 0) return 0;

      const services = await Service.find({ _id: { $in: serviceIds } });
      return services.reduce((sum: number, s: any) => sum + (s.price || 0), 0);
    };

    // If already completed, just ensure payment status is set
    if (booking.status === "completed") {
      if (booking.paymentStatus !== "paid") {
        booking.paymentStatus = "paid";

        let amount = paidAmount;
        if (amount === undefined) {
          amount = (booking.totalPrice && booking.totalPrice > 0)
            ? booking.totalPrice
            : await calculateAmount(booking);
        }
        booking.paidAmount = amount;

        // Backfill totalPrice if missing
        if (!booking.totalPrice) booking.totalPrice = amount;

        await booking.save();
        return NextResponse.json({ success: true, booking, message: "Payment updated for completed booking" });
      }
      return NextResponse.json({ success: false, message: "Booking already completed and paid" }, { status: 400 });
    }

    // Mark as completed and paid
    booking.status = "completed";
    booking.paymentStatus = "paid";

    let amount = paidAmount;
    if (amount === undefined) {
      amount = (booking.totalPrice && booking.totalPrice > 0)
        ? booking.totalPrice
        : await calculateAmount(booking);
    }
    booking.paidAmount = amount;

    // Backfill totalPrice
    if (!booking.totalPrice) booking.totalPrice = amount;

    await booking.save();

    return NextResponse.json({ success: true, booking, message: "Booking completed and payment recorded" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}

export const POST = withAuth(handler, ["salon_owner", "super_admin"]);
