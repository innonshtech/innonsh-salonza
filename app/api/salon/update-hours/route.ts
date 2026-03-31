import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Salon from "@/models/Salon";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    await dbConnect();
    const { hours } = await req.json();

    // IDOR Elimination: Use decoded.salonId from JWT.
    const salonId = decoded.salonId;
    if (!salonId) {
       return NextResponse.json({ success: false, message: "Forbidden: No salon associated" }, { status: 403 });
    }

    const newSalon = await Salon.findByIdAndUpdate(
      salonId,
      { openingHours: hours },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      salon: newSalon,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "An error occurred" }, { status: 500 });
  }
}

export const PUT = withAuth(handler, ["salon_owner", "super_admin"]);
