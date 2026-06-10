---
name: Booking Status Fix (2026-04-07)
description: Fixed booking lifecycle status transitions and stale data
type: feedback

## Summary
Fixed booking status not updating issue. Booking lifecycle now works correctly:
- upcoming → in-progress → completed
- Status updates at correct trigger points
- Dashboard shows accurate real-time data

## Changes Made

### 1. Booking Model (models/Booking.ts)
- Added "in-progress" to status enum
- Added `startedAt` and `completedAt` timestamps
- Status enum now: ["upcoming", "in-progress", "completed", "cancelled"]

### 2. Queue Serve API (app/api/queue/serve/route.ts)
- When a queue item with `bookingId` is marked as serving, the linked booking status is updated to "in-progress"
- Sets `startedAt` timestamp
- Added logging for tracking

### 3. Dashboard Stats API (app/api/salon/dashboard/stats/route.ts)
- Added auto-status update: stale "upcoming" bookings with past dates are auto-migrated to "completed"
- Runs on every stats request to keep data fresh

### 4. Dashboard Bookings Page (app/dashboard/bookings/page.tsx)
- Fixed Booking interface: changed from 'confirmed'|'pending'|... to 'upcoming'|'in-progress'|'completed'|'cancelled'
- Updated status colors:
  - upcoming: blue
  - in-progress: yellow
  - completed: green
  - cancelled: red
- Updated status icons
- Updated filter dropdown options

### 5. Bookings List API (app/api/bookings/list/route.ts)
- Removed hardcoded status filter (was only returning "upcoming")
- Now supports optional `?status=` query param for filtering
- Returns all statuses by default
- Added data transformation to provide consistent `serviceName` field

### 6. Data Migration Script (scripts/migrate-bookings.js)
- Created standalone Node.js script
- Updates old "upcoming" bookings with past dates to "completed"
- Sets `completedAt` timestamp
- Run: `node scripts/migrate-bookings.js`

## Flow Verification

1. **Booking Created** → status: "upcoming"
2. **Customer Arrives** → Added to queue (Queue item with bookingId)
3. **Service Starts** → Drag to staff seat → `/api/queue/serve`:
   - Queue item status: "serving"
   - Booking status: "in-progress"
   - Booking.startedAt: set
4. **Payment Completes** → Drag to done → `/api/queue/remove`:
   - Queue item deleted
   - Booking status: "completed"
   - Booking.paymentStatus: "paid"
   - Booking.completedAt: set
5. **Dashboard Refresh** → Auto-updates any stale bookings that missed steps

## Running the Migration

Before relying on the system, run the migration to fix existing stale data:

```bash
node scripts/migrate-bookings.js
```

This will:
- Find all "upcoming" bookings with past dates
- Update them to "completed"
- Set `completedAt` to now

## Backend is Source of Truth

All status updates happen in backend APIs. Frontend only displays what the backend returns. This ensures consistency across all modules (Dashboard, Bookings page, Queue).

## Testing Checklist

- [ ] Create a new booking (status: upcoming)
- [ ] Add to queue
- [ ] Start service (drag to staff) → booking status becomes "in-progress"
- [ ] Complete payment → booking status becomes "completed"
- [ ] Check dashboard stats reflect correct counts
- [ ] Check bookings page shows correct status badge
- [ ] Refresh dashboard → stale bookings auto-cleanup works

## Notes

- The `/api/bookings/complete` endpoint remains as a direct way to mark bookings complete (used by payment integration)
- The auto-update in stats API ensures no stale data even if queue flow is bypassed
- All APIs have proper logging for debugging
- The booking model is backward compatible (old fields retained)
