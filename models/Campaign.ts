import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["sms", "email", "whatsapp"], default: "sms" },
    audience: { type: String, enum: ["all", "loyal", "inactive"], default: "all" },
    message: { type: String, required: true },
    status: { type: String, enum: ["draft", "sent", "scheduled"], default: "draft" },
    sentCount: { type: Number, default: 0 },
    scheduledFor: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Campaign || mongoose.model("Campaign", CampaignSchema);
