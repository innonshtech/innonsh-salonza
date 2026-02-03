import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Salon from "@/models/Salon";
export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    // Here you would typically save the contact message to your database
    // or send it via email to your support team.
    return NextResponse.json({ success: true, message: "Contact message received. We'll get back to you shortly." });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}


export async function PUT(req: Request) {
  await dbConnect();
  const { salonId, updates } = await req.json();

  const updated = await Salon.findByIdAndUpdate(
    salonId,
    updates,
    { new: true }
  );

  return NextResponse.json({
    success: true,
    salon: updated
  });
}
