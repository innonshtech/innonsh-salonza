import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";
import { isPaymentsEnabled } from "@/lib/razorpay";

export async function POST(req: Request) {
  await dbConnect();

  // Feature flag: Ignore webhooks when payments are disabled
  if (!isPaymentsEnabled()) {
    return NextResponse.json({
      success: true,
      message: "Webhook received but payments are disabled. No action taken.",
      mock: true,
    });
  }

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
