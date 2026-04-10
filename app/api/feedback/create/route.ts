import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Feedback from "@/models/Feedback";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    await dbConnect();
    const { name, phone, rating, comment, salonId } = await req.json();

    if (!rating) {
      return NextResponse.json({ success: false, message: "Rating is required" }, { status: 400 });
    }

    const feedbackSalonId = salonId || decoded.salonId;

    if (!feedbackSalonId) {
      return NextResponse.json({ success: false, message: "Salon ID is missing" }, { status: 400 });
    }

    const feedback = await Feedback.create({
      salonId: feedbackSalonId,
      customerName: name,
      phone: phone, // Optional string
      rating,
      comment,
      source: "pos",
      createdAt: new Date()
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error: any) {
    console.error("Feedback creation error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export const POST = withAuth(handler);
