"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ToastType = "success" | "error";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
  exiting: boolean;
};

type ToastCtx = {
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    // Mark as exiting first (triggers exit animation)
    setToasts((t) => t.map((x) => (x.id === id ? { ...x, exiting: true } : x)));
    // Remove after animation completes
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 250);
  }, []);

  const push = useCallback(
    (message: string, type: ToastType) => {
      const id = Date.now();
      setToasts((t) => [...t, { id, message, type, exiting: false }]);
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      success: (message: string) => push(message, "success"),
      error: (message: string) => push(message, "error"),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => dismiss(t.id)}
            className={`pointer-events-auto cursor-pointer rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-md ${
              t.exiting ? "toast-exit" : "toast-enter"
            } ${
              t.type === "success"
                ? "border-primary/30 bg-surface-card/95 text-on-surface"
                : "border-error/40 bg-error/10 text-error"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">
                {t.type === "success" ? "check_circle" : "error"}
              </span>
              {t.message}
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast requires ToastProvider");
  return ctx;
}
