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

    await SalonRepository.findByIdAndUpdate(salonId, {
      $push: { gallery: imageUrl }
    });

    return NextResponse.json({
      success: true,
      message: "Image added to gallery",
    });
  } catch (err: any) {
     return NextResponse.json({ success: false, message: err.message || "An error occurred" }, { status: 500 });
  }
}

export const POST = withAuth(handler, ["salon_owner", "super_admin"]);
