import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Salon from "@/models/Salon";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const salonId = searchParams.get("salonId");

    if (!salonId) {
      return NextResponse.json(
        { success: false, message: "salonId is required" },
        { status: 400 }
      );
    }

    const salon = await Salon.findById(salonId).lean();

    if (!salon) {
      return NextResponse.json(
        { success: false, message: "Salon not found" },
        { status: 404 }
      );
    }

    const salonData = salon as any;

    return NextResponse.json({
      success: true,
      gallery: salonData.gallery || [],
    });
  } catch (error: any) {
    console.error("Gallery List Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
