import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import Queue from "@/models/Queue";
import Service from "@/models/Service";
import moment from "moment";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
    try {
        await dbConnect();
        
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

        const todayStart = moment().startOf('day').toDate();
        const todayEnd = moment().endOf('day').toDate();
        const monthStart = moment().startOf('month').toDate();

        // 1. Today's Bookings
        const todayBookingsCount = await Booking.countDocuments({
            salonId: targetSalonId,
            date: { $gte: todayStart, $lte: todayEnd }
        });

        // 2. Active Queue (Waiting or Unassigned status)
        const activeQueueCount = await Queue.countDocuments({
            salonId: targetSalonId,
            status: { $ne: "serving" }
        });

        // 3. Total Services
        const totalServicesCount = await Service.countDocuments({ salonId: targetSalonId });

        // 4. Monthly Revenue
        const completedBookingsThisMonth = await Booking.find({
            salonId: targetSalonId,
            status: "completed",
            date: { $gte: monthStart }
        });
        const monthlyRevenue = completedBookingsThisMonth.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

        // 5. Recent Activity (Last 5 bookings or queue entries)
        const recentBookings = await Booking.find({ salonId: targetSalonId })
            .populate("serviceIds")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // 6. Today's Schedule
        const todaysSchedule = await Booking.find({
            salonId: targetSalonId,
            date: { $gte: todayStart, $lte: todayEnd }
        })
            .populate("serviceIds")
            .sort({ date: 1 })
            .lean();

        return NextResponse.json({
            success: true,
            stats: {
                todayBookings: todayBookingsCount,
                activeQueue: activeQueueCount,
                totalServices: totalServicesCount,
                monthlyRevenue: monthlyRevenue,
            },
            recentActivity: recentBookings,
            todaysSchedule: todaysSchedule
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.stack }, { status: 500 });
    }
}

export const GET = withAuth(handler, ["salon_owner", "super_admin"]);
