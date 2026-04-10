import { NextResponse } from "next/server";
import { withAuth } from "@/lib/apiAuth";
import dbConnect from "@/lib/dbConnect";
import Queue from "@/models/Queue";
import Service from "@/models/Service";

async function handler(req: Request, decoded: any) {
  try {
    await dbConnect();

    // Use salonId from JWT for security
    const salonId = decoded.salonId;
    if (!salonId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const queue = await Queue.find({ salonId }).sort({ position: 1 }).lean();

    // 1. Sort the queue using Smart Logic: Booked > Walk-in, then by scheduledAt
    const sortedQueue = [...queue].sort((a: any, b: any) => {
        // "Serving" items always stay at the top (don't reorder them via this logic)
        if (a.status === "serving" && b.status !== "serving") return -1;
        if (b.status === "serving" && a.status !== "serving") return 1;

        // Priority 1: booked > walk-in (isWalkIn true means later priority)
        if (a.isWalkIn !== b.isWalkIn) {
            return a.isWalkIn ? 1 : -1;
        }

        // Priority 2: Then by scheduled time
        const timeA = a.scheduledAt ? new Date(a.scheduledAt).getTime() : new Date(a.createdAt).getTime();
        const timeB = b.scheduledAt ? new Date(b.scheduledAt).getTime() : new Date(b.createdAt).getTime();
        return timeA - timeB;
    });

    // 2. Calculate wait times
    let cumulativeTime = 0;
    const now = Date.now();

    // Fetch all services for the current salon to use as a fallback/cache
    const salonServices = await Service.find({ salonId }).lean();
    const serviceMap = new Map(salonServices.map((s: any) => [s._id.toString(), s]));

    const enrichedQueue = sortedQueue.map((item: any) => {
        // Items currently being served have 0 wait time remaining
        const waitTime = item.status === "serving" ? 0 : cumulativeTime;
        
        let duration = 0;
        
        // Priority 1: Use denormalized 'services' array
        if (item.services && item.services.length > 0) {
            duration = item.services.reduce((sum: number, s: any) => sum + Number(s.duration || 0), 0);
        } 
        
        // Priority 2: If duration is still 0, calculate from serviceIds using master list
        if (duration === 0 && item.serviceIds && item.serviceIds.length > 0) {
            duration = item.serviceIds.reduce((sum: number, sid: any) => {
                const s = serviceMap.get(sid.toString());
                return sum + Number(s?.duration || 0);
            }, 0);
        }

        // Priority 3: Fallback to estimatedMinutes or a sensible default if everything else fails
        if (duration === 0) {
            duration = Number(item.estimatedMinutes || 15); // Fallback to 15 for old data if no services found
        }
        
        // Only add to cumulative time if they are waiting
        if (item.status !== "serving") {
            cumulativeTime += duration;
        }

        return {
            ...item,
            _id: item._id.toString(),
            staffId: item.staffId ? item.staffId.toString() : undefined,
            status: item.status || "waiting",
            totalDuration: duration,
            waitTime,
            estimatedStartTime: new Date(now + (waitTime * 60000))
        };
    });

    return NextResponse.json({ success: true, queue: enrichedQueue });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const GET = withAuth(handler);

