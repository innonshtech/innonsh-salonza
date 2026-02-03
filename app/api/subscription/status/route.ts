import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const salonId = searchParams.get("salonId");

  const sub = await Subscription.findOne({ salonId });
    console.log("Fetched subscription for salonId", salonId, ":", sub);
  return NextResponse.json({
    active: sub?.status === "active",
    subscription: sub || null,
  });
}
