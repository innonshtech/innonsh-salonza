import mongoose from "mongoose";

const MembershipSchema = new mongoose.Schema({
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
    name: { type: String, required: true }, // e.g. "Gold Member"
    price: { type: Number, required: true },
    validityDays: { type: Number, default: 365 },
    discountPercentage: { type: Number, default: 10 },
    benefits: [String],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Membership || mongoose.model("Membership", MembershipSchema);
