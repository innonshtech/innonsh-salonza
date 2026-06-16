# 🧪 Salon Management System – Testing Flow

**Document Version:** 1.0  
**Last Updated:** April 3, 2026  
**Branch:** `final-errors`  
**Target Audience:** QA Managers, Product Owners  

---

> **📋 Document Overview**
> 
> This testing flow guide provides step-by-step instructions for validating all modules in the Salon Management System. It covers both positive and negative test cases, expected results, and clearly identifies pending features.
> 
> **System Status:** Mostly Stable | Core Features: ✅ Production-Ready | Pending: 2 Areas

---

## 🔧 Pre-Testing Setup

### Environment Requirements

1. **Node.js & Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create `.env.local` or `.env` in the project root:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name (optional)
   CLOUDINARY_API_KEY=your_api_key (optional)
   CLOUDINARY_API_SECRET=your_api_secret (optional)
   ```

3. **Start Application**
   ```bash
   npm run dev
   ```
   Application runs at: `http://localhost:3000`

4. **Database**
   - Ensure Supabase instance is accessible
   - Connect and verify tables schema (e.g. via Supabase Studio dashboard)

---

## 📋 Module-wise Testing Flows

---

### FLOW 1: CLIENT MANAGEMENT 👥

#### Test 1.1: Add New Client

**Steps:**
1. Log in to the system with admin/staff credentials
2. Navigate to **Dashboard → Clients**
3. Click **"Add Client"** button (top-right)
4. Fill in the form:
   - Name: `Test Client`
   - Phone: `+919876543210` (valid international format)
   - Email: `test@example.com`
   - Gender: Select from dropdown
   - Notes: `Test notes`
   - Rating: Select 4 stars
5. Click **"Save"**

**Expected:**
- ✅ Client appears in the clients list immediately
- ✅ Success toast notification: "Client added successfully"
- ✅ Form clears after successful submission
- ✅ Client data persists after page refresh

---

#### Test 1.2: Edit Client Information

**Steps:**
1. From the clients list, click the **3-dot menu (⋮)** on any client row
2. Select **"Edit"**
3. Modify any field (e.g., change phone to `+919812345678`)
4. Click **"Update"**

**Expected:**
- ✅ Edit modal opens with pre-filled data
- ✅ Changes saved successfully
- ✅ Toast: "Client updated successfully"
- ✅ Updated values appear in the list

---

#### Test 1.3: View Client Details (Read-Only)

**Steps:**
1. Click **3-dot menu (⋮)** on a client
2. Select **"View"**

**Expected:**
- ✅ Modal opens displaying all client information
- ✅ All fields are disabled (read-only)
- ✅ Close button (X) works correctly

---

#### Test 1.4: Delete Client (Soft Delete)

**Steps:**
1. Click **3-dot menu (⋮)** on a client
2. Select **"Delete"**
3. Confirm deletion in the confirmation dialog

**Expected:**
- ✅ Confirmation dialog appears
- ✅ Client removed from active list after confirmation
- ✅ Toast: "Client deleted successfully"
- ✅ Client can be recovered from archived view (if delete is soft)

---

#### Test 1.5: Phone Number Validation

**Steps:**
1. Open "Add Client" form
2. Enter invalid phone: `12345`
3. Try to save

**Expected:**
- ✅ Real-time validation message: "Please enter a valid phone number"
- ✅ Form submission blocked until valid format entered
- ✅ Accepts international format: `+[country_code][number]`

---

#### Test 1.6: Search & Filter Clients

**Steps:**
1. Add 5+ clients with different names
2. Use the search bar to search by:
   - Name fragment
   - Phone number
   - Email

**Expected:**
- ✅ List filters in real-time
- ✅ Matching clients displayed
- ✅ No results shown for non-matches

---

**Module Status:** ✅ **Fully Functional**  
All client management features (CRUD, search, rating, validation) are working correctly.

---

