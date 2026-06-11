"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useBookingsSync } from "@/hooks/useBookingsSync";
import {
  LayoutDashboard,
  Scissors,
  Users,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User,
  Image as ImageIcon,
  Tag,
  TrendingUp,
  Package,
  Heart,
  ShoppingBag,
  Megaphone,
  CreditCard,
  MessageCircle
} from "lucide-react";

// Check if payments are enabled on client side
const PAYMENTS_ENABLED = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [salon, setSalon] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Initialize real-time booking synchronization
  useBookingsSync(salon?._id);

  // Listen for new booking notifications
  useEffect(() => {
    const handleNewNotification = (e: any) => {
      setNotifications(prev => [e.detail, ...prev].slice(0, 10)); // Keep last 10
    };
    window.addEventListener('newBookingNotification', handleNewNotification);
    return () => window.removeEventListener('newBookingNotification', handleNewNotification);
  }, []);

  useEffect(() => {
    async function check() {
      // Load salon from localStorage
      const saved = localStorage.getItem("salon");
      if (saved) {
        setSalon(JSON.parse(saved));
      }

      // Allow user to access setup & settings pages freely
      if (pathname === "/dashboard/setup" || pathname === "/dashboard/settings") {
        setAllowed(true);
        return;
      }

      // Check if salon exists
      if (!saved) {
        router.push("/dashboard/setup");
        return;
      }

      const salonData = JSON.parse(saved);

      // Check subscription only if payments are enabled
      if (PAYMENTS_ENABLED) {
        try {
          const res = await fetch(`/api/subscription/status?salonId=${salonData._id}`);
          const data = await res.json();

          if (!data.active) {
            // Subscription expired or doesn't exist, redirect to no-access or settings
            if (pathname !== "/dashboard/no-access") {
              router.push("/dashboard/no-access");
            }
            setAllowed(false);
            return;
          }
        } catch (error) {
          console.error("Failed to check subscription:", error);
          // On error, allow access to avoid lockout
          setAllowed(true);
          return;
        }
      }

      // Payments disabled or subscription active
      setAllowed(true);

      // Redirect from no-access to dashboard if trying to access it
      if (pathname === "/dashboard/no-access") {
        router.push("/dashboard");
      }
    }

    check();
  }, [user, pathname, router]);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Services", href: "/dashboard/services", icon: Scissors },
    { name: "Queue", href: "/dashboard/queue", icon: Users },
    { name: "Daily Collection", href: "/dashboard/collections", icon: TrendingUp },
    { name: "Inventory", href: "/dashboard/inventory", icon: Package },
    { name: "Marketplace", href: "/dashboard/marketplace", icon: ShoppingBag },
    { name: "Marketing", href: "/dashboard/marketing", icon: Megaphone },
    { name: "Memberships", href: "/dashboard/memberships", icon: CreditCard },
    { name: "Feedback", href: "/dashboard/feedback", icon: MessageCircle },
    { name: "Clients", href: "/dashboard/clients", icon: Heart },
    { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
    { name: "Staff Management", href: "/dashboard/staff", icon: User },
    { name: "Gallery", href: "/dashboard/gallery", icon: ImageIcon },
    { name: "Offers", href: "/dashboard/offers", icon: Tag },
    { name: "Settings", href: "/dashboard/settings", icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!allowed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-56 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center overflow-hidden p-0.5">
                <img src="/salon_logo.png" alt="Innonsh Salonza Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-base font-semibold text-slate-900">Innonsh Salonza</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-slate-100"
            >
              <X className="w-4 h-4 text-slate-600" />
            </button>
          </div>



          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto no-scrollbar">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-md font-medium text-[13px] transition-colors
                    ${isActive
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-slate-700 hover:bg-slate-100'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>


        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-56">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded hover:bg-slate-100"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>

            <div className="flex-1 lg:flex lg:items-center lg:justify-between">
              <div className="flex-1 max-w-2xl">
                {/* Search bar - optional */}
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 ml-4">
                {/* Salon info */}
                {salon && (
                  <div className="hidden sm:block text-right pr-3 border-r border-slate-200">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Current Salon</p>
                    <p className="text-sm font-semibold text-slate-900 truncate max-w-[150px]">{salon.name}</p>
                  </div>
                )}

                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-1.5 rounded hover:bg-slate-100 relative"
                  >
                    <Bell className="w-4 h-4 text-slate-600" />
                    {notifications.length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                      <div className="px-4 py-3 border-b border-slate-200 sticky top-0 bg-white z-10 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                        {notifications.length > 0 && (
                          <button 
                            onClick={() => setNotifications([])} 
                            className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center">
                          <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-sm font-medium text-slate-600">No new notifications</p>
                          <p className="text-xs text-slate-400 mt-1">You're all caught up!</p>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          {notifications.map((notif, idx) => (
                            <div key={idx} className="p-3 border-b border-slate-100 hover:bg-slate-50 last:border-0">
                              <p className="text-sm text-slate-800">{notif.message}</p>
                              <p className="text-[10px] text-slate-400 mt-1">
                                {new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative border-l border-slate-200 pl-3">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200">
                      <span className="text-sm font-semibold text-purple-700">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                      <div className="px-4 py-3 border-b border-slate-200">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}