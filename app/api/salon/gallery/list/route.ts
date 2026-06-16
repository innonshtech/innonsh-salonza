import { NextRequest, NextResponse } from "next/server";
import { SalonRepository } from "@/repositories/SalonRepository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const salonId = searchParams.get("salonId");

    if (!salonId) {
      return NextResponse.json(
        { success: false, message: "salonId is required" },
        { status: 400 }
      );
    }

    const salon = await SalonRepository.findById(salonId);

    if (!salon) {
      return NextResponse.json(
        { success: false, message: "Salon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      gallery: salon.gallery || [],
    });
  } catch (error: any) {
    console.error("Gallery List Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
