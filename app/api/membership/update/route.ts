import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Membership from "@/models/Membership";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log("Update Membership request:", body);
    const { planId, name, price, validity, discount, benefits, isActive } = body;

    // IDOR Protection: Always use salonId from JWT
    const salonId = decoded.salonId;
    if (!salonId && decoded.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Unauthorized: No salon associated" }, { status: 403 });
    }

    if (!planId) {
      return NextResponse.json({ success: false, message: "Membership ID (planId) is required" }, { status: 400 });
    }

    // Build update object
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (price !== undefined) updateData.price = Number(price) || 0;
    if (validity !== undefined) updateData.validity = Number(validity) || 365;
    if (discount !== undefined) updateData.discount = Number(discount) || 0;
    if (benefits !== undefined) updateData.benefits = String(benefits || "");
    if (isActive !== undefined) updateData.isActive = isActive;

    // Find and verify ownership (IDOR Protection)
    const membership = await Membership.findById(planId);
    if (!membership) {
      return NextResponse.json({ success: false, message: "Membership plan not found" }, { status: 404 });
    }

    if (decoded.role !== "super_admin" && membership.salonId.toString() !== salonId?.toString()) {
      return NextResponse.json({ success: false, message: "Forbidden: You don't own this membership plan" }, { status: 403 });
    }

    const updatedMembership = await Membership.findByIdAndUpdate(
      planId,
      { $set: updateData },
      { new: true }
    );

    console.log("✅ Membership Updated:", updatedMembership);
    return NextResponse.json({ success: true, data: updatedMembership });
  } catch (error: any) {
    console.error("Error in update membership API:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const PUT = withAuth(handler, ["salon_owner", "super_admin"]);
