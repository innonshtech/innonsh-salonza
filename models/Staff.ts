import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
  name: { type: String, required: true },
  phone: { type: String },
  role: { 
    type: String, 
    enum: ["owner", "manager", "stylist", "receptionist"],
    default: "stylist"
  },
  skills: [String],
  profileImage: String,
  active: { type: Boolean, default: true },

  // staff workflow tracking
  currentStatus: {
    type: String,
    enum: ["available", "busy", "break", "offline"],
    default: "available"
  },

  dailyLimit: Number,
  avgTime: Number,
  completedToday: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Staff || mongoose.model("Staff", StaffSchema);
