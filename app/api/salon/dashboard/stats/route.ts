import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import Queue from "@/models/Queue";
import Service from "@/models/Service";
import Sale from "@/models/Sale";
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

        const now = new Date();

        // Start of today (00:00:00)
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        // End of today (23:59:59.999)
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        // Start of current month
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        // End of current month
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        // Debug logs
        console.log("Start of Month:", monthStart);
        console.log("End of Month:", monthEnd);

        // AUTO-UPDATE STALE BOOKINGS: Mark past-dated upcoming bookings as completed
        // This prevents stale data in dashboard
        const autoUpdateResult = await Booking.updateMany(
          {
            salonId: targetSalonId,
            status: "upcoming",
            date: { $lt: now }
          },
          {
            $set: {
              status: "completed",
              completedAt: now
            }
          }
        );
        if (autoUpdateResult.modifiedCount > 0) {
          console.log(`Auto-updated ${autoUpdateResult.modifiedCount} stale booking(s) to completed`);
        }

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
        const inactiveServicesCount = await Service.countDocuments({ salonId: targetSalonId, isActive: false });

        // 4. Monthly Revenue from Bookings (completed + paid)
        const bookingRevenueResult = await Booking.aggregate([
            {
                $match: {
                    salonId: targetSalonId,
                    status: "completed",
                    paymentStatus: "paid",
                    date: { $gte: monthStart, $lte: monthEnd }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$paidAmount" }
                }
            }
        ]);
        const bookingRevenue = bookingRevenueResult[0]?.totalRevenue || 0;

        // 5. Monthly Revenue from Sales (queue completions)
        const saleRevenueResult = await Sale.aggregate([
            {
                $match: {
                    salonId: targetSalonId,
                    date: { $gte: monthStart, $lte: monthEnd }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$finalAmount" }
                }
            }
        ]);
        const saleRevenue = saleRevenueResult[0]?.totalRevenue || 0;

        const monthlyRevenue = bookingRevenue + saleRevenue;

        // Debug log
        console.log("Revenue Calculation:", {
          salonId: targetSalonId,
          monthStart,
          monthEnd,
          bookingRevenue,
          saleRevenue,
          total: monthlyRevenue
        });

        // 5. Recent Activity (Latest 5 completed bookings)
        const recentActivity = await Booking.find({
            salonId: targetSalonId,
            status: "completed",
            completedAt: { $exists: true }
        })
            .populate("serviceIds")
            .sort({ completedAt: -1 })
            .limit(5)
            .lean();

        console.log("Recent Activity:", recentActivity);

        const formattedActivity = recentActivity.map((b: any) => ({
            _id: b._id,
            name: b.customerName,
            services: b.serviceIds?.map((s: any) => s.name).join(", ") || b.serviceId?.name || "Service",
            date: b.completedAt,
            status: b.status
        }));

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
                inactiveServices: inactiveServicesCount,
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
