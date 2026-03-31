import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Staff from "@/models/Staff";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    await dbConnect();
    const { staffId } = await req.json();

    // Verify ownership before deleting/disabling
    const staffMember = await Staff.findById(staffId);
    if (!staffMember || staffMember.salonId.toString() !== decoded.salonId.toString()) {
       return NextResponse.json({ success: false, message: "Forbidden: You do not own this resource" }, { status: 403 });
    }

    const staff = await Staff.findByIdAndUpdate(
      staffId,
      { active: false },
      { new: true }
    );

    return NextResponse.json({ success: true, message: "Staff disabled", staff });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to delete staff" }, { status: 500 });
  }
}

export const DELETE = withAuth(handler, ["salon_owner", "super_admin"]);
