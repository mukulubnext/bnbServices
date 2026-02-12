// Provides global context for user authentication
// Is used to check if user is logged in or not and user the user data if logged in

"use client";

import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: any | null;           // user object
  loading: boolean;           // loading state
  refresh: () => void;        // function to refetch user data
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // States
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Functions
  const getUser = async () => {               // Fetches user data and stores in user state and also updates loading state
    try {
      const res = await axios.get("/api/v1/auth/user");
      const u = res.data.user;
      if (res.data.status === "success") {
        setUser(res.data.user);
      }
      if (                                              // Checks if user has filled all details
        !u.role ||
        !u.email ||       
        !u.companyName ||
        !u.address ||
        !u.city ||
        !u.state ||
        !u.zipCode ||
        !u.inceptionDate ||
        !u.employeeCount
      ) {
        router.push("/profile/add-details");            // If not, redirects to add details page
        return;
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {       // Calls getUser function on first render
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
