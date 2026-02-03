// /api/salon/update-socials/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Salon from "@/models/Salon";

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { salonId, socials } = await req.json();

    const newSalon = await Salon.findByIdAndUpdate(
      salonId,
      { socials },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      salon: newSalon,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "An error occurred" });
  }
}
