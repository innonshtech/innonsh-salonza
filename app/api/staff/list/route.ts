import { NextResponse } from "next/server";
import { StaffRepository } from "@/repositories/StaffRepository";
import { withAuth } from "@/lib/apiAuth";

async function getHandler(req: Request, decoded: any) {
  try {
    // IDOR Protection: Always use salonId from JWT
    if (!decoded.salonId) {
      return NextResponse.json({ success: false, message: "Unauthorized: No salon associated" }, { status: 403 });
    }

    const staff = await StaffRepository.find({ salonId: decoded.salonId, active: true });
    
    return NextResponse.json({ success: true, staff });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ["salon_owner", "super_admin"]);