### FLOW 2: STAFF MANAGEMENT 👨‍💼

#### Test 2.1: Add Staff Member

**Steps:**
1. Navigate to **Dashboard → Staff**
2. Click **"Add Staff"**
3. Fill in:
   - Name: `Staff Member`
   - Email: `staff@salon.com`
   - Phone: `+919876543210`
   - Role: Select (Admin/Employee)
   - Password: `StrongPass123!`
4. Click **"Create"**

**Expected:**
- ✅ Staff added successfully
- ✅ Toast notification appears
- ✅ Staff appears in the list with role badge

---

#### Test 2.2: Staff Phone Validation

**Steps:**
1. Try to create staff with phone: `1234567890`
2. Observe validation

**Expected:**
- ✅ Validation message displayed: "Invalid phone format"
- ✅ Submit disabled until valid format entered
- ✅ Accepts E.164 format: `+[country code][number]`

---

#### Test 2.3: Staff Role Assignment

**Steps:**
1. Create staff with **Admin** role
2. Log out and log in as that admin
3. Verify permissions in dashboard

**Expected:**
- ✅ Admin has full access to all modules
- ✅ Employee role has restricted access as configured

---

**Module Status:** ✅ **Fully Functional**  
Staff management with phone validation and role-based access is working.

---

### FLOW 3: SERVICES ✂️

#### Test 3.1: Create Service Without Image

**Steps:**
1. Navigate to **Dashboard → Services**
2. Click **"Add Service"**
3. Fill in:
   - Name: `Haircut`
   - Duration: `30` minutes
   - Price: `500`
   - Description: `Basic haircut`
   - Image: Skip (leave blank)
4. Click **"Save"**

**Expected:**
- ✅ Service created successfully
- ✅ Toast: "Service added successfully"
- ✅ Service appears in the services list

---

#### Test 3.2: Create Service With Manual Image URL

**Steps:**
1. Click **"Add Service"**
2. Fill all fields including:
   - Image URL: `https://example.com/service-image.jpg`
3. Click **"Save"**

**Expected:**
- ✅ Image loads/previews correctly
- ✅ Service saved with image URL
- ✅ Image displays in service card/list view

---

#### Test 3.3: Edit Service

**Steps:**
1. Hover over any service row
2. Click **Edit (pencil icon)**
3. Change price to `750`
4. Click **"Update"**

**Expected:**
- ✅ Edit form opens with current values
- ✅ Update successful
- ✅ Toast: "Service updated successfully"
- ✅ Price updates in the list

---

#### Test 3.4: Delete Service

**Steps:**
1. Click **Delete (trash icon)** on any service
2. Confirm deletion

**Expected:**
- ✅ Confirmation dialog appears
- ✅ Service removed from list
- ✅ Toast: "Service deleted successfully"

---

#### Test 3.5: Service Selection in Booking

**Steps:**
1. Navigate to **Dashboard → Bookings**
2. Start a new booking
3. Open service selection dropdown/modal

**Expected:**
- ✅ All active services appear in the list
- ✅ Services display with name, duration, price
- ✅ Selected service details show in booking summary

---

#### Test 3.6: Image Upload Feature Flag

**Steps:**
1. Observe "Add Service" form
2. Note the image upload behavior

**Expected Behavior:**
- ⚠️ **Image upload is currently feature-flagged**
- ✅ Manual URL input works normally
- ✅ System operates stably without auto-upload
- ✅ Feature can be enabled via `CLOUDINARY_ENABLED` flag

---

**Module Status:** ✅ **Fully Functional**  
Service CRUD operations work correctly. Image upload is feature-flagged but manual URL input works.

---

### FLOW 4: INVENTORY 📦

#### Test 4.1: Add Inventory Item

**Steps:**
1. Navigate to **Dashboard → Inventory**
2. Click **"Add Item"**
3. Fill in:
   - Item Name: `Shampoo`
   - Quantity: `50`
   - Unit Price: `200`
   - Reorder Level: `10`
