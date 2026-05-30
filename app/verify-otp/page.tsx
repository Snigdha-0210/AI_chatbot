"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Spinner";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function VerifyOtpPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    } else if (!loading && user?.emailVerified) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = async (isResend = false) => {
    if (!user?.email) return;
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to send OTP");
      
      setMessage("Verification code sent to your email!");
      if (isResend) {
        setResendTimer(60);
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Removed the auto-send effect since the login page already sent it.

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6 || !user?.email) return;

    setError("");
    setMessage("");
    setVerifying(true);
    
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, otp: code }),
      });
      const data = await res.json();
      
      if (!data.success) throw new Error(data.error || "Invalid OTP");
      
      setMessage("OTP Verified! Redirecting to dashboard...");
      
      // Reload Firebase user to pull down any updated native claims
      if (auth.currentUser) {
        await auth.currentUser.reload();
      }

      // Bypass Admin SDK Requirement: Mark as verified directly in Firestore
      if (user.uid) {
        await setDoc(doc(db, "users", user.uid), { emailVerified: true }, { merge: true });
      }
      
      // Force Next.js router to refresh and redirect
      router.refresh();
      setTimeout(() => router.replace("/dashboard"), 500);

    } catch (err: any) {
      setError(err.message);
      setVerifying(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pastedData = value.replace(/\D/g, "").slice(0, 6).split("");
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(index + pastedData.length, 5);
      otpRefs.current[nextFocus]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    } else if (value && index === 5) {
      const completeCode = [...newOtp.slice(0, 5), value].join("");
      if (completeCode.length === 6) {
         setTimeout(() => handleVerifyOtp(), 50);
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 bg-background">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface-card/80 p-10 backdrop-blur-xl">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <span className="material-symbols-outlined text-on-primary-container">
            mark_email_read
          </span>
        </div>
        <h1 className="text-center text-2xl font-bold text-on-surface">Verify your email</h1>
        <p className="mt-2 text-center text-sm text-on-surface-variant">
          We've sent a 6-digit verification code to <strong>{user.email}</strong>
        </p>

        {error && <div className="mt-6 rounded-lg bg-red-500/20 p-3 text-sm text-red-200 text-center">{error}</div>}
        {message && <div className="mt-6 rounded-lg bg-green-500/20 p-3 text-sm text-green-200 text-center">{message}</div>}

        {verifying ? (
          <div className="my-10 flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-6">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { otpRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  disabled={verifying}
                  className="w-12 h-14 rounded-xl border border-white/10 bg-surface-container text-center text-xl font-bold text-on-surface focus:border-primary focus:outline-none transition-all disabled:opacity-50"
                />
              ))}
            </div>
            
            <button
              onClick={() => handleVerifyOtp()}
              disabled={otp.join("").length !== 6 || verifying}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-on-primary transition hover:opacity-90 disabled:opacity-50"
            >
              Verify Code
            </button>

            <div className="text-center text-sm mt-2">
              {resendTimer > 0 ? (
                <span className="text-on-surface-variant">Resend code in {resendTimer}s</span>
              ) : (
                <button onClick={() => handleSendOtp(true)} className="text-primary hover:underline font-medium">
                  Resend Code
                </button>
              )}
            </div>

            <div className="text-center mt-4">
              <button 
                onClick={async () => {
                  await logout();
                  router.replace("/login");
                }} 
                className="text-xs text-on-surface-variant hover:text-white transition"
              >
                Use a different account (Sign Out)
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
