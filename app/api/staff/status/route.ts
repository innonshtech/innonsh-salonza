import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Staff from "@/models/Staff";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    await dbConnect();
    const { staffId, status } = await req.json();

    const allowedStatuses = ["available", "busy", "break", "offline"];
    if (!allowedStatuses.includes(status)) {
        return NextResponse.json({ success: false, message: "Invalid status value" }, { status: 400 });
    }

    // IDOR Protection: Verify ownership
    const staffMember = await Staff.findById(staffId);
    if (!staffMember || staffMember.salonId.toString() !== decoded.salonId.toString()) {
       return NextResponse.json({ success: false, message: "Forbidden: You do not own this resource" }, { status: 403 });
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      staffId,
      { status: status, currentStatus: status },
      { new: true }
    );

    return NextResponse.json({ success: true, staff: updatedStaff });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Status update failed" }, { status: 500 });
  }
}

export const POST = withAuth(handler, ["salon_owner", "super_admin"]);
export const PUT = withAuth(handler, ["salon_owner", "super_admin"]);
