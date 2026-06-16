import { NextResponse } from "next/server";
import { StaffRepository } from "@/repositories/StaffRepository";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    const { staffId, updates } = await req.json();

    // Verify ownership before updating
    const staffMember = await StaffRepository.findById(staffId);
    if (!staffMember || staffMember.salonId.toString() !== decoded.salonId.toString()) {
      return NextResponse.json({ success: false, message: "Forbidden: You do not own this resource" }, { status: 403 });
    }

    const staff = await StaffRepository.update(staffId, updates);

    return NextResponse.json({ success: true, staff });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Update failed" }, { status: 500 });
  }
}

export const PUT = withAuth(handler, ["salon_owner", "super_admin"]);
