import { NextResponse } from "next/server";
import { StaffRepository } from "@/repositories/StaffRepository";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    const { staffId, status } = await req.json();

    const allowedStatuses = ["available", "busy", "break", "offline"];
    if (!allowedStatuses.includes(status)) {
        return NextResponse.json({ success: false, message: "Invalid status value" }, { status: 400 });
    }

    // IDOR Protection: Verify ownership
    const staffMember = await StaffRepository.findById(staffId);
    if (!staffMember || staffMember.salonId.toString() !== decoded.salonId.toString()) {
       return NextResponse.json({ success: false, message: "Forbidden: You do not own this resource" }, { status: 403 });
    }

    const updatedStaff = await StaffRepository.update(
      staffId,
      { status: status, currentStatus: status }
    );

    return NextResponse.json({ success: true, staff: updatedStaff });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Status update failed" }, { status: 500 });
  }
}

export const POST = withAuth(handler, ["salon_owner", "super_admin"]);
export const PUT = withAuth(handler, ["salon_owner", "super_admin"]);
