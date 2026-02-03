import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Service from "@/models/Service";

export async function POST(req: Request) {
  await dbConnect();

  const { salonId, name, duration, price ,description,image} = await req.json();

  const service = await Service.create({
    salonId,
    name,
    duration,
    price,
    description,
    image
  });

  return NextResponse.json({ success: true, service });
}

export async function DELETE(req: Request) {
  await dbConnect();

  const { id } = await req.json();
  await Service.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
