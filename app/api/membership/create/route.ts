import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Membership from "@/models/Membership";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log("Create Membership Request:", body);

    const { name, price, validity, discount, benefits, isActive } = body;

    // Attach salonId from JWT (decoded) - NOT from body
    const salonId = decoded.salonId;
    if (!salonId) {
      return NextResponse.json({ success: false, message: "User is not associated with any salon" }, { status: 403 });
    }

    if (!name || price === undefined || validity === undefined || discount === undefined || benefits === undefined) {
      return NextResponse.json({ success: false, message: "All fields (name, price, validity, discount, benefits) are required" }, { status: 400 });
    }

    const membership = await Membership.create({
      salonId,
      name,
      price: Number(price),
      validity: Number(validity),
      discount: Number(discount),
      benefits: String(benefits),
      isActive: isActive !== undefined ? isActive : true
    });

    console.log("Created Membership:", membership);
    return NextResponse.json({ success: true, data: membership });
  } catch (error: any) {
    console.error("Error in create membership API:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const POST = withAuth(handler, ["salon_owner", "super_admin"]);
