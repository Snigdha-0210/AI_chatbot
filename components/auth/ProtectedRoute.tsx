"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Spinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log("ProtectedRoute -> User:", user);
  console.log("ProtectedRoute -> Loading:", loading);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (!user.emailVerified) {
        router.replace("/verify-otp");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  if (!user || !user.emailVerified) return null;
  return <>{children}</>;
}
