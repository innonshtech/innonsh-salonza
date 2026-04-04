import mongoose from "mongoose";

const MembershipSchema = new mongoose.Schema({
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    validity: { type: Number, required: true }, // in days
    discount: { type: Number, required: true }, // percentage
    benefits: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Membership || mongoose.model("Membership", MembershipSchema);
