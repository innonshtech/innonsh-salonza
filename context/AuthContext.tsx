"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load from localStorage on refresh
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (user: any, token: string, salon: any) => {

    console.log("Logging in user:", user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    if (salon) {
      localStorage.setItem("salon", JSON.stringify(salon));
    }
    setUser(user);
    setToken(token);

    if (user.role === "super_admin") {
      router.push("/super-admin-dashboard");
    } else if (user.role === "supplier") {
      router.push("/supplier-dashboard");
    } else {
      router.push("/dashboard");
    }
  };


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