4. Click **"Save"**

**Expected:**
- ✅ Item appears in inventory list
- ✅ Toast: "Item added successfully"
- ✅ Quantity and price display correctly

---

#### Test 4.2: Edit Inventory Item

**Steps:**
1. Click **Edit** on any inventory item
2. Change quantity to `45`
3. Click **"Update"**

**Expected:**
- ✅ Edit successful
- ✅ Toast: "Item updated successfully"
- ✅ Quantity updates in real-time

---

#### Test 4.3: Delete Inventory Item

**Steps:**
1. Click **Delete** on an inventory item
2. Confirm deletion

**Expected:**
- ✅ Confirmation dialog shown
- ✅ Item removed from list
- ✅ Toast: "Item deleted successfully"

---

#### Test 4.4: Low Stock Indicator

**Steps:**
1. Set an item's quantity below its reorder level
2. Observe list

**Expected:**
- ✅ Item highlighted or badge shows "Low Stock"
- ✅ Color coding (e.g., red/yellow) indicates urgency

---

**Module Status:** ✅ **Fully Functional**  
Inventory management (Add, Edit, Delete) all working correctly.

---

### FLOW 5: OFFERS 🎟️

#### Test 5.1: Create Offer

**Steps:**
1. Navigate to **Dashboard → Offers**
2. Click **"Add Offer"**
3. Fill in:
   - Offer Name: `Summer Sale`
   - Discount Percentage: `20%`
   - Start Date: Today
   - End Date: 30 days from now
   - Select Services: Choose at least 1 service
4. Click **"Save"**

**Expected:**
- ✅ Offer created successfully
- ✅ Toast: "Offer added successfully"
- ✅ Offer appears in the offers dashboard

---

#### Test 5.2: Offer Display in Dashboard

**Steps:**
1. Create 2-3 offers with different dates
2. Refresh the Offers page

**Expected:**
- ✅ All active offers display correctly
- ✅ Expired offers filtered out automatically (end date validation)
- ✅ Services associated with each offer display properly

---

#### Test 5.3: Offer Application in Booking

**Steps:**
1. Create a new booking
2. Select at least one service that has an active offer
3. Checkout

**Expected:**
- ✅ Offer applied automatically if eligible
- ✅ Discount calculated correctly
- ✅ Original price and discounted price both visible

---

#### Test 5.4: Edit Offer

**Steps:**
1. Click **Edit** on an existing offer
2. Change discount to `25%`
3. Update

**Expected:**
- ✅ Edit successful
- ✅ Toast: "Offer updated successfully"
- ✅ Updated offer reflected in booking flow

---

#### Test 5.5: Delete Offer

**Steps:**
1. Click **Delete** on an offer
2. Confirm

**Expected:**
- ✅ Offer removed from list
- ✅ Toast: "Offer deleted successfully"

---

**Module Status:** ✅ **Fully Functional**  
Offers module fully operational with proper date validation and booking integration.

---

### FLOW 6: GALLERY 🖼️ (⚠️ Yet to be Enabled)

#### Test 6.1: Gallery Image Management

**Steps:**
1. Navigate to **Dashboard → Gallery**
2. Click **"Add Photo"**
3. Observe the form

**Expected Behavior:**
- ⚠️ **Image upload is currently feature-flagged**
- ✅ Manual URL input field is available
- ✅ "Skip Upload" option allows proceeding without image
- ✅ System operates normally without Cloudinary integration

---

#### Important Notes: Image Upload Feature

> ⚠️ **Status:** Feature Flag Applied – Pending Cloudinary Configuration
> 
> - **Why:** Cloudinary API credentials and configuration are not yet finalized
> - **Current State:** System stable without image upload functionality
> - **Alternative:** All modules (Services, Gallery, Branding) accept manual image URLs
> - **Enablement:** Can be activated by setting `CLOUDINARY_ENABLED=true` in `.env.local` once configuration is ready
> - **Fallback:** If image upload fails, system gracefully falls back to placeholder images
> 
> **Modules Affected:**
> - Services (image field optional, URL accepted)
> - Gallery (manual URL input works)
> - Branding/Settings (logo upload)

