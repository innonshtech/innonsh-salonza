import { NextResponse } from "next/server";
import { FeedbackRepository } from "@/repositories/SupportRepositories";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    const { name, rating, comment, salonId } = await req.json();

    if (!rating) {
      return NextResponse.json({ success: false, message: "Rating is required" }, { status: 400 });
    }

    const feedbackSalonId = salonId || decoded.salonId;

    if (!feedbackSalonId) {
      return NextResponse.json({ success: false, message: "Salon ID is missing" }, { status: 400 });
    }

    const feedback = await FeedbackRepository.create({
      salonId: feedbackSalonId,
      customerName: name,
      rating: Number(rating),
      comment,
      source: "pos"
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error: any) {
    console.error("Feedback creation error:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}

export const POST = withAuth(handler);
