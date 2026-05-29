"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 lg:p-10">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
