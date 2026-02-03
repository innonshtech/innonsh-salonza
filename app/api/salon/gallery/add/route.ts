// /api/salon/gallery/add/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Salon from "@/models/Salon";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { salonId, imageUrl } = await req.json();

    await Salon.findByIdAndUpdate(salonId, {
      $push: { gallery: imageUrl }
    });

    return NextResponse.json({
      success: true,
      message: "Image added to gallery",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "An error occurred" });
  }
}
