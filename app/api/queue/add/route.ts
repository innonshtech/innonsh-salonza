import { NextResponse } from "next/server";
import { withAuth } from "@/lib/apiAuth";
import dbConnect from "@/lib/dbConnect";
import Queue from "@/models/Queue";
import Salon from "@/models/Salon";
import Service from "@/models/Service";
import { sendSMS, sendEmail } from "@/lib/notifications";

async function handler(req: Request, decoded: any) {
  try {
    await dbConnect();
    const { customerName, serviceIds, customerPhone } = await req.json();

    // Force salonId from JWT to prevent IDOR
    const salonId = decoded.salonId;
    if (!salonId) {
      return NextResponse.json({ success: false, message: "Salon identity not found in session" }, { status: 403 });
    }

    const finalServiceIds = serviceIds || [];

    const count = await Queue.countDocuments({ salonId, status: { $ne: "serving" } });
    const position = count + 1;

    const item = await Queue.create({
      salonId,
      customerName,
      customerPhone,
      serviceIds: finalServiceIds,
      serviceId: finalServiceIds[0] || null, 
      position,
    });

    // Fetch details for notifications
    const [salon, services] = await Promise.all([
      Salon.findById(salonId),
      Service.find({ _id: { $in: finalServiceIds } }),
    ]);

    const serviceNames = services.map(s => s.name).join(", ");

    // Notify customer
    if (customerPhone) {
      const body = `Hi ${customerName}, you are added to the queue at ${salon?.name}. Your token: ${item._id.toString().slice(-4)} (pos ${position}). We'll notify you when it's your turn.`;
      try {
        await sendSMS({ to: customerPhone, body });
      } catch (err) {
        console.error("SMS notification failed:", err);
      }
    }

    // Notify owner
    const User = (await import("@/models/User")).default;
    const owner = await User.findById(salon?.ownerId);
    if (owner?.email) {
      try {
        await sendEmail({
          to: owner.email,
          subject: `New Customer Assigned - ${customerName}`,
          html: `<p><b>${customerName}</b> has been added to your queue at position <b>${position}</b> for ${serviceNames}.</p>`,
        });
      } catch (err) {
        console.error("Owner email notification failed:", err);
      }
    }

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    console.error("Queue add error:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to add to queue" }, { status: 500 });
  }
}

export const POST = withAuth(handler);

