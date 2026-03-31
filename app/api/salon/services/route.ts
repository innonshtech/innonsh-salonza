import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Service from "@/models/Service";
import { withAuth } from "@/lib/apiAuth";
import { withValidation } from "@/lib/validate";
import { serviceCreateSchema, serviceUpdateSchema } from "@/lib/validations";

async function postHandler(req: Request, decoded: any) {
  try {
    await dbConnect();
    const { name, duration, price, description, image } = await req.json();

    // IDOR Protection: Always use salonId from JWT, NEVER trust the request body
    if (!decoded.salonId) {
      return NextResponse.json({ success: false, message: "User is not associated with any salon" }, { status: 403 });
    }

    const service = await Service.create({
      salonId: decoded.salonId, // Forced from authenticated session
      name,
      duration,
      price,
      description,
      image
    });

    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

async function putHandler(req: Request, decoded: any) {
  try {
    await dbConnect();
    const { id, name, duration, price, description, image } = await req.json();

    // Verify ownership before updating
    const service = await Service.findById(id);
    if (!service || service.salonId.toString() !== decoded.salonId.toString()) {
      return NextResponse.json({ success: false, message: "Forbidden: You don't own this service" }, { status: 403 });
    }

    // Update the service
    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        name,
        duration,
        price,
        description,
        image
      },
      { new: true }
    );

    return NextResponse.json({ success: true, service: updatedService });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

async function deleteHandler(req: Request, decoded: any) {
  try {
    await dbConnect();
    const { id } = await req.json();

    // Verify ownership before deleting
    const service = await Service.findById(id);
    if (!service || service.salonId.toString() !== decoded.salonId.toString()) {
      return NextResponse.json({ success: false, message: "Forbidden: You don't own this service" }, { status: 403 });
    }

    await Service.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const POST = withAuth(withValidation(serviceCreateSchema, postHandler), ["salon_owner", "super_admin"]);
export const PUT = withAuth(withValidation(serviceUpdateSchema, putHandler), ["salon_owner", "super_admin"]);
export const DELETE = withAuth(deleteHandler, ["salon_owner", "super_admin"]);