---

**Module Status:** ⚠️ **Pending (Feature Flag Applied)**  
Gallery can be tested with manual URLs. Cloudinary integration pending.

---

### FLOW 7: MEMBERSHIPS 💎 (⚠️ In Progress)

#### Test 7.1: Create Membership Plan

**Steps:**
1. Navigate to **Dashboard → Memberships**
2. Click **"Add Membership"**
3. Fill in:
   - Plan Name: `Gold Member`
   - Price: `5000`
   - Validity (days): `365`
   - Description: `Full access to all services`
4. Click **"Save"**

**Expected:**
- ✅ Membership plan created (basic CRUD working)
- ✅ Toast notification appears
- ⚠️ Payment integration not yet active

---

#### Test 7.2: View Membership Plans

**Steps:**
1. Refresh Memberships page
2. View list of membership plans

**Expected:**
- ✅ Plans display correctly
- ✅ Price, validity, and description visible
- ✅ Create/Edit/Delete actions work

---

#### Important Notes: Membership Module

> ⚠️ **Status:** In Progress – ~70% Complete
> 
> **What Works:**
> - ✅ Basic CRUD operations (Create, Read, Update, Delete)
> - ✅ Membership model with Client relation
> - ✅ Status lifecycle (Active, Expired, Pending)
> - ✅ Frontend UI connected to working endpoints
> 
> **Pending Items:**
> - ⚠️ **Payment gateway integration** (coordination with Aniket)
> - ⚠️ Membership purchase flow for clients
> - ⚠️ Auto-renewal logic
> - ⚠️ Membership validation during booking (discount application)
> - ⚠️ Membership metrics dashboard
> 
> **Target Completion:** Monday, April 6, 2026  
> **Blocker:** Payment gateway setup required from Aniket

---

**Module Status:** ⚠️ **In Progress**  
Basic CRUD functional but payment integration and booking discounts pending. Do not mark as fully production-ready.

---

### FLOW 8: FEEDBACK SYSTEM 💬

#### Test 8.1: Submit Feedback

**Steps:**
1. As a client, navigate to booking confirmation or client profile
2. Locate feedback section
3. Select star rating (1-5)
4. Enter comment: `Excellent service!`
5. Click **"Submit Feedback"**

**Expected:**
- ✅ Feedback submitted successfully
- ✅ Toast: "Thank you for your feedback"
- ✅ Feedback appears in admin dashboard

---

#### Test 8.2: View Feedback in Admin Dashboard

**Steps:**
1. Log in as admin
2. Navigate to **Dashboard → Feedback**
3. View feedback list

**Expected:**
- ✅ All feedback displayed with:
   - Client name
   - Star rating (visual)
   - Comment text
   - Date/time
- ✅ Sorting by date or rating works
- ✅ Pagination (if many entries)

---

#### Test 8.3: Feedback on Client Profile

**Steps:**
1. Open any client's profile
2. Locate feedback section

**Expected:**
- ✅ All feedback for that client displayed
- ✅ Shows rating and comment
- ✅ Shows submission date

---

**Module Status:** ✅ **Fully Functional**  
Complete end-to-end feedback system with submission, listing, and display.

---

### FLOW 9: BOOKING FLOW 📅

#### Test 9.1: Create New Booking

**Steps:**
1. Navigate to **Dashboard → Bookings** (or use booking page)
2. Click **"New Booking"**
3. Select a client (from dropdown or search)
4. Select services (multiple supported)
5. Choose date and time slot
6. Apply offers (if any)
7. Confirm booking

**Expected:**
- ✅ Booking created successfully
- ✅ Confirmation details shown
- ✅ Toast: "Booking confirmed"
- ✅ Booking appears in bookings list

