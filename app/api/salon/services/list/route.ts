import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Service from "@/models/Service";

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const services = await Service.find({ salonId: id });

  return NextResponse.json({ success: true, services });
}
