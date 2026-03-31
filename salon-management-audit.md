# Salon Management System - Deep Analysis & Audit Report

## 🔍 1. BACKEND ANALYSIS

### 1.1 List of ALL APIs

**Auth & Users**
*   **POST** `/api/auth/register` - Registers a new user (Salon Owner / Supplier).
*   **POST** `/api/auth/login` - Authenticates user and returns JWT token.

**Salon Core**
*   **POST** `/api/salon/create` - Creates a new salon profile.
*   **POST** `/api/salon/update`, **PUT** `/api/salon/update` - Updates general salon details.
*   **PUT** `/api/salon/update-hours` - Updates salon working hours.
*   **PUT** `/api/salon/update-profile` - Updates salon profile info.
*   **PUT** `/api/salon/update-socials` - Updates salon social links.
*   **GET** `/api/salon/dashboard/stats` - Fetches salon statistics.

**Services & Offers**
*   **POST** `/api/salon/services` - Adds a new salon service.
*   **DELETE** `/api/salon/services` - Deletes a salon service.
*   **GET** `/api/salon/services/list` - Lists all services for a given salon.
*   **POST** `/api/salon/offer/add` - Adds a new salon offer.
*   **GET** `/api/salon/offer/list` - Lists offers.
*   **DELETE** `/api/salon/offer/delete` - Deletes an offer.

**Bookings & Queue**
*   **POST** `/api/bookings/create` - Creates a new booking.
*   **POST** `/api/bookings/create-multi` - Creates multiple bookings.
*   **GET** `/api/bookings/list` - Lists all bookings.
*   **GET** `/api/bookings/by-phone` - Searches bookings via phone number.
*   **GET** `/api/bookings/cancel` - Cancels a booking.
*   **POST** `/api/queue/add` - Adds a client to the live queue.
*   **GET** `/api/queue/list` - Lists the current queue for a salon.
*   **POST** `/api/queue/remove` - Removes a client from the queue.
*   **POST** `/api/queue/reorder` - Reorders the queue.
*   **POST** `/api/queue/serve` - Marks a queued client as served.
*   **GET** `/api/queue/status` - Gets the live status of the queue.
*   **POST** `/api/queue/unserve` - Reverts a client's status from served.
*   **POST** `/api/queue/update` - Updates queue entry.

**Staff & Clients**
*   **POST** `/api/staff/add` - Adds a staff member.
*   **POST** `/api/staff/assign` - Assigns a staff member to a service/queue.
*   **DELETE** `/api/staff/delete` - Removes a staff member.
*   **GET** `/api/staff/list` - Lists all staff.
*   **POST** `/api/staff/status` - Updates staff availability.
*   **PUT** `/api/staff/update` - Updates staff details.
*   **POST** `/api/clients/add` - Adds a client to DB.
*   **GET** `/api/clients/list` - Lists all clients.

**Gallery & Feedback**
*   **POST** `/api/salon/gallery/add` - Adds an image to the gallery.
*   **GET** `/api/salon/gallery/list` - Retrieves gallery images.
*   **DELETE** `/api/salon/gallery/delete` - Removes an image.
*   **POST** `/api/salon/testimonial/add` - Adds user testimonial.

**Inventory & Marketplace (Supplier)**
*   **POST** `/api/inventory/add` - Adds internal inventory.
*   **GET** `/api/inventory/list` - Lists internal inventory.
*   **POST** `/api/supplier/products/add` - Adds products to supplier marketplace.
*   **POST** `/api/supplier/verify` - Supplier submits verification details.
*   **GET** `/api/marketplace/list` - Lists B2B marketplace products.

**Super Admin**
*   **GET** `/api/super-admin/stats` - Global platform statistics.
*   **POST** `/api/super-admin/users/action` - Approve/Reject supplier verifications.

**Payments & Subscriptions**
*   **POST** `/api/payments/subscribe` - Initiates subscription payment via Razorpay.
*   **POST** `/api/payments/webhook` - Handles Razorpay webhooks.
*   **GET** `/api/subscription/status` - Returns subscription status.

