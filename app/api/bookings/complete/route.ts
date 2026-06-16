import { NextResponse } from "next/server";
import { BookingRepository } from "@/repositories/BookingRepository";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
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

    const booking = await BookingRepository.findById(bookingId);

    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    if (salonId && booking.salonId.toString() !== salonId.toString() && decoded.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Forbidden: You don't own this booking" }, { status: 403 });
    }

    // Helper: Calculate amount from mapped service objects
    const calculateAmount = (b: any) => {
      if (!b.serviceIds || b.serviceIds.length === 0) return 0;
      return b.serviceIds.reduce((sum: number, s: any) => sum + (Number(s.price) || 0), 0);
    };

    // If already completed, just ensure payment status is set
    if (booking.status === "completed") {
      if (booking.paymentStatus !== "paid") {
        let amount = paidAmount;
        if (amount === undefined) {
          amount = (booking.totalPrice && booking.totalPrice > 0)
            ? booking.totalPrice
            : calculateAmount(booking);
        }

        const updatedBooking = await BookingRepository.update(bookingId, {
          paymentStatus: "paid",
          paidAmount: amount,
          totalPrice: booking.totalPrice || amount
        });

        return NextResponse.json({ success: true, booking: updatedBooking, message: "Payment updated for completed booking" });
      }
      return NextResponse.json({ success: false, message: "Booking already completed and paid" }, { status: 400 });
    }

    // Mark as completed and paid
    let amount = paidAmount;
    if (amount === undefined) {
      amount = (booking.totalPrice && booking.totalPrice > 0)
        ? booking.totalPrice
        : calculateAmount(booking);
    }

    const updatedBooking = await BookingRepository.update(bookingId, {
      status: "completed",
      paymentStatus: "paid",
      paidAmount: amount,
      totalPrice: booking.totalPrice || amount,
      completedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, booking: updatedBooking, message: "Booking completed and payment recorded" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}

export const POST = withAuth(handler, ["salon_owner", "super_admin"]);