---

#### Test 9.2: Service Selection

**Steps:**
1. Start booking flow
2. Open service selection
3. Verify:
   - All active services listed
   - Duration and price displayed
   - Multiple selection enabled

**Expected:**
- ✅ Services loaded correctly (from Services module)
- ✅ Selection persists across steps
- ✅ Total duration calculated correctly (sum of all services)

---

#### Test 9.3: Offer Application

**Steps:**
1. Create an offer applicable to specific services
2. Book those services
3. Check if offer auto-applies

**Expected:**
- ✅ Eligible offers applied automatically
- ✅ Discount reflected in price summary
- ✅ Offer details visible in booking confirmation

---

#### Test 9.4: Booking Confirmation

**Steps:**
1. Complete booking
2. Check:
   - Client receives confirmation (if email/SMS enabled)
   - Admin dashboard updates
   - Booking appears in calendar view (if exists)

**Expected:**
- ✅ Confirmation notification shown
- ✅ Booking appears in list with correct details

---

**Module Status:** ✅ **Fully Functional**  
End-to-end booking workflow with service selection, offer application, and confirmation working correctly.

---

### FLOW 10: ERROR HANDLING & VALIDATION 🛡️

#### Test 10.1: API Error Handling

**Steps:**
1. Disconnect from database (simulate server error)
2. Try to perform any CRUD operation (e.g., add client)

