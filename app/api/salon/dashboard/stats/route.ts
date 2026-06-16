import { NextResponse } from "next/server";
import { BookingRepository } from "@/repositories/BookingRepository";
import { QueueRepository } from "@/repositories/QueueRepository";
import { ServiceRepository } from "@/repositories/ServiceRepository";
import { SaleRepository } from "@/repositories/SaleRepository";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
    try {
        // IDOR Protection: Always use salonId from JWT for owners
        const salonIdFromToken = decoded.salonId;
        if (!salonIdFromToken && decoded.role !== "super_admin") {
            return NextResponse.json({ success: false, message: "Unauthorized: No salon associated" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        // If super_admin, they can request any salonId. If salon_owner, they only see their own.
        const targetSalonId = decoded.role === "super_admin" ? (searchParams.get("salonId") || salonIdFromToken) : salonIdFromToken;

        if (!targetSalonId) {
            return NextResponse.json({ success: false, message: "salonId is required" }, { status: 400 });
        }

        const now = new Date();

        // Start of today (00:00:00)
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        // End of today (23:59:59.999)
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        // Start of current month
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        // End of current month
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        // AUTO-UPDATE STALE BOOKINGS: Mark past-dated upcoming bookings as completed
        const { data: updatedData, error: updateErr } = await supabase
          .from("bookings")
          .update({
            status: "completed",
            completed_at: now.toISOString()
          })
          .eq("salon_id", targetSalonId)
          .eq("status", "upcoming")
          .lt("date", now.toISOString())
          .select("id");
          
        if (updateErr) console.error("Error auto-updating bookings:", updateErr.message);
        if (updatedData && updatedData.length > 0) {
          console.log(`Auto-updated ${updatedData.length} stale booking(s) to completed`);
        }

        // 1. Today's Bookings
        const { count: todayBookingsCount, error: bCountErr } = await supabase
            .from("bookings")
            .select("*", { count: 'exact', head: true })
            .eq("salon_id", targetSalonId)
            .gte("date", todayStart.toISOString())
            .lte("date", todayEnd.toISOString());
        if (bCountErr) throw bCountErr;

        // 2. Active Queue (Waiting status)
        const { count: activeQueueCount, error: qCountErr } = await supabase
            .from("queue_items")
            .select("*", { count: 'exact', head: true })
            .eq("salon_id", targetSalonId)
            .neq("status", "serving");
        if (qCountErr) throw qCountErr;

        // 3. Total Services
        const { count: totalServicesCount, error: sCountErr } = await supabase
            .from("services")
            .select("*", { count: 'exact', head: true })
            .eq("salon_id", targetSalonId);
        if (sCountErr) throw sCountErr;

        const { count: inactiveServicesCount, error: isCountErr } = await supabase
            .from("services")
            .select("*", { count: 'exact', head: true })
            .eq("salon_id", targetSalonId)
            .eq("is_active", false);
        if (isCountErr) throw isCountErr;

        // 4. Monthly Revenue from Bookings (completed + paid)
        const { data: bookingRevData, error: bRevErr } = await supabase
            .from("bookings")
            .select("paid_amount")
            .eq("salon_id", targetSalonId)
            .eq("status", "completed")
            .eq("payment_status", "paid")
            .gte("date", monthStart.toISOString())
            .lte("date", monthEnd.toISOString());
        if (bRevErr) throw bRevErr;
        const bookingRevenue = bookingRevData?.reduce((sum: number, b: any) => sum + Number(b.paid_amount || 0), 0) || 0;

        // 5. Monthly Revenue from Sales (queue completions)
        const { data: saleRevData, error: sRevErr } = await supabase
            .from("sales")
            .select("final_amount")
            .eq("salon_id", targetSalonId)
            .gte("date", monthStart.toISOString())
            .lte("date", monthEnd.toISOString());
        if (sRevErr) throw sRevErr;
        const saleRevenue = saleRevData?.reduce((sum: number, s: any) => sum + Number(s.final_amount || 0), 0) || 0;

        const monthlyRevenue = bookingRevenue + saleRevenue;

        // 5. Recent Activity (Latest 5 completed bookings)
        const recentActivity = await BookingRepository.find({
            salonId: targetSalonId,
            status: "completed"
        });

        const formattedActivity = recentActivity
            .filter((b: any) => b.completedAt)
            .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
            .slice(0, 5)
            .map((b: any) => ({
                _id: b.id,
                name: b.customerName,
                services: b.serviceIds?.map((s: any) => s.name).join(", ") || b.serviceId?.name || "Service",
                date: b.completedAt,
                status: b.status
            }));

        // 6. Today's Schedule
        const todaysSchedule = await BookingRepository.find({
            salonId: targetSalonId,
            date: { $gte: todayStart, $lte: todayEnd }
        });

        return NextResponse.json({
            success: true,
            stats: {
                todayBookings: todayBookingsCount || 0,
                activeQueue: activeQueueCount || 0,
                totalServices: totalServicesCount || 0,
                inactiveServices: inactiveServicesCount || 0,
                monthlyRevenue: monthlyRevenue,
            },
            recentActivity: formattedActivity,
            todaysSchedule: todaysSchedule
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.stack }, { status: 500 });
    }
}

export const GET = withAuth(handler, ["salon_owner", "super_admin"]);
