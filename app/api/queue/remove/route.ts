import { NextResponse } from "next/server";
import { withAuth } from "@/lib/apiAuth";
import { QueueRepository } from "@/repositories/QueueRepository";
import { BookingRepository } from "@/repositories/BookingRepository";
import { SaleRepository } from "@/repositories/SaleRepository";
import { ServiceRepository } from "@/repositories/ServiceRepository";
import { CustomerRepository } from "@/repositories/CustomerRepository";
import { StaffRepository } from "@/repositories/StaffRepository";
import { sendSMS } from "@/lib/notifications";

async function handler(req: Request, decoded: any) {
  try {
    const { id, paymentMethod, paymentSplit, discount } = await req.json();

    const salonId = decoded.salonId;
    if (!salonId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    // 1. Get the item and verify ownership
    const item = await QueueRepository.findById(id);
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

      const services = await ServiceRepository.find({ _id: { $in: finalServiceIds } });
      const servicesData = services.map((s: any) => ({
        serviceId: s.id,
        name: s.name,
        price: s.price
      }));

      const totalAmount = servicesData.reduce((sum: number, s: any) => sum + s.price, 0);
      const discountAmount = discount?.amount || 0;
      const finalAmount = totalAmount - discountAmount;

      console.log("Payment calculation:", { totalAmount, discountAmount, finalAmount, paymentMethod, paymentSplit });

      // 2.a Update linked booking (if exists)
      if (item.bookingId) {
        try {
          const booking = await BookingRepository.findById(item.bookingId);
          if (booking) {
            await BookingRepository.update(booking.id, {
              status: "completed",
              paymentStatus: "paid",
              paidAmount: finalAmount,
              completedAt: new Date()
            });
            console.log(`Booking ${booking.id} marked as completed & paid via queue completion`);
          }
        } catch (err) {
          console.error("Error updating linked booking:", err);
        }
      }

      // 2.b Create Sale (Single Source of Truth for Revenue Analytics)
      try {
        const sale = await SaleRepository.create({
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

        if (!sale) {
          throw new Error("Sale creation returned null");
        }

        console.log(`Sale created for queue item ${item.id}: ${sale.id}`);
      } catch (err) {
        console.error("Error creating sale:", err);
        return NextResponse.json({ success: false, message: "Failed to record sale" }, { status: 500 });
      }

      // CRM Integration (for both booking and walk-in)
      if (item.customerPhone) {
        try {
          const pointsEarned = Math.floor(finalAmount / 100);

          const existing = await CustomerRepository.findOne({ salonId: item.salonId, phone: item.customerPhone });
          if (existing) {
            await CustomerRepository.update(existing.id, {
              name: item.customerName,
              lastVisit: new Date().toISOString(),
              totalVisits: (existing.totalVisits || 0) + 1,
              totalSpent: (existing.totalSpent || 0) + finalAmount,
              loyaltyPoints: (existing.loyaltyPoints || 0) + pointsEarned
            });
          } else {
            await CustomerRepository.create({
              salonId: item.salonId,
              phone: item.customerPhone,
              name: item.customerName,
              loyaltyPoints: pointsEarned,
              notes: ""
            });
            const fresh = await CustomerRepository.findOne({ salonId: item.salonId, phone: item.customerPhone });
            if (fresh) {
              await CustomerRepository.update(fresh.id, {
                totalVisits: 1,
                totalSpent: finalAmount,
                lastVisit: new Date().toISOString()
              });
            }
          }
          console.log("CRM updated for customer:", item.customerPhone);
        } catch (err) {
          console.error("Error updating CRM:", err);
        }
      }
    }

    // 3. Remove the item
    await QueueRepository.delete(id);

    // 3.a AUTO STATUS SYNC: Set staff back to available
    if (wasServing && item.staffId) {
      try {
        await StaffRepository.update(item.staffId, { 
          status: "available",
          currentStatus: "available"
        });
        console.log(`Staff ${item.staffId} set back to available after completing ${item.customerName}`);
      } catch (err) {
        console.error("Error resetting staff status:", err);
      }
    }

    // 4. Re-index waiting positions
    const items = await QueueRepository.find({
      salonId: salonId,
      status: "waiting"
    });

    // Sort items to ensure order
    const sortedItems = [...items].sort((a, b) => (a.position || 0) - (b.position || 0));

    for (let i = 0; i < sortedItems.length; i++) {
      const pos = i + 1;
      await QueueRepository.update(sortedItems[i].id, { position: pos });
    }

    // 5. Optionally notify
    const notifyCount = Math.min(2, sortedItems.length);
    for (let i = 0; i < notifyCount; i++) {
      try {
        const it = sortedItems[i];
        if (it.customerPhone) {
          await sendSMS({
            to: it.customerPhone,
            body: `Hi ${it.customerName}, your position at the salon is now ${i + 1}. See you soon!`,
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
