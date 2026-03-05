"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Role = {
  id: string;
  name: string;
};

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: string[];
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  refetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refetchUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/me");
      if (!res.ok) {
        setUser(null);
      } else {
        const data = await res.json();
        setUser(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refetchUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
