import { NextResponse } from "next/server";
import { SalonRepository } from "@/repositories/SalonRepository";
import { ServiceRepository } from "@/repositories/ServiceRepository";
import { BookingRepository } from "@/repositories/BookingRepository";
import { UserRepository } from "@/repositories/UserRepository";
import { sendEmail, sendSMS } from "@/lib/notifications";
import { withValidation } from "@/lib/validate";
import { bookingCreateSchema } from "@/lib/validations";

async function handler(req: Request) {
  try {
    const { salonSlug, serviceId, customerName, customerPhone, date } = await req.json();

    const salon = await SalonRepository.findOne({ slug: salonSlug });
    if (!salon) return NextResponse.json({ success: false, message: "Salon not found" });

    const service = await ServiceRepository.findById(serviceId);
    if (!service) return NextResponse.json({ success: false, message: "Service not found" });

    // create booking with total price and duration
    const booking = await BookingRepository.create({
      salonId: salon.id,
      serviceId,
      customerName,
      customerPhone,
      date: date ? new Date(date) : new Date(),
      status: "upcoming",
      totalPrice: service.price,
      totalDuration: service.duration,
    });

    if (!booking) {
      return NextResponse.json({ success: false, message: "Failed to create booking" }, { status: 500 });
    }

    // Notify customer via SMS (if phone provided)
    if (customerPhone) {
      const smsBody = `Hi ${customerName}, your booking at ${salon.name} is confirmed for ${service.name}. We look forward to seeing you!`;
      try {
        await sendSMS({ to: customerPhone, body: smsBody });
      } catch (err) {
        console.error("SMS error:", err);
      }
    }

    // Notify salon owner by email
    if (salon.ownerId) {
      // fetch owner email (lightweight)
      const owner = await UserRepository.findById(salon.ownerId);
      if (owner?.email) {
        const subject = `New booking: ${customerName} — ${service.name}`;
        const html = `<p>New booking for <strong>${service.name}</strong></p>
                      <p>Customer: ${customerName} (${customerPhone || "no phone"})</p>
                      <p>Date: ${new Date(booking.date).toLocaleString()}</p>`;
        try {
          await sendEmail({ to: owner.email, subject, html });
        } catch (err) {
          console.error("Email error:", err);
        }
      }
    }

    return NextResponse.json({ success: true, message: "Booking created", booking });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export const POST = withValidation(bookingCreateSchema, handler);

