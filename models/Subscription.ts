import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon" },
  plan: { type: String, required: true },
  razorpaySubscriptionId: { type: String },
  status: { type: String, default: "active" },
  startedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

export default mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);
