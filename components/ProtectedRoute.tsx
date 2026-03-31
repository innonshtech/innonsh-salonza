"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Higher-order component to protect frontend routes.
 * It ensures the user is authenticated and has the correct role.
 * 
 * Usage:
 * <ProtectedRoute allowedRoles={["super_admin"]}>
 *   <AdminDashboard />
 * </ProtectedRoute>
 */
export default function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode, 
  allowedRoles?: string[] 
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // 1. If no user, redirect to login
      if (!user) {
        router.push("/login");
        return;
      }

      // 2. If roles are restricted, check user's actual role from backend (provided by useAuth)
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push("/unauthorized"); // or any other safe route
      }
    }
  }, [user, loading, allowedRoles, router]);

  // Show a loading spinner while checking auth state from server
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-lg font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  // Only render children if user exists AND role is allowed
  if (user && (!allowedRoles || allowedRoles.includes(user.role))) {
    return <>{children}</>;
  }

  return null;
}
