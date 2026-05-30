"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useChats } from "@/hooks/useChats";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function ChatSidebar() {
  const pathname = usePathname();
  const { chats, loading, error } = useChats();
  const [open, setOpen] = useState(false);

  const activeId =
    pathname.startsWith("/chat/") && pathname !== "/chat"
      ? pathname.split("/chat/")[1]?.split("/")[0]
      : pathname === "/chat"
        ? null
        : null;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-surface-container px-3 text-xs font-medium text-on-surface-variant transition hover:border-primary/30 hover:text-primary lg:hidden"
      >
        <span className="material-symbols-outlined text-base">
          {open ? "chevron_left" : "history"}
        </span>
        {open ? "Hide history" : "Chat history"}
      </button>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-white/10 bg-surface-deep/95 backdrop-blur-md transition-transform duration-300 lg:static lg:inset-auto lg:z-auto lg:w-64 lg:translate-x-0 lg:bg-surface-deep/80 lg:backdrop-blur-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <Link
            href="/chat"
            onClick={() => setOpen(false)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition hover:opacity-90"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New chat
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="ml-3 flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-white/10 lg:hidden"
            aria-label="Close chat history"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <p className="px-2 py-2 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
            History
          </p>

          {loading && (
            <div className="px-2">
              <ListSkeleton rows={5} />
            </div>
          )}

          {error && (
            <p className="px-3 py-2 text-xs text-error">{error}</p>
          )}

          {!loading && !error && chats.length === 0 && (
            <EmptyState
              icon="forum"
              title="No chats yet"
              description="Start a conversation with your career coach."
            />
          )}

          <ul className="space-y-0.5">
            {chats.map((chat) => {
              const selected = activeId === chat.id;
              return (
                <li key={chat.id}>
                  <Link
                    href={`/chat/${chat.id}`}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm transition ${
                      selected
                        ? "bg-primary/15 text-primary"
                        : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
                    }`}
                  >
                    <span className="line-clamp-2 font-medium">{chat.title}</span>
                    {chat.updatedAt && (
                      <span className="mt-0.5 block text-[10px] opacity-60">
                        {formatRelative(chat.updatedAt)}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
}

function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