**Public Routes**
*   **GET** `/api/public/salon/[slug]` - Fetches public salon details for booking page.

---

### 1.2 Role-Based Access Mapping ❌ CRITICAL FAILURE ❌

Currently, **NONE of the APIs contain authorization middleware or role validations.**
This means any user (or unauthenticated visitor) can execute any API if they know the payload structure.

*   `super_admin` - Intended to access over-arching stats and approve users. Currently, ANYONE can call `/api/super-admin/users/action` to approve a supplier.
*   `salon_owner` - Intended to manage their salon. Currently, ANYONE can call `/api/salon/services` or `/api/queue/add` bypassing ownership checks.
*   `supplier` - Intended to manage marketplace products. Currently, ANYONE can add products if they pass a valid `supplierId`.

### 1.3 Authentication & Security Review ❌

*   **JWT Implementation**: The system generates a JWT via `lib/auth.ts` on login. However, **the token is never verified in any API route**. There is no backend `verifyAuth` middleware protecting the endpoints!
*   **Password Hashing**: Passwords should be hashed using `bcrypt` during registration.
*   **Middleware Usage**: `middleware.ts` is currently only used for **Subdomain Routing** (e.g., rewriting `salon.yourdomain.com`). It does NOT check JWT cookies or validate authenticated routes.
*   **Security Gaps**: 
    - **IDOR (Insecure Direct Object Reference) Vulnerability**: APIs blindly accept IDs (like `salonId` or `userId`) from the `req.json()` body without verifying if the API caller actually owns those documents.
    - Tokens are stored in `localStorage` which is prone to XSS attacks instead of `httpOnly` cookies.

### 1.4 Database Schema Review

**Collections:**
`User`, `Salon`, `Service`, `Booking`, `Queue`, `Staff`, `Client`, `Inventory/Product`, `MarketplaceProduct`, `Campaign`, `Membership`, `SupplierOrder`, `Testimonial`, `Subscription`, `Offer`.

**Design Comments:**
- **Relationships**: Properly relational. Almost all entities use `salonId` to strictly bind to a salon instance (SaaS architecture). `MarketplaceProduct` appropriately links to `supplierId`.
- **Missing Elements**: 
  - Subscriptions need payment history logs.
  - User schemas lack password-reset-token fields.

---

## 🎨 2. FRONTEND ANALYSIS

### 2.1 Pages & Components Breakdown

- `/(auth)/login` & `/(auth)/register`: Public authentication views.
- `/dashboard/*`: Contains pages (`queue`, `bookings`, `collections`, `services`, `staff`, `marketplace`, `inventory`, etc.) for **Salon Owners**. Uses a shared layout (`Sidebar`, `TopBar`).
- `/super-admin-dashboard/`: Dedicated view for platform administrators to see platform stats and verify suppliers.
- `/supplier-dashboard/`: Dedicated interface for B2B product sellers to manage their catalogs and orders.
- `/[salon]/`: Public dynamic routing for client-facing booking engine (`/[salon]/book`, `/[salon]/queue`).
- `/components`: Highly reusable modular UI bits (`Modal.tsx`, `Sidebar.tsx`, landing page sections).

### 2.2 API Integration Mapping

Most logic maps cleanly via `useEffect` hook wrappers or Context hooks.
- **`AuthContext.tsx`**: Hits `/api/auth/login`. On success, stores JWT to LocalStorage and handles role-based `router.push()`.
- **`Dashboard Layout`**: Retrieves `salon` from LocalStorage for render logic.
- **Missing Integrations**: There doesn't seem to be a concrete UI mechanism to update global Admin settings or manage the platform tier plans (Pricing is hardcoded).

### 2.3 Role-Based UI Rendering ❌

