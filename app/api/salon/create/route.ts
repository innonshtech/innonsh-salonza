import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Salon from "@/models/Salon";
import User from "@/models/User";

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { ownerId, name, address, phone } = await req.json();

    if (!ownerId || !name) {
      return NextResponse.json({ success: false, message: "Required fields missing" });
    }

    let slug = generateSlug(name);

    const slugExists = await Salon.findOne({ slug });
    if (slugExists) {
      slug = slug + Math.floor(Math.random() * 1000); // make unique
    }

    const salon = await Salon.create({
      ownerId,
      name,
      address,
      phone,
      slug,
    });

    await User.findByIdAndUpdate(ownerId, {
      salonId: salon._id,
    });

    return NextResponse.json({
      success: true,
      message: "Salon created successfully",
      salon,
    });

 } catch (error: any) {
  return NextResponse.json({
    success: false,
    message: error.message || "Something went wrong",
  });
}

}
