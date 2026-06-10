"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter();
  const { token } = use(params);

  useEffect(() => {
    console.log("ResetPasswordPage initialized with token:", token);
  }, [token]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok || data.success) {
        setSuccess(true);
        toast.success("Password updated successfully");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
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
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Reset Password</h1>
          <p className="text-slate-500 font-medium">Enter your new secure password below.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-100 p-8 sm:p-10">
          {success ? (
            <div className="text-center py-6">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Password Reset</h3>
              <p className="text-slate-600 font-medium mb-8">Your password has been successfully updated.</p>
              <p className="text-sm text-slate-400 mb-6">Redirecting to login page in 3 seconds...</p>
              
              <Link
                href="/login"
                className="w-full flex items-center justify-center px-6 py-3.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
              >
                Go to login now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Enter again to confirm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="block w-full pl-11 pr-11 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder:font-normal focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
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
                    <span>Resetting password...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
