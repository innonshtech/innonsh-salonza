"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  Scissors,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Package
} from "lucide-react";

export default function DashboardHome() {
  const { user } = useAuth();
  const [salon, setSalon] = useState<any>(null);
  const [stats, setStats] = useState({
    todayBookings: 0,
    activeQueue: 0,
    totalServices: 0,
    inactiveServices: 0,
    monthlyRevenue: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const hasLoadedRef = useRef(false);

  // Memoize loadDashboardData to prevent recreation on every render
  const loadDashboardData = useCallback(async (salonId: string) => {
    try {
      setLoadingStats(true);
      const res = await fetch(`/api/salon/dashboard/stats?salonId=${salonId}`);

      if (!res.ok) {
        console.error("Dashboard API failed:", res.status);
        return;
      }

      const data = await res.json();

      if (data.success && data.stats) {
        // Only update if data changed (prevents unnecessary re-renders)
        setStats(prev => {
          const newStats = data.stats;
          if (JSON.stringify(prev) === JSON.stringify(newStats)) return prev;
          return newStats;
        });
        setActivities(prev => {
          const newActivities = data.recentActivity || [];
          if (JSON.stringify(prev) === JSON.stringify(newActivities)) return prev;
          return newActivities;
        });
        setSchedule(prev => {
          const newSchedule = data.todaysSchedule || [];
          if (JSON.stringify(prev) === JSON.stringify(newSchedule)) return prev;
          return newSchedule;
        });
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Load salon from localStorage only once on mount
  useEffect(() => {
    if (hasLoadedRef.current) return; // Prevent double execution in StrictMode

    const saved = localStorage.getItem("salon");
    if (saved) {
      try {
        const salonData = JSON.parse(saved);
        setSalon(salonData);
        loadDashboardData(salonData._id);
      } catch (error) {
        console.error("Failed to parse salon from localStorage:", error);
      }
    }
    hasLoadedRef.current = true;
  }, [loadDashboardData]);

  // Listen for refresh events (payment completion etc)
  useEffect(() => {
    const handleRefresh = () => {
      if (salon && salon._id) {
        loadDashboardData(salon._id);
      }
    };

    window.addEventListener('refreshDashboardStats', handleRefresh);
    return () => window.removeEventListener('refreshDashboardStats', handleRefresh);
  }, [salon, loadDashboardData]);

  if (!salon) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      name: "Today's Bookings",
      value: stats.todayBookings,
      icon: Calendar,
      color: "purple",
      change: "",
      changeType: "neutral",
    },
    {
      name: "Waiting",
      value: stats.activeQueue,
      icon: Users,
      color: "blue",
      change: "",
      changeType: "neutral",
    },
    {
      name: "Total Services",
      value: stats.totalServices,
      icon: Scissors,
      color: "green",
      change: stats.inactiveServices > 0 ? `${stats.inactiveServices} inactive` : "",
      changeType: "neutral",
    },
    {
      name: "Monthly Revenue",
      value: `₹${(stats.monthlyRevenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "orange",
      change: "This Month",
      changeType: "positive",
    },
  ];

  const quickActions = [
    { name: "Manage Services", href: "/dashboard/services", icon: Scissors, color: "purple" },
    { name: "View Queue", href: "/dashboard/queue", icon: Users, color: "blue" },
    { name: "All Bookings", href: "/dashboard/bookings", icon: Calendar, color: "green" },
    { name: "Inventory", href: "/dashboard/inventory", icon: Package, color: "orange" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Welcome back, {user?.name}! 👋
        </h1>
          <p className="mt-1 text-xs text-slate-600">
            Here's what's happening at <span className="font-semibold text-purple-600">{salon.name}</span> today for {salon?.name || "your salon"}
          </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg border border-slate-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-${stat.color}-100 rounded-md flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <span className={`text-xs font-medium ${stat.changeType === 'positive' ? 'text-green-600' :
                stat.changeType === 'negative' ? 'text-red-600' :
                  'text-slate-600'
                }`}>
                {loadingStats ? '...' : stat.change}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {loadingStats ? (
                <div className="h-6 w-16 bg-slate-100 animate-pulse rounded"></div>
              ) : stat.value}
            </h3>
            <p className="text-xs text-slate-600 mt-1">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="group bg-white rounded-lg border border-slate-200 p-4 hover:border-purple-300 hover:shadow-md transition-all"
            >
              <div className={`w-8 h-8 bg-${action.color}-100 rounded-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-4 h-4 text-${action.color}-600`} />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">{action.name}</h3>
              <div className="flex items-center text-purple-600 text-xs font-medium">
                <span>Go to {action.name.toLowerCase()}</span>
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Activity List */}
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Recent Activity</h2>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded text-slate-500 text-sm">
                No recent activity
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity._id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-700 font-semibold text-xs">
                        {activity.name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{activity.name}</p>
                      <p className="text-xs text-slate-600">
                        {activity.services}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                      }`}>
                      {activity.status === 'completed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                      {activity.status}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link
            href="/dashboard/bookings"
            className="mt-4 block text-center py-2 text-purple-600 hover:text-purple-700 font-medium text-xs"
          >
            View all activity →
          </Link>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Today's Schedule</h2>
          <div className="space-y-2">
            {schedule.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded text-slate-500 text-sm">
                No bookings scheduled for today
              </div>
            ) : (
              schedule.map((appointment, index) => (
                <div key={index} className="flex items-start space-x-3 p-2.5 rounded hover:bg-slate-50">
                  <div className="w-16 flex-shrink-0">
                    <span className="text-xs font-semibold text-purple-600">
                      {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-slate-900">{appointment.customerName}</p>
                    <p className="text-xs text-slate-600">
                      {appointment.serviceIds?.map((s: any) => s.name).join(", ")} | ₹{appointment.totalPrice}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link
            href="/dashboard/bookings"
            className="mt-4 block text-center py-2 text-purple-600 hover:text-purple-700 font-medium text-xs"
          >
            View full schedule →
          </Link>
        </div>
      </div>

      {/* Public Site Link */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-md font-bold text-slate-900 mb-1">Your Public Booking Site</h3>
            <p className="text-xs text-slate-600">Share this link with your customers</p>
          </div>
          <Link
            href={`/${salon.slug}`}
            target="_blank"
            className="px-4 py-2 text-sm bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition-colors"
          >
            View Site →
          </Link>
        </div>
        <div className="mt-3 p-2.5 bg-white rounded border border-slate-200">
          <code className="text-xs text-purple-600">
            {typeof window !== 'undefined' ? `${salon.slug}.${window.location.origin.replace(/^https?:\/\//, '')}` : `${salon.slug}.yourdomain.com`}
          </code>
        </div>
      </div>
    </div>
  );
}