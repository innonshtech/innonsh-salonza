import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Staff from "@/models/Staff";
import Booking from "@/models/Booking";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    await dbConnect();
    const { bookingId, staffId } = await req.json();

    // Verify ownership of both booking and staff
    const [booking, staffMember] = await Promise.all([
      Booking.findById(bookingId),
      Staff.findById(staffId)
    ]);

    if (!booking || !staffMember) {
      return NextResponse.json({ success: false, message: "Resource not found" }, { status: 404 });
    }

    if (booking.salonId.toString() !== decoded.salonId.toString() || staffMember.salonId.toString() !== decoded.salonId.toString()) {
      return NextResponse.json({ success: false, message: "Forbidden: Ownership mismatch" }, { status: 403 });
    }

    await Booking.findByIdAndUpdate(
      bookingId,
      { assignedTo: staffId },
      { new: true }
    );

    const updatedStaff = await Staff.findByIdAndUpdate(staffId, { currentStatus: "busy" }, { new: true });

    return NextResponse.json({ success: true, booking, staff: updatedStaff });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Assignment failed" }, { status: 500 });
  }
}

export const POST = withAuth(handler, ["salon_owner", "super_admin"]);