- **Flaw**: Route guarding relies purely on React state and LocalStorage (`AuthContext`). If a user manually resets their role string in `localStorage` to `super_admin`, they will be granted full access to `/super-admin-dashboard`.
- **Protection**: There are no `getServerSideProps` or Next.js layout validations checking the JWT via cookies before rendering the components.

### 2.4 State Management Review

- **Method**: Core Next.js React Contexts (`AuthContext`, `SalonContext`, `QueueContext`, `BookingContext`) used alongside default `useState`.
- **Review**: Good modular separation, however `localStorage` is heavily leaned on for storing complex entities (like the entire `user` and `salon` objects). This can easily become out-of-sync with the database. Consider utilizing libraries like `React Query (TanStack)` or `SWR` for remote state caching.

---

## ⚠️ 3. GAP ANALYSIS (MOST IMPORTANT)

### 3.1 Missing Features
- **Backend API Protection**: Missing JWT Validator middleware. APIs do not extract user context from the authorization headers.
- **Image/File Storage**: `businessLogo`, `image` fields seem to assume absolute strings. No evidence of S3 bucket or Cloudinary integration logic in backend.
- **Forgot/Reset Password**: No UI or API for users who lost their credentials.

### 3.2 Logic Issues / Bugs
- **IDOR Vulnerabilities**: A salon owner can alter the `salonId` payload in their browser's Network tab and manipulate records belonging to competitor salons.
- **Frontend Role Spoofing**: Since `super-admin-dashboard` layout doesn't strictly validate tokens against a remote authority, anyone navigating to `/super-admin-dashboard` sees the intelligent dashboard layout (and given the backend lacks checks, they can press the approve button successfully).

### 3.3 UX Issues
- **Loading Spinners**: While Contexts have good error handling, deeply nested API calls via standard `fetch` could benefit from global toaster notifications (like `react-hot-toast`) on failures instead of silent console errors.

### 3.4 Performance Issues
- **Uncapped Pagination**: DB search actions (like `Queue.find({ salonId })` or `MarketplaceProduct.find()`) do not utilize Skip/Limit pagination. As the system scales, transferring thousands of records into the frontend will crash client browsers.

---

## 🚀 4. IMPROVEMENT SUGGESTIONS

1. **Security Enhancement (Mandatory)**: 
   Inject a backend middleware wrapper ensuring every API call validates the Bearer JWT token, ensures the token hasn't expired, and extracts `userId` & `role` directly from the token payload (NOT from the request body).
2. **Move to HTTP-Only Cookies**: 
   Drop `localStorage` for JWT storage. Use `cookies-next` or native Next.js server actions to enforce HTTP-Only `authToken` cookies.
3. **Data Fetching Realism**: 
   Refactor large lists (`services`, `marketplace`, `client list`) into Paginated cursors on the API side.
4. **Input Sanitization**: 
   Implement validation tools like `Zod` or `Joi` inside the API routes. Right now, missing fields in `req.json()` will cause raw MongoDB exceptions.

---

## 📊 5. ROLE-BASED SYSTEM SUMMARY TABLE

| Feature/API | `super_admin` | `salon_owner` | `supplier` |
|------------|-------------|-------------|-----------|
| **Access Control (Ideally)** | Platform-wide | Salon-bound | Supplier-bound |
| **Manage Subscriptions & Billing** | ✅ | ✅ | ❌ |
| **Approve/Reject Suppliers** | ✅ | ❌ | ❌ |
| **View Global Platform Metrics** | ✅ | ❌ | ❌ |
| **Create/Edit Salon Profile** | ✅ | ✅ | ❌ |
| **Manage Salon Staff & Queue** | ✅ | ✅ | ❌ |
| **Access B2B Marketplace (Buy)** | ✅ | ✅ | ❌ |
| **Access B2B Marketplace (Sell)** | ✅ | ❌ | ✅ |
| **Manage Inventory Stocks** | ✅ | ✅ | ❌ |

*(Note: ✅ indicates who **should** have access. Currently, the system lacks enforcing gates for these restrictions)*
