"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        {/* Mobile top bar */}
        <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-white/5 bg-surface-deep/95 px-4 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-white/10 hover:text-on-surface"
            aria-label="Open sidebar"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <span className="material-symbols-outlined text-xs text-on-primary-container">
                school
              </span>
            </div>
            <span className="text-sm font-bold text-primary">CampusCopilot</span>
          </div>
        </header>

        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content: add top padding on mobile for the fixed header */}
        <main className="flex-1 overflow-y-auto p-6 pt-20 lg:p-8 lg:pt-8 xl:p-10 xl:pt-10">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
