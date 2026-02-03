"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Loader2, CheckCircle2, Truck } from "lucide-react";

export default function RegisterPage() {
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("salon_owner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      setError(data.message || "Registration failed. Please try again.");
      return;
    }

    // auto login user after registration
    login(data.user, data.token, data.salon);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold text-slate-900">TrimSetGo</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
          <p className="text-slate-600">Start your 14-day free trial, no credit card required</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Role Selection */}
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => setRole("salon_owner")}
                className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'salon_owner' ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-slate-100 hover:border-slate-200 text-slate-400'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role === 'salon_owner' ? 'bg-purple-600 text-white' : 'bg-slate-100'}`}>
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest leading-none">Salon Owner</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("supplier")}
                className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'supplier' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 hover:border-slate-200 text-slate-400'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role === 'supplier' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>
                  <Truck className="w-6 h-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest leading-none">Supplier</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Full Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">Must be at least 6 characters</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Features */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-600 font-semibold mb-3">What you'll get:</p>
            <div className="space-y-2">
              {[
                "14-day free trial",
                "No credit card required",
                "Full access to all features",
                "Cancel anytime",
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-700 transition-colors">
            Sign in
          </Link>
        </p>

        {/* Terms */}
        <p className="mt-6 text-center text-xs text-slate-500">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-slate-700">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-slate-700">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}