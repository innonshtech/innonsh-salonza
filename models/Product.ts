import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
    name: { type: String, required: true },
    sku: { type: String },
    category: { type: String, default: "General" },
    price: { type: Number, required: true }, // Selling price if applicable
    costPrice: { type: Number }, // Cost to salon
    stockCount: { type: Number, default: 0 },
    minStockAlert: { type: Number, default: 5 },
    unit: { type: String, default: "pcs" }, // pcs, ml, grams
    description: String,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
