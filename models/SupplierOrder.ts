import mongoose from "mongoose";

const SupplierOrderSchema = new mongoose.Schema({
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
    salonOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "MarketplaceProduct" },
        name: String,
        quantity: Number,
        price: Number
    }],

    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending"
    },

    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    shippingAddress: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.SupplierOrder || mongoose.model("SupplierOrder", SupplierOrderSchema);
