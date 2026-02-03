import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import Queue from "@/models/Queue";
import Service from "@/models/Service";
import moment from "moment";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const salonId = searchParams.get("salonId");

        if (!salonId) {
            return NextResponse.json({ success: false, message: "salonId is required" });
        }

        const todayStart = moment().startOf('day').toDate();
        const todayEnd = moment().endOf('day').toDate();
        const monthStart = moment().startOf('month').toDate();

        // 1. Today's Bookings
        const todayBookingsCount = await Booking.countDocuments({
            salonId,
            date: { $gte: todayStart, $lte: todayEnd }
        });

        // 2. Active Queue (Waiting or Unassigned status)
        const activeQueueCount = await Queue.countDocuments({
            salonId,
            status: { $ne: "serving" }
        });

        // 3. Total Services
        const totalServicesCount = await Service.countDocuments({ salonId });

        // 4. Monthly Revenue
        const completedBookingsThisMonth = await Booking.find({
            salonId,
            status: "completed",
            date: { $gte: monthStart }
        });
        const monthlyRevenue = completedBookingsThisMonth.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

        // 5. Recent Activity (Last 5 bookings or queue entries)
        const recentBookings = await Booking.find({ salonId })
            .populate("serviceIds")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // 6. Today's Schedule
        const todaysSchedule = await Booking.find({
            salonId,
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
        return NextResponse.json({ success: false, error: err.message });
    }
}
