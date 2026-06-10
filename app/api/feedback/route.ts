import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Feedback from "@/models/Feedback";
import { withAuth } from "@/lib/apiAuth";

// GET feedback for a salon
async function getHandler(req: Request, decoded: any) {
  try {
    await dbConnect();

    // IDOR Protection: Always use salonId from JWT for owners
    const authSalonId = decoded.salonId;
    if (!authSalonId && decoded.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Unauthorized: No salon associated" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const targetSalonId = decoded.role === "super_admin" ? (searchParams.get("salonId") || authSalonId) : authSalonId;

    if (!targetSalonId) {
      return NextResponse.json({ success: false, message: "salonId is required" }, { status: 400 });
    }

    const feedback = await Feedback.find({ salonId: targetSalonId })
      .sort({ createdAt: -1 })
      .limit(100); // Limit to recent 100

    return NextResponse.json({ success: true, feedback });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "An error occurred" }, { status: 500 });
  }
}

// POST feedback
async function postHandler(req: Request, decoded: any) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log("Feedback submit request body:", body);
    const { rating, comment, customerName, saleId, source, salonId } = body;

    // IDOR Protection: Always use salonId from JWT
    const authSalonId = decoded.salonId;
    console.log("Feedback authSalonId:", authSalonId, "role:", decoded.role);
    if (!authSalonId && decoded.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Unauthorized: No salon associated" }, { status: 403 });
    }

    if (rating === undefined || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, message: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // For salon owners, we use their salonId from JWT; super_admin can specify salonId
    const targetSalonId = decoded.role === "super_admin" ? (salonId || authSalonId) : authSalonId;

    const feedback = await Feedback.create({
      salonId: targetSalonId,
      rating: Number(rating),
      comment: comment || "",
      customerName: customerName || "",
      saleId: saleId || undefined,
      source: source || "pos"
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "An error occurred" }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ["salon_owner", "super_admin"]);
export const POST = withAuth(postHandler, ["salon_owner", "super_admin"]);
