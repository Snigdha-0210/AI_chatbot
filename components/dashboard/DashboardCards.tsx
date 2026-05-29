"use client";

import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function DashboardCards() {
  const { stats, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <p className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <ScoreCard score={stats.latestAtsScore} />
        <ChatCountCard count={stats.chatCount} />
        <QuickActionsCard />
      </div>

      <section>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-on-surface-variant">
          Recent activity
        </h2>
        {stats.recentActivity.length === 0 ? (
          <div className="glass-card rounded-2xl">
            <EmptyState
              icon="history"
              title="No activity yet"
              description="Start a chat or scan a resume to see activity here."
              action={
                <Link
                  href="/chat"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Open career chat →
                </Link>
              }
            />
          </div>
        ) : (
          <ul className="glass-card divide-y divide-white/5 rounded-2xl overflow-hidden">
            {stats.recentActivity.map((item) => (
              <li key={`${item.type}-${item.id}`}>
                <Link
                  href={
                    item.type === "chat"
                      ? `/chat/${item.id}`
                      : `/ats`
                  }
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-white/5"
                >
                  <span className="material-symbols-outlined text-primary">
                    {item.type === "chat" ? "forum" : "description"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-on-surface">
                      {item.title}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {item.type === "chat"
                        ? "Career chat"
                        : `ATS score: ${item.score}`}
                      {" · "}
                      {item.at.toLocaleDateString()}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">
                    chevron_right
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ScoreCard({ score }: { score: number | null }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">
        Latest ATS score
      </p>
      <p className="mt-3 bg-gradient-to-r from-primary to-primary-container bg-clip-text text-5xl font-bold text-transparent">
        {score !== null ? score : "—"}
      </p>
      <Link
        href="/ats"
        className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
      >
        Scan resume →
      </Link>
    </div>
  );
}

function ChatCountCard({ count }: { count: number }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">
        Total chats
      </p>
      <p className="mt-3 text-5xl font-bold text-tertiary">{count}</p>
      <Link
        href="/chat"
        className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
      >
        Open chat →
      </Link>
    </div>
  );
}

function QuickActionsCard() {
  const actions = [
    { href: "/chat", label: "New career chat", icon: "add_comment" },
    { href: "/resume-tools", label: "Improve bullet", icon: "edit_note" },
    { href: "/roadmap", label: "Skill roadmap", icon: "map" },
    { href: "/interview-prep", label: "Interview prep", icon: "record_voice_over" },
    { href: "/ats", label: "Scan resume", icon: "upload_file" },
  ];

  return (
    <div className="glass-card rounded-2xl p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">
        Quick actions
      </p>
      <ul className="mt-4 space-y-2">
        {actions.map((a) => (
          <li key={a.href}>
            <Link
              href={a.href}
              className="flex items-center gap-3 rounded-xl border border-white/5 px-3 py-2.5 text-sm transition hover:border-primary/30 hover:bg-primary/5"
            >
              <span className="material-symbols-outlined text-primary">
                {a.icon}
              </span>
              {a.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
