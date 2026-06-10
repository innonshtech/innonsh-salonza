import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["salon_owner", "supplier", "super_admin", "staff", "customer"]).optional()
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

export const salonCreateSchema = z.object({
  name: z.string().min(3, "Salon name must be at least 3 characters"),
  address: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  slug: z.string().optional()
});

export const bookingCreateSchema = z.object({
  salonSlug: z.string().min(1, "Salon slug is required"),
  serviceId: z.string().min(1, "Service ID is required"),
  customerName: z.string().min(2, "Customer name must be at least 2 characters"),
  customerPhone: z.string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .optional()
    .or(z.literal("")),
  date: z.string().optional().or(z.date()).or(z.literal(""))
});

export const serviceCreateSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  duration: z.coerce.number().positive("Duration must be positive"),
  price: z.coerce.number().nonnegative("Price cannot be negative"),
  description: z.string().optional(),
  image: z.string().nullable().optional()
});

export const serviceUpdateSchema = serviceCreateSchema.extend({
  id: z.string().min(1, "Service ID is required")
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address")
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters")
});
