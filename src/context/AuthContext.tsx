"use client";

import * as React from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

interface AuthContextType {
  user: User | { email: string; uid: string } | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isMock: boolean;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  isMock: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | { email: string; uid: string } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isMock, setIsMock] = React.useState(!isFirebaseConfigured);

  React.useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      // Check local storage for simulated session
      const savedMock = localStorage.getItem("acs_admin_mock_session");
      if (savedMock) {
        setUser({ email: savedMock, uid: "mock-admin-id" });
      }
      setIsMock(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsMock(false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!auth || !isFirebaseConfigured) {
      // Fallback mock credentials for initial testing
      if (email === "admin@acsconstruction.in" && pass === "admin123") {
        const mockUser = { email, uid: "mock-admin-id" };
        setUser(mockUser);
        localStorage.setItem("acs_admin_mock_session", email);
        return { success: true };
      }
      return { success: false, error: "Firebase not yet configured. Use demo credentials (admin@acsconstruction.in / admin123) or enter your Firebase keys in .env.local." };
    }

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return { success: true };
    } catch (err: unknown) {
      const error = err as { message?: string };
      return {
        success: false,
        error: error.message || "Invalid credentials. Please verify your email and password.",
      };
    }
  };

  const logout = async () => {
    if (!auth || !isFirebaseConfigured) {
      setUser(null);
      localStorage.removeItem("acs_admin_mock_session");
      return;
    }
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isMock }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
