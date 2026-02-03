// src/context/AuthContext.tsx
"use client";

import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: any | null;
  loading: boolean;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const getUser = async () => {
    try {
      const res = await axios.get("/api/v1/auth/user");
      const u = res.data.user;
      if (res.data.status === "success") {
        setUser(res.data.user);
      }
      if (
        !u.companyName ||
        !u.address ||
        !u.city ||
        !u.state ||
        !u.zipCode ||
        !u.inceptionDate ||
        !u.employeeCount
      ) {
        router.push("/profile/add-details");
      }
      if (u.role === "seller" && !u.gstNumber) {
        router.push("/profile/add-details");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh: getUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
