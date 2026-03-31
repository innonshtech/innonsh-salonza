import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import { withAuth } from "@/lib/apiAuth";

async function getHandler(req: Request, decoded: any) {
  try {
    await dbConnect();

    // IDOR Protection: Ignore the 'id' param and use 'salonId' from JWT
    if (!decoded.salonId) {
      return NextResponse.json({ success: false, message: "Unauthorized: No salon associated" }, { status: 403 });
    }

    const bookings = await Booking.find({
      salonId: decoded.salonId, // Forced from JWT
      status: "upcoming",
    })
    .populate("serviceId")
    .sort({ date: 1 });

    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ["salon_owner", "super_admin"]);

