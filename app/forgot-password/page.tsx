"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok || data.success) {
        toast.success("Reset link sent!");
        setMessage(data.message || "If the account exists, a password reset email has been sent.");
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Network error. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
      <Toaster position="top-right" />
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-extrabold text-2xl">S</span>
            </div>
            <span className="text-3xl font-bold text-slate-900 tracking-tight">Innonsh Salonza</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Forgot Password?</h1>
          <p className="text-slate-500 font-medium">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-100 p-8 sm:p-10">
          {message ? (
            <div className="text-center py-6">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Check your email</h3>
              <p className="text-slate-600 font-medium mb-8 leading-relaxed">{message}</p>
              
              <Link
                href="/login"
                className="w-full flex items-center justify-center px-6 py-3.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-indigo-600/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Sending link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  Return to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
