import { NextResponse } from "next/server";
import { CustomerRepository } from "@/repositories/CustomerRepository";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    const { id, name, phone, email, gender, notes, rating } = await req.json();

    // IDOR Protection: Always use salonId from JWT
    const salonId = decoded.salonId;
    if (!salonId) {
      return NextResponse.json({ success: false, message: "Unauthorized: No salon associated" }, { status: 403 });
    }

    if (!id) {
      return NextResponse.json({ success: false, message: "Client ID is required" }, { status: 400 });
    }

    // Verify ownership before updating
    const client = await CustomerRepository.findById(id);
    if (!client || client.salonId !== salonId) {
      return NextResponse.json({ success: false, message: "Client not found" }, { status: 404 });
    }

    // Build update object
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (gender !== undefined) updateData.gender = gender;
    if (notes !== undefined) updateData.notes = notes;
    if (rating !== undefined) updateData.rating = Number(rating);

    const updatedClient = await CustomerRepository.update(id, updateData);

    return NextResponse.json({ success: true, client: updatedClient });
  } catch (error: any) {
    if (error.code === "23505" || (error.message && error.message.includes("unique_salon_customer_phone"))) {
      return NextResponse.json({ success: false, message: "A client with this phone number already exists." }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const PUT = withAuth(handler, ["salon_owner", "super_admin"]);
