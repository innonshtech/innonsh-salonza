import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Membership from "@/models/Membership";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log("Delete Membership request:", body);
    const { planId } = body;

    // IDOR Protection
    const salonId = decoded.salonId;
    if (!salonId && decoded.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Unauthorized: No salon associated" }, { status: 400 });
    }

    if (!planId) {
      return NextResponse.json({ success: false, message: "Membership ID (planId) is required" }, { status: 400 });
    }

    // Find and verify ownership
    const membership = await Membership.findById(planId);
    if (!membership) {
      return NextResponse.json({ success: false, message: "Membership plan not found" }, { status: 404 });
    }

    if (decoded.role !== "super_admin" && membership.salonId.toString() !== salonId.toString()) {
      return NextResponse.json({ success: false, message: "Forbidden: You don't own this membership plan" }, { status: 403 });
    }

    await Membership.findByIdAndDelete(planId);

    console.log("✅ Deleted Membership plan:", planId);
    return NextResponse.json({ success: true, message: "Membership plan deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting membership:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const DELETE = withAuth(handler, ["salon_owner", "super_admin"]);
