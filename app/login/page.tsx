"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Spinner";

export default function LoginPage() {
  const { user, loading, loginWithEmail, signUpWithEmail, signInWithGoogle, resetPassword, deleteUserAccount } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register" | "forgot_password">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && user) {
      if (user.emailVerified) {
        router.replace("/dashboard");
      }
      // If not verified, we do NOT auto-redirect to /verify-otp here anymore
      // We want them to click "Send OTP" to trigger the email explicitly.
      // Wait, if they refresh the page, they are authenticated but not verified.
      // We can just log them out so they have to login again.
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await loginWithEmail(email, password);

      // Wait a moment for onAuthStateChanged to populate `user` 
      // If they are verified, the useEffect at the top will redirect them to /dashboard automatically!
      // But if we know we need to send an OTP (e.g. they are unverified), we can do it here.
      // A better way is to just let the onAuthStateChanged handle the verified check.
      // If we don't redirect in the useEffect, they stay here.

      // We will check Firebase's native emailVerified right after login.
      // If it's true, we do nothing (useEffect redirects).
      // If it's false, we check Firestore. If still false, THEN we send OTP.
      const { auth, db } = await import("@/lib/firebase");
      const { doc, getDoc } = await import("firebase/firestore");

      if (auth.currentUser) {
        let isVerified = auth.currentUser.emailVerified;
        if (!isVerified) {
          const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
          if (userDoc.exists() && userDoc.data().emailVerified) {
            isVerified = true;
          }
        }

        if (!isVerified) {
          // Send OTP because they are not verified
          const res = await fetch("/api/auth/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.error || "Failed to send OTP email.");

          router.replace("/verify-otp");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await signUpWithEmail(email, password, name);

      // After account creation, attempt to send OTP
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) {
        await deleteUserAccount();
        throw new Error(data.error || "Failed to send OTP email. Account creation rolled back.");
      }

      router.replace("/verify-otp");
    } catch (err: any) {
      setError(err.message || "Failed to register");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    try {
      await resetPassword(email);
      setMessage("Password reset email sent.");
      setMode("login");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await signInWithGoogle();
      // Google auto-verifies email, so they will go to /dashboard
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface-card/80 p-10 backdrop-blur-xl">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <span className="material-symbols-outlined text-on-primary-container">
            school
          </span>
        </div>
        <h1 className="text-center text-2xl font-bold">Welcome to CampusCopilot</h1>
        <p className="mt-2 text-center text-sm text-on-surface-variant">
          {mode === "forgot_password" ? "Reset your password." : "Sign in to access your dashboard."}
        </p>

        {mode !== "forgot_password" && (
          <div className="mt-6 flex overflow-hidden rounded-lg border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              className={`w-1/2 rounded-md py-2 text-sm font-semibold transition ${mode === "login" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-white"
                }`}
              onClick={() => { setMode("login"); setError(""); setMessage(""); }}
            >
              Login
            </button>
            <button
              type="button"
              className={`w-1/2 rounded-md py-2 text-sm font-semibold transition ${mode === "register" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-white"
                }`}
              onClick={() => { setMode("register"); setError(""); setMessage(""); }}
            >
              Register
            </button>
          </div>
        )}

        {error && <div className="mt-4 rounded-lg bg-red-500/20 p-3 text-sm text-red-200">{error}</div>}
        {message && <div className="mt-4 rounded-lg bg-green-500/20 p-3 text-sm text-green-200">{message}</div>}

        <form
          onSubmit={mode === "login" ? handleLogin : mode === "register" ? handleRegister : handleForgotPassword}
          className="mt-6 flex flex-col gap-4"
        >
          {mode === "register" && (
            <input
              type="text"
              placeholder="Name (Optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-surface-container p-3 text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-surface-container p-3 text-sm text-on-surface focus:border-primary focus:outline-none"
            required
          />
          {mode !== "forgot_password" && (
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-surface-container p-3 text-sm text-on-surface focus:border-primary focus:outline-none"
                required
              />
              {mode === "login" && (
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => setMode("forgot_password")}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>
          )}
          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-on-primary transition hover:opacity-90"
          >
            {mode === "login" ? "Login" : mode === "register" ? "Register & Send OTP" : "Send Reset Email"}
          </button>

          {mode === "forgot_password" && (
            <button
              type="button"
              onClick={() => setMode("login")}
              className="mt-2 text-sm text-on-surface-variant hover:text-primary transition"
            >
              Back to Login
            </button>
          )}
        </form>

        {mode !== "forgot_password" && (
          <>
            <div className="relative mt-8 flex items-center justify-center">
              <span className="absolute bg-surface-card px-2 text-xs text-on-surface-variant">OR</span>
              <div className="h-px w-full bg-white/10"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </>
        )}

        <div className="mt-6 text-center flex flex-col items-center gap-2">
          <Link href="/" className="inline-block text-sm text-on-surface-variant hover:text-primary transition-colors">
            ← Back to home
          </Link>
          <div className="mt-4 text-xs font-medium text-on-surface-variant/50 uppercase tracking-widest">
            Made <span className="text-red-500"> </span> by Snigdha
          </div>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
