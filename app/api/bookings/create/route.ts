// app/api/bookings/create/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Salon from "@/models/Salon";
import Service from "@/models/Service";
import Booking from "@/models/Booking";
import { sendEmail, sendSMS } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { salonSlug, serviceId, customerName, customerPhone, date } = await req.json();

    const salon = await Salon.findOne({ slug: salonSlug });
    if (!salon) return NextResponse.json({ success: false, message: "Salon not found" });

    const service = await Service.findById(serviceId);
    if (!service) return NextResponse.json({ success: false, message: "Service not found" });

    // create booking
    const booking = await Booking.create({
      salonId: salon._id,
      serviceId,
      customerName,
      customerPhone,
      date: date ? new Date(date) : new Date(),
      status: "upcoming",
    });

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
      const owner = await (await import("@/models/User")).default.findById(salon.ownerId);
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
