// /api/salon/offer/add/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Offer from "@/models/Offer";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const payload = await req.json();

    await Offer.create(payload);

    return NextResponse.json({
      success: true,
      message: "Offer created",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "An error occurred" });
  }
}
