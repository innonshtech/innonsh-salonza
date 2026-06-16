# 📋 Project Summary — TrimsetGo (Salon Management System)

---

## 1. Project Name
**TrimsetGo** — Salon Management & B2B Marketplace Platform

---

## 2. Project Overview
A full-stack SaaS platform built for salon owners to manage operations (bookings, queue, staff, inventory) and for suppliers to sell products B2B through a marketplace. Each salon gets a **custom subdomain public booking page** for clients. The system supports three distinct user roles with separate dashboards and workflows.

---

## 3. Objective
Digitize salon operations and eliminate manual booking/queue overhead while creating a B2B supply chain channel between verified suppliers and salon owners — all under one platform.

---

## 4. Key Features
- 🗓️ **Appointment Booking** — Public-facing booking pages per salon with multi-service support
- 🔢 **Real-time Queue Management** — Add, reorder, serve, and remove clients from a live queue
- 👥 **Staff Management** — Role-based staff (owner, manager, stylist, receptionist) with status tracking
- 🏪 **Custom Salon Subdomains** — Each salon operates on its own subdomain (e.g., `royalspa.trimsetgo.live`)
- 🛒 **B2B Marketplace** — Verified suppliers list products; salon owners browse and purchase at business pricing
- 💳 **Subscription & Payments** — Razorpay-integrated subscription plans for salon and supplier accounts
- 📊 **Analytics Dashboard** — Daily stats, monthly revenue, queue overview, and today's schedule
- 📲 **Multi-channel Notifications** — Email (Nodemailer/SMTP), SMS, and WhatsApp via Twilio

---

## 5. Implemented Functionalities

### 🔐 Authentication / Authorization
- JWT-based auth with `bcryptjs` password hashing; 7-day token expiry
- Auth context (`AuthContext.tsx`) wraps the app for session persistence via `localStorage`

### 👤 Role-based Access
| Role | Access |
|---|---|
| `salon_owner` | Full dashboard — bookings, queue, staff, gallery, services, inventory, marketplace |
| `supplier` | Supplier dashboard — product listing, verification flow, order tracking |
| `super_admin` | Control center — platform stats, supplier verification approval/rejection |

### 🌐 API Structure
| Namespace | Endpoints |
|---|---|
| `/api/auth` | `login`, `register` |
| `/api/bookings` | `create`, `create-multi`, `list`, `cancel`, `by-phone` |
| `/api/queue` | `add`, `list`, `serve`, `unserve`, `remove`, `reorder`, `update`, `status` |
| `/api/salon` | `create`, `update`, `update-hours`, `update-profile`, `update-socials`, `gallery`, `services`, `offers`, `testimonial`, `dashboard/stats` |
| `/api/staff` | `add`, `list`, `update`, `delete`, `assign`, `status` |
| `/api/clients` | `add`, `list` |
| `/api/inventory` | `add`, `list` |
| `/api/marketplace` | `list` |
| `/api/payments` | `subscribe`, `webhook` |
| `/api/supplier` | `verify`, `products/add` |
| `/api/super-admin` | `stats`, `users/action` |
| `/api/public/salon/[slug]` | Public salon profile by subdomain slug |
| `/api/analytics/daily` | Daily analytics per salon |

### 🗄️ CRUD Operations
- Full CRUD: Services, Staff, Bookings, Queue, Clients, Inventory, Offers, Gallery, Testimonials, Marketplace Products

### 💾 Database Integration
- Dashboard stat cards auto-refresh on page load (today's bookings, active queue, revenue)
- Staff availability tracking: `available`, `busy`, `break`, `offline`

---

## 6. Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, TailwindCSS v4 |
| **Backend** | Next.js API Routes (serverless), Node.js runtime |
| **Database** | MongoDB + Mongoose ODM |
| **Auth** | JWT (`jsonwebtoken`) + `bcryptjs` |
| **Payments** | Razorpay (subscriptions + webhooks) |
| **Notifications** | Nodemailer (SMTP Email), Twilio (SMS + WhatsApp) |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/sortable` |
| **Icons** | Lucide React |
| **Date/Time** | Moment.js |
| **SEO** | `next-sitemap` (sitemap.xml + robots.txt) |
| **Deployment** | Vercel (inferred from Next.js + sitemap config) |

---

## 7. Architecture / Structure

- **Monolithic Full-Stack SaaS** — single Next.js App Router project (frontend + API in one codebase)
- **Feature-modular API structure** — each resource (bookings, queue, salon, staff) has its own API folder
- **Subdomain-based multi-tenancy** — Next.js middleware intercepts subdomains, rewrites to `[salon]` dynamic route
- **Context + Hooks pattern** — `AuthContext`, `QueueContext`, `BookingContext`, `SalonContext` with corresponding hooks (`useAuth`, `useQueue`, `useBooking`, `useSalon`)

---

## 8. Notable Implementations

- **Subdomain Middleware** — Custom `middleware.ts` routes `{slug}.domain.com` to `/[salon]/*` with `x-salon-slug` header injection
- **Multi-service Booking Engine** — Bookings and Queue both support multiple `serviceIds` with backward-compatible single `serviceId` field
- **Supplier Verification Pipeline** — 4-state FSM (`unapplied → pending → verified/rejected`) with super-admin approval gateway before marketplace access
- **Razorpay Webhook Handler** — `/api/payments/webhook` for subscription lifecycle events (activation, expiry)
- **B2B Dual Pricing** — `MarketplaceProduct` stores both retail `price` and discounted `businessPrice` for salon owner purchases

---

## 9. My Contributions *(Developer Perspective)*

- Built the **subdomain-based multi-tenant routing** system using Next.js middleware for salon public pages
- Implemented the **full queue management API** (add, reorder, serve, unserve, status) with drag-and-drop UI using `@dnd-kit`
- Designed and implemented the **3-role auth system** (salon owner, supplier, super-admin) with JWT and role-gated dashboards
- Developed the **supplier onboarding verification flow** end-to-end — form submission → admin review → approve/reject
- Integrated **Razorpay subscription** plans with webhook support for plan activation and expiry management
- Built the **multi-channel notification system** (Email via Nodemailer + SMS + WhatsApp via Twilio) in a unified `notifications.ts` lib

---

## 10. Challenges & Solutions

- **Multi-tenant Subdomain Routing in Next.js** → Implemented custom `middleware.ts` using `NextResponse.rewrite()` to map `{slug}.domain.com` → `/[salon]` internally without exposing URL changes to the user
- **Multi-service Booking Consistency** → Added `serviceIds[]` alongside legacy `serviceId` (backward-compatible) in both `Booking` and `Queue` models; computed `totalDuration` and `totalPrice` at booking creation
- **Supplier Access Control Before Verification** → Built a 4-state UI gate on the supplier dashboard — each verification state (`unapplied`, `pending`, `rejected`, `verified`) renders a distinct, contextual UI screen instead of a generic error

---

## 11. Current Status

> 🟡 **In Progress** — Core features implemented; some supplier order management UI and campaign module placeholders detected

---

## 12. Future Enhancements *(Suggested)*

- **Real-time Queue Updates** — Integrate WebSockets or SSE for live queue push notifications to clients
- **Campaign / Marketing Module** — `Campaign.ts` model exists but the marketing dashboard page is a stub; full email/SMS campaign builder can be added
- **Supplier Order Fulfillment Flow** — `SupplierOrder.ts` model is defined but the order lifecycle (place, track, fulfill) UI/API is incomplete
