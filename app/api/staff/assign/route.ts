import { NextResponse } from "next/server";
import { StaffRepository } from "@/repositories/StaffRepository";
import { BookingRepository } from "@/repositories/BookingRepository";
import { QueueRepository } from "@/repositories/QueueRepository";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    const { bookingId, staffId } = await req.json();

    // Verify ownership of both booking and staff
    const [booking, staffMember] = await Promise.all([
      BookingRepository.findById(bookingId),
      StaffRepository.findById(staffId)
    ]);

    if (!booking || !staffMember) {
      return NextResponse.json({ success: false, message: "Resource not found" }, { status: 404 });
    }

    if (booking.salonId.toString() !== decoded.salonId.toString() || staffMember.salonId.toString() !== decoded.salonId.toString()) {
      return NextResponse.json({ success: false, message: "Forbidden: Ownership mismatch" }, { status: 403 });
    }

    // Try to update the associated queue item with the assigned staff member
    try {
      const queueItem = await QueueRepository.findOne({ bookingId });
      if (queueItem) {
        await QueueRepository.update(queueItem.id, { staffId });
      }
    } catch (qErr) {
      console.warn("Failed to update queue item staff assignment:", qErr);
    }

    const updatedStaff = await StaffRepository.update(staffId, { status: "busy", currentStatus: "busy" });

    return NextResponse.json({ success: true, booking, staff: updatedStaff });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Assignment failed" }, { status: 500 });
  }
}

export const POST = withAuth(handler, ["salon_owner", "super_admin"]);
