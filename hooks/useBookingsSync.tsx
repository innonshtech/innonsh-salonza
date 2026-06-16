"use client";

import { useEffect, useRef } from "react";
import { useToast } from "@/components/ui/Toast";
import { supabaseAnon } from "@/lib/supabase";

export function useBookingsSync(salonId: string | undefined | null) {
  const isInitialLoadRef = useRef(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (!salonId || !supabaseAnon) return;

    console.log(`[Realtime Sync] Subscribing to bookings for salon: ${salonId}`);

    // Set up native Supabase Realtime listener
    const channel = supabaseAnon
      .channel(`bookings_sync_${salonId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `salon_id=eq.${salonId}`
        },
        (payload: any) => {
          console.log("[Realtime Sync] Booking change detected:", payload);

          if (payload.eventType === "INSERT") {
            const newBooking = payload.new;
            const customerName = newBooking.customer_name || "A client";

            // 1. Show toast notification
            const msg = `New Booking: ${customerName} booked an appointment`;
            showToast(msg, "success");

            // 2. Dispatch custom event to notification panel
            window.dispatchEvent(new CustomEvent("newBookingNotification", {
              detail: {
                message: msg,
                time: new Date().toISOString()
              }
            }));
          }

          // 3. Trigger global data refresh events in UI dashboard, bookings lists, and queue screens
          window.dispatchEvent(new Event("refreshDashboardStats"));
          window.dispatchEvent(new Event("refreshBookings"));
          window.dispatchEvent(new Event("refreshQueue"));
        }
      )
      .subscribe((status: string) => {
        console.log(`[Realtime Sync] Subscription status: ${status}`);
      });

    // Failsafe deep refresh of all dashboard data (every 2 minutes)
    const deepRefreshInterval = setInterval(() => {
      window.dispatchEvent(new Event("refreshDashboardStats"));
      window.dispatchEvent(new Event("refreshBookings"));
      window.dispatchEvent(new Event("refreshQueue"));
    }, 120000);

    return () => {
      supabaseAnon.removeChannel(channel);
      clearInterval(deepRefreshInterval);
    };
  }, [salonId]);
}
