import { NextResponse } from "next/server";
import { withAuth } from "@/lib/apiAuth";
import dbConnect from "@/lib/dbConnect";
import Queue from "@/models/Queue";
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

    const wasServing = item.status === "serving";

    // 2. If it was serving, record a consolidated sale for the session
    if (wasServing) {
      try {
        const finalServiceIds = item.serviceIds && item.serviceIds.length > 0
          ? item.serviceIds
          : (item.serviceId ? [item.serviceId] : []);

        if (finalServiceIds.length > 0) {
          const services = await Service.find({ _id: { $in: finalServiceIds } });
          const servicesData = services.map(s => ({
            serviceId: s._id,
            name: s.name,
            price: s.price
          }));

          const totalAmount = servicesData.reduce((sum, s) => sum + s.price, 0);
          const discountAmount = discount?.amount || 0;
          const finalAmount = totalAmount - discountAmount;

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
            date: new Date()
          });

          // 3. CRM Integration
          if (item.customerPhone) {
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
          }
        }
      } catch (err) {
        console.error("Error creating sale/CRM record:", err);
      }
    }

    // 3. Remove the item
    await Queue.findByIdAndDelete(id);

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

