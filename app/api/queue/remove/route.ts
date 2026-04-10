import { NextResponse } from "next/server";
import { withAuth } from "@/lib/apiAuth";
import dbConnect from "@/lib/dbConnect";
import Queue from "@/models/Queue";
import Booking from "@/models/Booking";
import Sale from "@/models/Sale";
import Service from "@/models/Service";
import { sendSMS } from "@/lib/notifications";

async function handler(req: Request, decoded: any) {
  try {
    await dbConnect();
    const { id, paymentMethod, paymentSplit, discount } = await req.json();

    const salonId = decoded.salonId;
    if (!salonId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    // 1. Get the item and verify ownership
    const item = await Queue.findById(id);
    if (!item) return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });

    if (item.salonId.toString() !== salonId) {
      return NextResponse.json({ success: false, message: "Ownership mismatch" }, { status: 403 });
    }

    console.log("Completing queue payment for item:", { id, customerName: item.customerName, wasServing: item.status === "serving", bookingId: item.bookingId });

    const wasServing = item.status === "serving";

    // 2. If it was serving, process payment (either update linked Booking or create Sale)
    if (wasServing) {
      const finalServiceIds = item.serviceIds && item.serviceIds.length > 0
        ? item.serviceIds
        : (item.serviceId ? [item.serviceId] : []);

      if (finalServiceIds.length === 0) {
        return NextResponse.json({ success: false, message: "No services associated with this queue item" }, { status: 400 });
      }

      const services = await Service.find({ _id: { $in: finalServiceIds } });
      const servicesData = services.map(s => ({
        serviceId: s._id,
        name: s.name,
        price: s.price
      }));

      const totalAmount = servicesData.reduce((sum, s) => sum + s.price, 0);
      const discountAmount = discount?.amount || 0;
      const finalAmount = totalAmount - discountAmount;

      console.log("Payment calculation:", { totalAmount, discountAmount, finalAmount, paymentMethod, paymentSplit });

      // 2.a Update linked booking (if exists)
      if (item.bookingId) {
        try {
          const booking = await Booking.findById(item.bookingId);
          if (booking) {
            booking.status = "completed";
            booking.paymentStatus = "paid";
            booking.paidAmount = finalAmount;
            booking.completedAt = new Date();
            await booking.save();
            console.log(`Booking ${booking._id} marked as completed & paid via queue completion`);
          }
        } catch (err) {
          console.error("Error updating linked booking:", err);
        }
      }

      // 2.b Create Sale (Single Source of Truth for Revenue Analytics)
      try {
        const sale = await Sale.create({
          salonId: item.salonId,
          staffId: item.staffId,
          customerName: item.customerName,
          customerPhone: item.customerPhone,
          services: servicesData,
          totalAmount,
          discount: {
            type: discount?.type || "none",
            value: discount?.value || 0,
            amount: discountAmount
          },
          finalAmount,
          paymentMethod: paymentMethod || "cash",
          paymentSplit: {
            cash: paymentSplit?.cash || (paymentMethod === "cash" ? finalAmount : 0),
            online: paymentSplit?.online || (paymentMethod === "online" ? finalAmount : 0)
          },
          date: new Date(),
          bookingId: item.bookingId // Link to booking if applicable
        });
        console.log(`Sale created for queue item ${item._id}: ${sale._id}`);
      } catch (err) {
        console.error("Error creating sale:", err);
        return NextResponse.json({ success: false, message: "Failed to record sale" }, { status: 500 });
      }

      // CRM Integration (for both booking and walk-in)
      if (item.customerPhone) {
        try {
          const Client = (await import("@/models/Client")).default;
          const pointsEarned = Math.floor(finalAmount / 100);

          await Client.findOneAndUpdate(
            { salonId: item.salonId, phone: item.customerPhone },
            {
              $set: {
                name: item.customerName,
                lastVisit: new Date()
              },
              $inc: {
                totalVisits: 1,
                totalSpent: finalAmount,
                loyaltyPoints: pointsEarned
              }
            },
            { upsert: true, new: true }
          );
          console.log("CRM updated for customer:", item.customerPhone);
        } catch (err) {
          console.error("Error updating CRM:", err);
          // CRM failure shouldn't block payment completion
        }
      }
    }

    // 3. Remove the item
    await Queue.findByIdAndDelete(id);

    // 3.a AUTO STATUS SYNC: Set staff back to available
    if (wasServing && item.staffId) {
      try {
        const Staff = (await import("@/models/Staff")).default;
        await Staff.findByIdAndUpdate(item.staffId, { status: "available" });
        console.log(`Staff ${item.staffId} set back to available after completing ${item.customerName}`);
      } catch (err) {
        console.error("Error resetting staff status:", err);
      }
    }

    // 4. Re-index waiting positions
    const items = await Queue.find({
      salonId: salonId,
      status: "waiting"
    }).sort({ position: 1, createdAt: 1 });

    for (let i = 0; i < items.length; i++) {
      items[i].position = i + 1;
      await items[i].save();
    }

    // 5. Optionally notify
    const notifyCount = Math.min(2, items.length);
    for (let i = 0; i < notifyCount; i++) {
      try {
        const it = items[i];
        if ((it as any).customerPhone) {
          await sendSMS({
            to: (it as any).customerPhone,
            body: `Hi ${(it as any).customerName}, your position at the salon is now ${it.position}. See you soon!`,
          });
        }
      } catch (err) {
        console.error("Notify error", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const POST = withAuth(handler);
