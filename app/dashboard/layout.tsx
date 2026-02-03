"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [salon, setSalon] = useState<any>(null);

  useEffect(() => {
    async function check() {
      // Load salon from localStorage
      const saved = localStorage.getItem("salon");
      if (saved) {
        setSalon(JSON.parse(saved));
      }

      // Allow user to access setup & no-access pages freely
      if (pathname === "/dashboard/setup" || pathname === "/dashboard/no-access" || pathname === "/dashboard/settings") {
        setAllowed(true);
        return;
      }

      // Check if salon exists
      if (!saved) {
        router.push("/dashboard/setup");
        return;
      }

      const salonData = JSON.parse(saved);

      // Check subscription
      const res = await fetch(`/api/subscription/status?salonId=${salonData._id}`);
      const data = await res.json();

      if (!data.active) {
        router.push("/dashboard/no-access");
      } else {
        setAllowed(true);
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
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-slate-900">TrimSetGo</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Salon info */}
          {salon && (
            <div className="px-6 py-4 border-b border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Current Salon</p>
              <p className="mt-1 text-sm font-semibold text-slate-900 truncate">{salon.name}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors
                    ${isActive
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-slate-700 hover:bg-slate-100'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-100 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-700 font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>

            <div className="flex-1 lg:flex lg:items-center lg:justify-between">
              <div className="flex-1 max-w-2xl">
                {/* Search bar - optional */}
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 ml-4">
                {/* Notifications */}
                <button className="p-2 rounded-lg hover:bg-slate-100 relative">
                  <Bell className="w-5 h-5 text-slate-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
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