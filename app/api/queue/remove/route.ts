import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Queue from "@/models/Queue";
import Sale from "@/models/Sale";
import Service from "@/models/Service";
import { sendSMS } from "@/lib/notifications";

export async function POST(req: Request) {
  await dbConnect();
  const { id, paymentMethod, paymentSplit, discount } = await req.json();

  // 1. Get the item before deleting to check status and data
  const item = await Queue.findById(id);
  if (!item) return NextResponse.json({ success: false, message: "Item not found" });

  const salonId = item.salonId;
  const wasServing = item.status === "serving";

  // 2. If it was serving, record a consolidated sale for the session
  if (wasServing) {
    try {
      const finalServiceIds = item.serviceIds && item.serviceIds.length > 0
        ? item.serviceIds
        : (item.serviceId ? [item.serviceId] : []);

      if (finalServiceIds.length > 0) {
        // Fetch all services to get names and prices
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

        // 3. CRM Integration: Update/Create Client record
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
          body: `Hi ${(it as any).customerName}, your position at the salon is now ${it.position}. Estimated wait updated.`,
        });
      }
    } catch (err) {
      console.error("Notify error", err);
    }
  }

  return NextResponse.json({ success: true });
}
