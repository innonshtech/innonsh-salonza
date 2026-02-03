import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Queue from "@/models/Queue";
import Salon from "@/models/Salon";
import Service from "@/models/Service";
import { sendSMS, sendEmail } from "@/lib/notifications";

export async function POST(req: Request) {
  await dbConnect();
  const { salonId, customerName, serviceId, serviceIds, customerPhone } = await req.json();

  const finalServiceIds = serviceIds || (serviceId ? [serviceId] : []);

  const count = await Queue.countDocuments({ salonId, status: { $ne: "serving" } });
  const position = count + 1;

  const item = await Queue.create({
    salonId,
    customerName,
    customerPhone,
    serviceIds: finalServiceIds,
    serviceId: finalServiceIds[0], // Keep for compatibility
    position,
  });

  // Fetch salon and services
  const [salon, services] = await Promise.all([
    Salon.findById(salonId),
    Service.find({ _id: { $in: finalServiceIds } }),
  ]);

  const serviceNames = services.map(s => s.name).join(", ");

  // Notify customer via SMS
  if (customerPhone) {
    const body = `Hi ${customerName}, you are added to the queue at ${salon?.name}. Your token: ${item._id.slice(-4)} (pos ${position}). We'll notify you when it's your turn.`;
    try {
      await sendSMS({ to: customerPhone, body });
    } catch (err) {
      console.error("SMS error:", err);
    }
  }

  // Optionally notify owner by email
  const owner = await (await import("@/models/User")).default.findById(salon?.ownerId);
  if (owner?.email) {
    try {
      await sendEmail({
        to: owner.email,
        subject: `New queue - ${customerName}`,
        html: `<p>${customerName} added to queue (pos ${position}) for ${serviceNames}</p>`,
      });
    } catch (err) {
      console.error("Email error:", err);
    }
  }

  return NextResponse.json({ success: true, item });
}
