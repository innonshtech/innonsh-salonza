import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: Request) {
  await dbConnect();

  const { salonId, planType } = await req.json();

  const planId = (planType === "pro" 
  ? process.env.PLAN_PRO 
  : process.env.PLAN_BASIC) as string;


  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    total_count: 12, // yearly cycle
    quantity: 1,
    customer_notify: 1,
  });

  const newSub = await Subscription.create({
    salonId,
    plan: planType,
    razorpaySubscriptionId: subscription.id,
    status: "active",
    startedAt: new Date(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  });

  return NextResponse.json({
    success: true,
    message: "Subscription created",
    subscriptionId: subscription.id,
  });
}
