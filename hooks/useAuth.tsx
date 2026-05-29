"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "firebase/auth";
import {
  onAuthChange,
  signInWithGoogle,
  signOutUser,
} from "@/lib/firebase";
import { ensureUser } from "@/utils/api";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthChange(async (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        try {
          await ensureUser();
        } catch (e) {
          console.error("User sync failed", e);
        }
      }
    });
  }, []);

  const signIn = useCallback(async () => {
    await signInWithGoogle();
  }, []);

  const signOut = useCallback(async () => {
    await signOutUser();
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signOut }),
    [user, loading, signIn, signOut]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth requires AuthProvider");
  return ctx;
}