**Expected:**
- ✅ System displays graceful error message
- ✅ Toast shows: "Something went wrong, please try again"
- ✅ Console logs technical details (but client doesn't see raw error)
- ✅ No application crash

---

#### Test 10.2: Form Validation

**Steps:**
1. Open any "Add/Edit" form
2. Try to submit with:
   - Empty required fields
   - Invalid email format
   - Invalid phone number
3. Observe error messages

**Expected:**
- ✅ Inline validation errors displayed
- ✅ Form submission blocked until corrections made
- ✅ Error messages are user-friendly

---

#### Test 10.3: Toast Notifications

**Steps:**
1. Trigger various actions:
   - Success (saving data)
   - Error (failed operation)
   - Warning (confirmation needed)
2. Observe toast behavior

**Expected:**
- ✅ Different colors for success/green, error/red, warning/yellow
- ✅ Auto-dismiss after 5 seconds
- ✅ Manual close (X) button available
- ✅ Multiple toasts queue properly

---

**Module Status:** ✅ **Fully Functional**  
Error handling, validation, and toast notifications are implemented correctly.

---

## ✅ VALIDATION CHECKLIST

### Functionality
- [x] Client CRUD operations
- [x] Staff CRUD operations with phone validation
- [x] Service CRUD operations (with optional image URL)
- [x] Inventory Add/Edit/Delete
- [x] Offer creation, editing, and deletion
- [x] Offer application in booking
- [x] Feedback submission and display
- [x] Complete booking flow (client → services → confirmation)
- [ ] Membership payment flow (pending)
- [ ] Cloudinary image upload (feature flagged)

### UX (User Experience)
- [x] Responsive layout on tablet and desktop
- [x] Loading states/skeletons during data fetch
- [x] Empty state illustrations with CTAs
- [x] Consistent button styling and hover effects
- [x] Intuitive form layouts with clear labels
- [x] Modal dialogs for add/edit/view operations
- [x] Confirmation dialogs for destructive actions
- [x] Real-time search and filtering
- [x] Toast notifications for user feedback

### Security
- [x] Authentication guard on protected routes
- [x] JWT token validation on API routes
- [x] Role-based access control (Admin vs Staff)
- [x] Salon-scoped queries (prevent cross-tenant data leaks)
- [x] CSRF protection on mutation endpoints
- [x] Server-side input validation and sanitization
- [x] Password strength requirements
- [x] Phone number format validation (E.164)

### Data Integrity
- [x] Soft delete pattern (isDeleted flag) across models
- [x] Database foreign key relationships
- [x] Transaction support for multi-step operations
- [x] Data validation before database commit
- [x] Unique constraints enforced
- [x] Proper indexing on frequently queried fields

---

**Exclusions from Final Validation:**
- ❌ Membership payment integration (pending Aniket coordination)
- ❌ Cloudinary direct image upload (feature-flagged)

---

## 🐛 BUG REPORTING FORMAT

When reporting bugs, please use this structured template:

```markdown
### Bug Report

**Module:** [e.g., Client Management]

**Test Name:** [e.g., Add Client with Invalid Phone]

**Expected Behavior:**
- Should show validation message
- Should prevent form submission

**Actual Behavior:**
- Form submits with invalid data
- No error displayed

**Steps to Reproduce:**
1. Navigate to Clients page
2. Click "Add Client"
3. Enter phone: `12345`
4. Click Save

**Console Errors:**
```
[Paste any console errors here]
```

**Network Errors:**
```
[Paste failing API responses here]
```

**Screenshot:** [Attach if applicable]

**Priority:** High/Medium/Low

**Environment:**
- Browser: Chrome/Firefox/Edge
- OS: Windows/Mac
- Version: [commit/branch]
```

---

## 📊 FINAL STATUS

### Overall Assessment

The Salon Management System is **mostly stable** and **near-production-ready** for core functionality.

### ✅ **Resolved & Production-Ready (8/10 Modules)**

1. **Client Management** – Full CRUD, rating system, validation, archive
2. **Staff Management** – CRUD with phone validation, role-based access
3. **Services** – CRUD with manual image URL support
4. **Inventory** – Complete Add/Edit/Delete with stock alerts
5. **Offers** – Full lifecycle with booking integration
6. **Feedback** – End-to-end submission and display
7. **Booking** – Complete flow with service selection and offers
8. **Error Handling & UX** – Toasts, validation, error boundaries

### ⚠️ **Pending & In Progress (2/10 Modules)**

1. **Image Upload (Cloudinary)**
   - Status: Feature-flagged, configuration pending
   - Impact: Low – System stable without it
   - Current: Manual URL input works as alternative
   - Action needed: Finalize Cloudinary credentials

2. **Membership Module**
   - Status: 70% complete – Basic CRUD working
   - Missing: Payment integration, auto-renewal, booking discounts
   - Blocker: Payment gateway setup from Aniket
   - Target: Monday, April 6, 2026

---

## 🚀 PRODUCTION READINESS

### ✅ **Ready After Pending Items**

The system can proceed to production **after** completion of:

1. **Membership Payment Integration** (Expected: Monday, April 6)
2. **Cloudinary Image Upload** (Expected: Variable, pending config)

### 🎯 **No Major Blockers Identified**

- Core business logic complete
- Data validation robust
- Error handling comprehensive
- Security measures in place
- Codebase reviewed and improved

### 📋 **Deployment Checklist**

Once pending items resolved:

- [ ] Final environment configuration review
- [ ] Security audit of API endpoints
- [ ] Performance testing on production-scale data
- [ ] Database backup and rollback plan prepared
- [ ] SSL/HTTPS configuration verified
- [ ] Email/SMS gateway testing (if used)
- [ ] Load testing (expected concurrent users)
- [ ] Final regression testing of all modules

### 🏗️ **AWS Hosting Note**

Infrastructure provisioning is pending handoff from the infra team. Once AWS resources are allocated:
- Deploy to staging environment first
- Run final integration tests
- Coordinate roll-out with all stakeholders
- Prepare monitoring and alerting (Grafana/Datadog)

---

## 📞 Support & Questions

For clarifications on testing procedures or to report issues:
1. Refer to this document first
2. Check `CODE_REVIEW_RESPONSE.md` for detailed issue resolution history
3. Contact the development team for technical questions

---

**Document End**

*Last updated: April 3, 2026*  
*Prepared for: Salon Management System QA & Product Team*
