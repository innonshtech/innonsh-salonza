import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Salon from "@/models/Salon";
import { withAuth } from "@/lib/apiAuth";

async function postHandler(req: Request) {
  try {
    const { name, email, message } = await req.json();
    return NextResponse.json({ success: true, message: "Contact message received. We'll get back to you shortly." });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

async function putHandler(req: Request, decoded: any) {
  try {
    await dbConnect();
    const { updates } = await req.json();

    // IDOR Elimination: Never trust salonId from body. Use decoded.salonId from JWT.
    const salonId = decoded.salonId;

    if (!salonId) {
      return NextResponse.json({ success: false, message: "Forbidden: No salon associated with your account" }, { status: 403 });
    }

    const updated = await Salon.findByIdAndUpdate(
      salonId,
      updates,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: "Salon not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      salon: updated
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Protected for Salon Owners
export const POST = withAuth(postHandler, ["salon_owner"]);
export const PUT = withAuth(putHandler, ["salon_owner"]);

