"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch fresh user data from backend
  const checkAuth = useCallback(async () => {
    // Attempt HTTP-only cookie authentication automatically
    try {
      const res = await fetch("/api/auth/me");
      
      if (!res.ok) {
        // 401 or 403 means no valid cookie
        setLoading(false);
        return;
      }
      
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        // Sync with local storage just for UI persistence (non-critical)
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        // Token might be invalid or expired
        logout();
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial authentication check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = (userData: any, token: string, salon: any) => {
    // Token is stored securely in HTTP-only cookie by backend
    localStorage.setItem("user", JSON.stringify(userData));
    if (salon) {
      localStorage.setItem("salon", JSON.stringify(salon));
    }
    setUser(userData);
    setToken(token); // keeping in state just in case, though cookie is source of truth

    if (userData.role === "super_admin") {
      router.push("/super-admin-dashboard");
    } else if (userData.role === "supplier") {
      router.push("/supplier-dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("token"); // Cleanup legacy tokens
    localStorage.removeItem("user");
    localStorage.removeItem("salon");
    setUser(null);
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, checkAuth }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

