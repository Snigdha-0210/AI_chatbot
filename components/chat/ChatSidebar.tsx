"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useChats } from "@/hooks/useChats";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function ChatSidebar() {
  const pathname = usePathname();
  const { chats, loading, error } = useChats();

  const activeId =
    pathname.startsWith("/chat/") && pathname !== "/chat"
      ? pathname.split("/chat/")[1]?.split("/")[0]
      : pathname === "/chat"
        ? null
        : null;

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-surface-deep/80">
      <div className="border-b border-white/10 p-4">
        <Link
          href="/chat"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition hover:opacity-90"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New chat
        </Link>
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
