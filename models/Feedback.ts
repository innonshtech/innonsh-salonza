import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
    saleId: { type: mongoose.Schema.Types.ObjectId, ref: "Sale" },
    customerName: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    source: { type: String, enum: ["pos", "link", "qr"], default: "pos" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);
