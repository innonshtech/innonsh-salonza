import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Queue from "@/models/Queue";
import fs from "fs";
import path from "path";

function logToFile(msg: string) {
  try {
    const logPath = path.join(process.cwd(), "queue_logs.log");
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${msg}\n`);
  } catch (e) {
    console.error("Failed to log to file", e);
  }
}

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const queue = await Queue.find({ salonId: id }).sort({ position: 1 }).lean();

  // Ensure every item has a status and string IDs
  const normalizedQueue = queue.map((item: any) => ({
    ...item,
    _id: item._id.toString(),
    staffId: item.staffId ? item.staffId.toString() : undefined,
    status: item.status || "waiting"
  }));

  const servingCount = normalizedQueue.filter(i => i.status === 'serving').length;
  logToFile(`LIST API: Salon ${id} requested. Total: ${normalizedQueue.length}, Serving: ${servingCount}`);

  return NextResponse.json({ success: true, queue: normalizedQueue });
}
