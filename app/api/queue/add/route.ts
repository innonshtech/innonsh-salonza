import { NextResponse } from "next/server";
import { withAuth } from "@/lib/apiAuth";
import { QueueRepository } from "@/repositories/QueueRepository";
import { SalonRepository } from "@/repositories/SalonRepository";
import { ServiceRepository } from "@/repositories/ServiceRepository";
import { UserRepository } from "@/repositories/UserRepository";
import { supabase } from "@/lib/supabase";
import { sendSMS, sendEmail } from "@/lib/notifications";

async function handler(req: Request, decoded: any) {
  try {
    const { customerName, serviceIds, customerPhone, scheduledAt } = await req.json();

    const finalScheduledAt = scheduledAt ? new Date(scheduledAt) : new Date();

    // Force salonId from JWT to prevent IDOR
    const salonId = decoded.salonId;
    if (!salonId) {
      return NextResponse.json({ success: false, message: "Salon identity not found in session" }, { status: 403 });
    }

    const finalServiceIds = serviceIds || [];

    // Count waiting queue items
    const { count, error: countErr } = await supabase
      .from("queue_items")
      .select("*", { count: 'exact', head: true })
      .eq("salon_id", salonId)
      .neq("status", "serving");

    if (countErr) throw countErr;
    const position = (count || 0) + 1;

    const [salon, services] = await Promise.all([
      SalonRepository.findById(salonId),
      ServiceRepository.find({ _id: { $in: finalServiceIds } }),
    ]);

    const totalDuration = services.reduce((sum: number, s: any) => sum + Number(s.duration || 0), 0);
    console.log("Walk-in Queue - Fetched Services:", services.map((s: any) => ({ name: s.name, duration: s.duration })));
    console.log("Total Calculated Duration:", totalDuration);

    const item = await QueueRepository.create({
      salonId,
      customerName,
      customerPhone,
      serviceIds: finalServiceIds,
      serviceId: finalServiceIds[0] || undefined, 
      position,
      scheduledAt: finalScheduledAt,
      isWalkIn: true,
      estimatedMinutes: totalDuration,
    });

    if (!item) {
      return NextResponse.json({ success: false, message: "Failed to create queue item" }, { status: 500 });
    }

    const serviceNames = services.map((s: any) => s.name).join(", ");

    // Notify customer
    if (customerPhone) {
      const body = `Hi ${customerName}, you are added to the queue at ${salon?.name}. Your token: ${item.id.toString().slice(-4)} (pos ${position}). We'll notify you when it's your turn.`;
      try {
        await sendSMS({ to: customerPhone, body });
      } catch (err) {
        console.error("SMS notification failed:", err);
      }
    }

    // Notify owner
    if (salon?.ownerId) {
      const owner = await UserRepository.findById(salon.ownerId);
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
    }

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    console.error("Queue add error:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to add to queue" }, { status: 500 });
  }
}

export const POST = withAuth(handler);

