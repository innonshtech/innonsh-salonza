import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Service from "@/models/Service";
import Booking from "@/models/Booking";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
    try {
        await dbConnect();
        
        const salonId = decoded.salonId;
        if (!salonId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        // 1. Active / Inactive Counts
        const activeCount = await Service.countDocuments({
            salonId,
            isActive: { $ne: false }
        });

        const inactiveCount = await Service.countDocuments({
            salonId,
            isActive: false
        });

        // 2. Today's Activity
        const todaysActivity = await Booking.find({
            salonId,
            date: { $gte: startOfDay, $lte: endOfDay }
        })
        .populate("serviceIds")
        .sort({ date: 1 })
        .limit(5)
        .lean();

        // 3. Upcoming Activity
        const upcomingActivity = await Booking.find({
            salonId,
            date: { $gt: endOfDay }
        })
        .populate("serviceIds")
        .sort({ date: 1 })
        .limit(5)
        .lean();

        return NextResponse.json({
            success: true,
            counts: {
                active: activeCount,
                inactive: inactiveCount
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
