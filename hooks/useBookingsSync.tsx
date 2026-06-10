"use client";

import { useEffect, useRef } from "react";
import { useToast } from "@/components/ui/Toast";

export function useBookingsSync(salonId: string | undefined | null) {
  const lastTimestampRef = useRef<string | null>(null);
  const isInitialLoadRef = useRef(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (!salonId) return;

    // Load last known timestamp from sessionStorage so it persists across soft navigation
    if (isInitialLoadRef.current && typeof window !== "undefined") {
      const stored = sessionStorage.getItem(`lastBookingTs_${salonId}`);
      if (stored) lastTimestampRef.current = stored;
    }

    const checkLatestBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/latest?salonId=${salonId}`);
        if (!res.ok) return;

        const data = await res.json();
        
        if (data.success && data.latestTimestamp) {
          const currentLatest = data.latestTimestamp;
          
          // If we have a new timestamp
          if (lastTimestampRef.current && lastTimestampRef.current !== currentLatest && !isInitialLoadRef.current) {
            
            // 1. Show Notification
            const msg = data.customerName 
              ? `New Booking: ${data.customerName} booked ${data.serviceName}`
              : "A new booking has been made.";
            
            showToast(msg, "success");

            // 2. Trigger global data refresh events globally
            window.dispatchEvent(new Event("refreshDashboardStats"));
            window.dispatchEvent(new Event("refreshBookings"));
            window.dispatchEvent(new Event("refreshQueue"));
            
            // 3. Dispatch to notification panel
            window.dispatchEvent(new CustomEvent("newBookingNotification", {
              detail: {
                message: msg,
                time: new Date().toISOString()
              }
            }));
          }

          // Update ref and storage
          lastTimestampRef.current = currentLatest;
          sessionStorage.setItem(`lastBookingTs_${salonId}`, currentLatest);
        }
      } catch (error) {
        // Silent fail on network error, will retry next interval
        console.error("Booking sync polling failed:", error);
      } finally {
        if (isInitialLoadRef.current) {
          isInitialLoadRef.current = false;
        }
      }
    };

    // Layer 1: Detect newly created bookings instantly (every 30 seconds)
    // Run immediately once
    checkLatestBooking();
    const quickPollInterval = setInterval(checkLatestBooking, 30000);

    // Layer 2: Failsafe deep refresh of all dashboard data (every 2 minutes)
    const deepRefreshInterval = setInterval(() => {
      window.dispatchEvent(new Event("refreshDashboardStats"));
      window.dispatchEvent(new Event("refreshBookings"));
      window.dispatchEvent(new Event("refreshQueue"));
    }, 120000);

    return () => {
      clearInterval(quickPollInterval);
      clearInterval(deepRefreshInterval);
    };
  }, [salonId]);
}
