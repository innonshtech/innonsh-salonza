import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    gender: { type: String, enum: ["male", "female", "other", "prefer_not_to_say"] },
    birthday: Date,

    loyaltyPoints: { type: Number, default: 0 },
    totalVisits: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastVisit: Date,

    notes: String,
    tags: [String],

    createdAt: { type: Date, default: Date.now }
});

// Compound index for searching within a salon
ClientSchema.index({ salonId: 1, phone: 1 }, { unique: true });

export default mongoose.models.Client || mongoose.model("Client", ClientSchema);
