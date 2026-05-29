"use client";

import { ListSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AiResultDoc } from "@/types";

export function HistoryPanel({
  title,
  results,
  loading,
  error,
  selectedId,
  onSelect,
  emptyIcon,
  emptyTitle,
}: {
  title: string;
  results: AiResultDoc[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
  emptyIcon: string;
  emptyTitle: string;
}) {
  return (
    <aside className="glass-card flex max-h-[calc(100vh-12rem)] flex-col rounded-2xl p-4">
      <h2 className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">
        {title}
      </h2>
      {loading && (
        <div className="mt-4">
          <ListSkeleton rows={5} />
        </div>
      )}
      {error && <p className="mt-4 text-xs text-error">{error}</p>}
      {!loading && !error && results.length === 0 && (
        <div className="mt-4 flex-1">
          <EmptyState icon={emptyIcon} title={emptyTitle} />
        </div>
      )}
      <ul className="mt-3 flex-1 space-y-1 overflow-y-auto">
        {results.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => onSelect(r.id)}
              className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${
                selectedId === r.id
                  ? "bg-primary/15 text-primary"
                  : "text-on-surface-variant hover:bg-white/5"
              }`}
            >
              <span className="line-clamp-2 font-medium">{r.label}</span>
              {r.createdAt && (
                <span className="mt-0.5 block text-xs opacity-60">
                  {r.createdAt.toLocaleDateString()}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
