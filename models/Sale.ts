import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    customerName: { type: String, required: true },
    customerPhone: { type: String },

    // Support multiple services in one transaction
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" }, // For backward compatibility
    services: [{
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
        name: String,
        price: Number
    }],

    totalAmount: { type: Number, required: true }, // Gross total
    discount: {
        type: { type: String, enum: ["fixed", "percentage", "none"], default: "none" },
        value: { type: Number, default: 0 },
        amount: { type: Number, default: 0 }
    },
    finalAmount: { type: Number, required: true }, // Net total

    paymentMethod: {
        type: String,
        enum: ["cash", "online", "split"],
        default: "cash"
    },
    paymentSplit: {
        cash: { type: Number, default: 0 },
        online: { type: Number, default: 0 }
    },

    date: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Sale || mongoose.model("Sale", saleSchema);
