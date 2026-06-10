import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISalon extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  address?: string;
  phone?: string;
  slug: string;
  services: mongoose.Types.ObjectId[];
  createdAt: Date;
  about: string;
  yearsExperience: number;
  clientsCount: number;
  staffCount: number;
  rating: number;
  openingHours: {
    monday: { open: string, close: string };
    tuesday: { open: string, close: string };
    wednesday: { open: string, close: string };
    thursday: { open: string, close: string };
    friday: { open: string, close: string };
    saturday: { open: string, close: string };
    sunday: { open: string, close: string };
  };
  socials: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  mainImage?: string;
  gallery: string[];
}

const salonSchema = new Schema<ISalon>({
  ownerId: { type: Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  slug: { type: String, unique: true }, // subdomain
  services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
  createdAt: { type: Date, default: Date.now },
  // NEW FIELDS FOR PUBLIC PAGE
  about: {
    type: String,
    default: "We provide premium salon services."
  },
  yearsExperience: { type: Number, default: 1 },
  clientsCount: { type: Number, default: 0 },
  staffCount: { type: Number, default: 1 },
  rating: { type: Number, default: 4.5 },

  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String },
  },

  socials: {
    instagram: String,
    facebook: String,
    twitter: String,
  },

  mainImage: String, // Main salon image
  gallery: [String], // array of image URLs
});

const Salon: Model<ISalon> = mongoose.models.Salon || mongoose.model<ISalon>("Salon", salonSchema);
export default Salon;
