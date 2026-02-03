import mongoose from "mongoose";

const MarketplaceProductSchema = new mongoose.Schema({
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    businessPrice: { type: Number }, // Discounted price for salon owners
    category: { type: String, required: true },
    brand: { type: String },
    image: { type: String },
    stock: { type: Number, default: 0 },
    minOrderQuantity: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.MarketplaceProduct || mongoose.model("MarketplaceProduct", MarketplaceProductSchema);
