import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { BookingRepository } from "@/repositories/BookingRepository";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
    try {
        const salonId = decoded.salonId;
        if (!salonId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        // 1. Active / Inactive Counts
        const { count: activeCount } = await supabase
            .from("services")
            .select("*", { count: "exact", head: true })
            .eq("salon_id", salonId)
            .eq("is_active", true);

        const { count: inactiveCount } = await supabase
            .from("services")
            .select("*", { count: "exact", head: true })
            .eq("salon_id", salonId)
            .eq("is_active", false);

        // 2. Today's Activity
        const todaysBookings = await BookingRepository.find({
            salonId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });
        const todaysActivity = todaysBookings.slice(0, 5);

        // 3. Upcoming Activity
        const upcomingBookings = await BookingRepository.find({
            salonId,
            date: { $gte: new Date(endOfDay.getTime() + 1) }
        });
        const upcomingActivity = upcomingBookings.slice(0, 5);

        return NextResponse.json({
            success: true,
            counts: {
                active: activeCount || 0,
                inactive: inactiveCount || 0
            },
            todaysActivity,
            upcomingActivity
        });
    } catch (error: any) {
        console.error("Service activity API error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export const GET = withAuth(handler, ["salon_owner", "super_admin"]);
