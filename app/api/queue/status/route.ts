import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Queue from "@/models/Queue";

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("bookingId");

  const queue = await Queue.findOne({ bookingId });

  if (!queue) return NextResponse.json({ success: false, message: "Not found" });

  return NextResponse.json({ success: true, queue });
}
