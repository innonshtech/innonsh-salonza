import { NextResponse } from "next/server";
import { SalonRepository } from "@/repositories/SalonRepository";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    const { imageUrl } = await req.json();

    // IDOR Protection: Always use salonId from JWT
    const salonId = decoded.salonId;
    if (!salonId) {
      return NextResponse.json({ success: false, message: "Forbidden: No salon associated" }, { status: 403 });
    }

    if (!imageUrl) {
      return NextResponse.json({ success: false, message: "imageUrl is required" }, { status: 400 });
    }

    // Remove image from gallery array
    const updated = await SalonRepository.findByIdAndUpdate(
      salonId,
      { $pull: { gallery: imageUrl } }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: "Salon not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
      gallery: updated.gallery,
    });
  } catch (err: any) {
    console.error("Delete gallery image error:", err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}

export const DELETE = withAuth(handler, ["salon_owner", "super_admin"]);
