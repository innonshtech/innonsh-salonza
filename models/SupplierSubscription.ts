import mongoose from "mongoose";

const SupplierSubscriptionSchema = new mongoose.Schema({
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["free", "silver", "gold"], default: "free" },
    status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
    maxProducts: { type: Number, default: 5 },
    commissionRate: { type: Number, default: 10 }, // Percentage
    startedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.SupplierSubscription || mongoose.model("SupplierSubscription", SupplierSubscriptionSchema);
