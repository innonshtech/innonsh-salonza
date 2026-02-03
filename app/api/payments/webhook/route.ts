import { NextResponse } from "next/server";
import Subscription from "@/models/Subscription";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  await dbConnect();

  const body = await req.json();

  const event = body.event;
  const subId = body?.payload?.subscription?.entity?.id;

  if (!subId) {
    return NextResponse.json({ success: false });
  }

  if (event === "subscription.activated") {
    await Subscription.findOneAndUpdate(
      { razorpaySubscriptionId: subId },
      { status: "active" }
    );
  }

  if (event === "subscription.halted" || event === "subscription.completed") {
    await Subscription.findOneAndUpdate(
      { razorpaySubscriptionId: subId },
      { status: "expired" }
    );
  }

  return NextResponse.json({ success: true });
}
