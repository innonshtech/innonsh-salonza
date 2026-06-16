import { NextResponse } from "next/server";
import { QueueRepository } from "@/repositories/QueueRepository";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("bookingId");

  if (!bookingId) {
    return NextResponse.json({ success: false, message: "bookingId required" }, { status: 400 });
  }

  const queue = await QueueRepository.findOne({ bookingId });

  if (!queue) return NextResponse.json({ success: false, message: "Not found" });

  return NextResponse.json({ success: true, queue });
}
