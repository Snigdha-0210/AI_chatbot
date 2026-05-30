"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithCustomToken,
  type User
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { auth, googleProvider, db } from "@/lib/firebase";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  signUpWithEmail: (e: string, p: string, name?: string) => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithOtpToken: (token: string) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (currentUser) {
        let customUser = {
          ...currentUser,
          emailVerified: currentUser.emailVerified,
        };

        if (currentUser.emailVerified) {
          setUser(customUser as User);
          setLoading(false);
        } else {
          // Listen to Firestore real-time for verification updates (bypass Admin SDK)
          unsubscribeSnapshot = onSnapshot(doc(db, "users", currentUser.uid), (userDoc) => {
            if (userDoc.exists() && userDoc.data().emailVerified) {
              Object.defineProperty(customUser, 'emailVerified', { value: true, writable: true });
            }
            // Trigger a re-render with the new object reference
            setUser({ ...customUser } as User);
            setLoading(false);
          });
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    
    // Create the user document in Firestore
    await setDoc(doc(db, "users", res.user.uid), {
      email: res.user.email,
      name: name || "",
      createdAt: serverTimestamp(),
    });
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signInWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    // Check if user doc exists, if not create it
    const userRef = doc(db, "users", res.user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: res.user.email,
        name: res.user.displayName || "",
        createdAt: serverTimestamp(),
      });
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const signInWithOtpToken = async (token: string) => {
    // In local dev, Firebase acts slightly differently, but signInWithCustomToken works as expected
    await signInWithCustomToken(auth, token);
  };

  const deleteUserAccount = async () => {
    if (auth.currentUser) {
      // Note: We don't necessarily delete the Firestore doc here since it's just a dangling unverified user doc,
      // but we MUST delete the Firebase Auth account to free up the email.
      await auth.currentUser.delete();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUpWithEmail,
        loginWithEmail,
        signInWithGoogle,
        resetPassword,
        logout,
        signInWithOtpToken,
        deleteUserAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth requires AuthProvider");
  return ctx;
}
