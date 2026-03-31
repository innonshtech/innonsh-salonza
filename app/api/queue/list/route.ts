import { NextResponse } from "next/server";
import { withAuth } from "@/lib/apiAuth";
import dbConnect from "@/lib/dbConnect";
import Queue from "@/models/Queue";

async function handler(req: Request, decoded: any) {
  try {
    await dbConnect();

    // Use salonId from JWT for security
    const salonId = decoded.salonId;
    if (!salonId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const queue = await Queue.find({ salonId }).sort({ position: 1 }).lean();

    // Ensure every item has a status and string IDs
    const normalizedQueue = queue.map((item: any) => ({
      ...item,
      _id: item._id.toString(),
      staffId: item.staffId ? item.staffId.toString() : undefined,
      status: item.status || "waiting"
    }));

    return NextResponse.json({ success: true, queue: normalizedQueue });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const GET = withAuth(handler);

