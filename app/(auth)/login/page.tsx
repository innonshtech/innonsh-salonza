"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (!data.success) {
        toast.error(data.message || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      toast.success("Login successful!");
      login(data.user, data.token, data.salon);
    } catch (error) {
      toast.error("An unexpected error occurred.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50 ">
      <Toaster position="top-right" />
      
      {/* LEFT SIDE: Hero Section */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white overflow-hidden items-center justify-center p-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/40 to-transparent"></div>
        
        <div className="relative z-10 max-w-md">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-white/20 shadow-lg overflow-hidden p-1">
              <img src="/salon_logo.png" alt="Innonsh Salonza Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Innonsh Salonza</span>
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight mb-5 leading-tight">
            The Complete Salon <br/><span className="text-purple-400">Operating System</span>
          </h1>
          
          <p className="text-base text-slate-300 mb-8 leading-relaxed max-w-sm">
            Manage bookings, staff, inventory, marketing, payments and customer relationships from one platform.
          </p>
          
          <div className="space-y-3">
            {[
              "Booking Management",
              "Staff Management",
              "Revenue Analytics",
              "Customer Engagement"
            ].map((feature, i) => (
              <div key={i} className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10 w-fit transform transition-transform hover:translate-x-1">
                <CheckCircle2 className="text-purple-400 h-5 w-5" />
                <span className="font-medium text-sm text-slate-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Card */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-8 lg:p-12 relative">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center space-x-2 mb-8 justify-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow overflow-hidden p-1">
              <img src="/salon_logo.png" alt="Innonsh Salonza Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Innonsh Salonza</span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Welcome back</h2>
            <p className="text-sm text-slate-500 font-medium">Please enter your details to sign in</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-lg border border-slate-100 p-6">
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-2">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-9 pr-3 h-10 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium placeholder:font-normal focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-9 pr-9 h-10 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium placeholder:font-normal focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-slate-600 cursor-pointer">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-4 h-10 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center space-x-1"
            >
              <ArrowRight className="w-3 h-3 rotate-180" />
              <span>Return to home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}