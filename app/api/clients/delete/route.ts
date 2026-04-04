import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Client from "@/models/Client";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    await dbConnect();
    const { id } = await req.json();

    // IDOR Protection: Always use salonId from JWT
    const salonId = decoded.salonId;
    if (!salonId) {
      return NextResponse.json({ success: false, message: "Unauthorized: No salon associated" }, { status: 403 });
    }

    if (!id) {
      return NextResponse.json({ success: false, message: "Client ID is required" }, { status: 400 });
    }

    // Verify ownership before deleting
    const client = await Client.findOne({ _id: id, salonId });
    if (!client) {
      return NextResponse.json({ success: false, message: "Client not found" }, { status: 404 });
    }

    await Client.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Client deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const DELETE = withAuth(handler, ["salon_owner", "super_admin"]);
