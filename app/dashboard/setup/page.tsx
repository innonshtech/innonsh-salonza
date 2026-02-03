"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail,
  User,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2
} from "lucide-react";

export default function SalonSetupPage() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateSalon(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/salon/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerId: user?._id,
          name,
          address,
          phone,
          email: email || user?.email,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("salon", JSON.stringify(data.salon));
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Failed to create salon");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-6 shadow-lg">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Welcome to TrimSetGo! 🎉
          </h1>
          <p className="text-xl text-slate-600">
            Let's set up your salon in just a few steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <span className="ml-2 text-sm font-medium text-slate-900">Account Created</span>
            </div>
            <div className="w-16 h-1 bg-purple-600"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <span className="ml-2 text-sm font-medium text-slate-900">Salon Setup</span>
            </div>
            <div className="w-16 h-1 bg-slate-200"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-slate-400 font-bold">3</span>
              </div>
              <span className="ml-2 text-sm font-medium text-slate-400">Start Managing</span>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-10">
          {/* Welcome Message */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-1">
                  Hi {user?.name}! 👋
                </h3>
                <p className="text-sm text-purple-800">
                  Tell us about your salon so we can create your personalized booking page and dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Setup Form */}
          <form onSubmit={handleCreateSalon} className="space-y-6">
            {/* Salon Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                Salon Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Store className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g., Royal Cuts & Spa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                This will be displayed on your booking page
              </p>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-2">
                Salon Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="address"
                  type="text"
                  placeholder="e.g., 123 Main Street, Mumbai"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                Contact Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  placeholder="e.g., +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Business Email <span className="text-slate-400">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder={user?.email || "salon@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                We'll use {user?.email} if you don't provide a business email
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-purple-600 text-white font-semibold text-lg rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Your Salon...</span>
                </>
              ) : (
                <>
                  <span>Create My Salon</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* What Happens Next */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              What happens after you create your salon?
            </h3>
            <div className="space-y-3">
              {[
                'Your personalized booking website will be created instantly',
                'You can add services and start accepting bookings',
                'Customers can book appointments through your unique link',
                'Manage your queue and bookings from your dashboard',
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Need help?{" "}
          <a href="/support" className="font-semibold text-purple-600 hover:text-purple-700">
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
}