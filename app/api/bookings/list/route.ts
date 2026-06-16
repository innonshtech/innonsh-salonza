import { NextResponse } from "next/server";
import { BookingRepository } from "@/repositories/BookingRepository";
import { withAuth } from "@/lib/apiAuth";

async function getHandler(req: Request, decoded: any) {
  try {
    // IDOR Protection: Ignore the 'id' param and use 'salonId' from JWT
    if (!decoded.salonId) {
      return NextResponse.json({ success: false, message: "Unauthorized: No salon associated" }, { status: 403 });
    }

    // Optional query param to filter by status (if not provided, returns all)
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    const query: any = {
      salonId: decoded.salonId, // Forced from JWT
    };

    // Only apply status filter if explicitly provided
    if (statusFilter) {
      // Support multiple comma-separated statuses: ?status=upcoming,in-progress
      const statuses = statusFilter.split(',').map((s: string) => s.trim());
      query.status = { $in: statuses };
    }

    const bookings = await BookingRepository.find(query);

    // Transform bookings to have consistent serviceName/s structure
    const transformedBookings = bookings.map((booking: any) => {
      const serviceNames = [];
      if (booking.serviceIds && Array.isArray(booking.serviceIds)) {
        booking.serviceIds.forEach((sid: any) => {
          if (sid && sid.name) serviceNames.push(sid.name);
        });
      } else if (booking.serviceId && booking.serviceId.name) {
        serviceNames.push(booking.serviceId.name);
      }

      return {
        ...booking.toObject(),
        // Provide both formats for compatibility
        serviceName: serviceNames.length > 0 ? serviceNames.join(', ') : undefined,
        serviceNames: serviceNames
      };
    });

    return NextResponse.json({ success: true, bookings: transformedBookings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ["salon_owner", "super_admin"]);

