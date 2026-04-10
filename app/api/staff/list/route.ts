import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Staff from "@/models/Staff";
import { withAuth } from "@/lib/apiAuth";

async function getHandler(req: Request, decoded: any) {
  try {
    await dbConnect();

    // IDOR Protection: Always use salonId from JWT
    if (!decoded.salonId) {
      return NextResponse.json({ success: false, message: "Unauthorized: No salon associated" }, { status: 403 });
    }

    const staffRaw = await Staff.find({ salonId: decoded.salonId, active: true }).sort({ createdAt: -1 }).lean();
    
    // Map status from legacy field if necessary
    const staff = staffRaw.map((s: any) => ({
      ...s,
      status: s.status || s.currentStatus || "available"
    }));

    return NextResponse.json({ success: true, staff });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ["salon_owner", "super_admin"]);

