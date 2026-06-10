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
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/40 to-transparent"></div>
        
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-white/20 shadow-xl overflow-hidden p-1">
              <img src="/salon_logo.png" alt="Innonsh Salonza Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-3xl font-bold tracking-tight">Innonsh Salonza</span>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            The Complete Salon <br/><span className="text-purple-400">Operating System</span>
          </h1>
          
          <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-md">
            Manage bookings, staff, inventory, marketing, payments and customer relationships from one platform.
          </p>
          
          <div className="space-y-4">
            {[
              "Booking Management",
              "Staff Management",
              "Revenue Analytics",
              "Customer Engagement"
            ].map((feature, i) => (
              <div key={i} className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 w-fit transform transition-transform hover:translate-x-2">
                <CheckCircle2 className="text-purple-400 h-6 w-6" />
                <span className="font-medium text-slate-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center space-x-3 mb-10 justify-center">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden p-1">
              <img src="/salon_logo.png" alt="Innonsh Salonza Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Innonsh Salonza</span>
          </div>

          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 font-medium">Please enter your details to sign in</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-100/50 border border-white p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-11 pr-3 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder:font-normal focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-11 pr-11 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder:font-normal focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-slate-600 cursor-pointer">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-indigo-600/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center space-x-1"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Return to home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}