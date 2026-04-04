import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Staff from "@/models/Staff";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    await dbConnect();
    const body = await req.json();
    const { staffId } = body;

    console.log("Staff delete request body:", body);
    console.log("Deleting staff ID:", staffId);

    if (!staffId) {
      return NextResponse.json({ success: false, message: "staffId is required" }, { status: 400 });
    }

    // Find staff member
    const staffMember = await Staff.findById(staffId);
    if (!staffMember) {
      return NextResponse.json({ success: false, message: "Staff member not found" }, { status: 404 });
    }

    // Ownership check: super_admin can delete any, others must own the staff
    if (decoded.role !== "super_admin" && staffMember.salonId.toString() !== decoded.salonId?.toString()) {
      return NextResponse.json({ success: false, message: "Forbidden: You do not own this resource" }, { status: 403 });
    }

    // Hard delete
    const deletedStaff = await Staff.findByIdAndDelete(staffId);

    return NextResponse.json({
      success: true,
      message: "Staff member deleted successfully",
      staff: deletedStaff
    });
  } catch (err: any) {
    console.error("Error deleting staff:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to delete staff" }, { status: 500 });
  }
}

export const DELETE = withAuth(handler, ["salon_owner", "super_admin"]);
