"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  Scissors,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight
} from "lucide-react";

export default function DashboardHome() {
  const { user } = useAuth();
  const [salon, setSalon] = useState<any>(null);
  const [stats, setStats] = useState({
    todayBookings: 0,
    activeQueue: 0,
    totalServices: 0,
    monthlyRevenue: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("salon");
    if (saved) {
      const salonData = JSON.parse(saved);
      setSalon(salonData);
      loadDashboardData(salonData._id);
    }
  }, []);

  async function loadDashboardData(salonId: string) {
    try {
      const res = await fetch(`/api/salon/dashboard/stats?salonId=${salonId}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setActivities(data.recentActivity || []);
        setSchedule(data.todaysSchedule || []);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoadingStats(false);
    }
  }

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
      change: "Today",
      changeType: "neutral",
    },
    {
      name: "Active Queue",
      value: stats.activeQueue,
      icon: Users,
      color: "blue",
      change: `${stats.activeQueue} waiting`,
      changeType: "neutral",
    },
    {
      name: "Total Services",
      value: stats.totalServices,
      icon: Scissors,
      color: "green",
      change: "Active",
      changeType: "positive",
    },
    {
      name: "Monthly Revenue",
      value: `₹${stats.monthlyRevenue.toLocaleString()}`,
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
    { name: "Settings", href: "/dashboard/settings", icon: Clock, color: "orange" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="mt-2 text-slate-600">
          Here's what's happening at <span className="font-semibold text-purple-600">{salon.name}</span> today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' :
                stat.changeType === 'negative' ? 'text-red-600' :
                  'text-slate-600'
                }`}>
                {loadingStats ? '...' : stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              {loadingStats ? (
                <div className="h-8 w-16 bg-slate-100 animate-pulse rounded"></div>
              ) : stat.value}
            </h3>
            <p className="text-sm text-slate-600 mt-1">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-purple-300 hover:shadow-lg transition-all"
            >
              <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-5 h-5 text-${action.color}-600`} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{action.name}</h3>
              <div className="flex items-center text-purple-600 text-sm font-medium">
                <span>Go to {action.name.toLowerCase()}</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity List */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-lg text-slate-500">
                No recent activity
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-700 font-semibold text-sm">
                        {activity.customerName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{activity.customerName}</p>
                      <p className="text-sm text-slate-600">
                        {activity.serviceIds?.map((s: any) => s.name).join(", ") || "No services"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                      }`}>
                      {activity.status === 'completed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                      {activity.status}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link
            href="/dashboard/bookings"
            className="mt-4 block text-center py-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            View all activity →
          </Link>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Today's Schedule</h2>
          <div className="space-y-3">
            {schedule.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-lg text-slate-500">
                No bookings scheduled for today
              </div>
            ) : (
              schedule.map((appointment, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50">
                  <div className="w-20 flex-shrink-0">
                    <span className="text-sm font-semibold text-purple-600">
                      {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{appointment.customerName}</p>
                    <p className="text-sm text-slate-600">
                      {appointment.serviceIds?.map((s: any) => s.name).join(", ")} | ₹{appointment.totalPrice}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link
            href="/dashboard/bookings"
            className="mt-4 block text-center py-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            View full schedule →
          </Link>
        </div>
      </div>

      {/* Public Site Link */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Your Public Booking Site</h3>
            <p className="text-slate-600">Share this link with your customers</p>
          </div>
          <Link
            href={`/${salon.slug}`}
            target="_blank"
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            View Site →
          </Link>
        </div>
        <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200">
          <code className="text-sm text-purple-600">
            {typeof window !== 'undefined' ? `${salon.slug}.${window.location.origin}` : `${salon.slug}.yourdomain.com`}
          </code>
        </div>
      </div>
    </div>
  );
}