import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Staff from "@/models/Staff";

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const salonId = searchParams.get("salonId");

  const staff = await Staff.find({ salonId }).sort({ createdAt: -1 });

  return NextResponse.json({ success: true, staff });
}
