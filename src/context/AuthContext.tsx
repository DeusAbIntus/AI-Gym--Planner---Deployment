import { authClient } from "../lib/auth";
import type { User } from "../types";
import { createContext, useEffect, useState, useContext } from "react";

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [neonUser, setNeonUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await authClient.getSession();

        if (res && res.data?.user) {
          setNeonUser(res.data.user);
        } else {
          setNeonUser(null);
        }
      } catch (error) {
        setNeonUser(null);
      }
    }
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user: neonUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
