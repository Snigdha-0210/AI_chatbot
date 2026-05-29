"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: "grid_view" },
  { href: "/chat", label: "Career Chat", icon: "forum" },
  { href: "/ats", label: "ATS Scanner", icon: "description" },
];

const toolsNav = [
  { href: "/resume-tools", label: "Resume Tools", icon: "edit_note" },
  { href: "/roadmap", label: "Roadmap", icon: "map" },
  { href: "/interview-prep", label: "Interview Prep", icon: "record_voice_over" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  function isActive(href: string) {
    return (
      pathname === href ||
      (href !== "/dashboard" && pathname.startsWith(href))
    );
  }

  return (
    <aside className="flex h-screen w-[280px] shrink-0 flex-col border-r border-white/5 bg-surface-deep px-6 py-8">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="material-symbols-outlined text-sm text-on-primary-container">
            school
          </span>
        </div>
        <span className="text-lg font-bold text-primary">CampusCopilot</span>
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-6 overflow-y-auto">
        <div>
          <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/70">
            Main
          </p>
          <div className="flex flex-col gap-0.5">
            {mainNav.map((item) => (
              <NavLink key={item.href} item={item} active={isActive(item.href)} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/70">
            AI Toolkit
          </p>
          <div className="flex flex-col gap-0.5">
            {toolsNav.map((item) => (
              <NavLink key={item.href} item={item} active={isActive(item.href)} />
            ))}
          </div>
        </div>
      </nav>

      <div className="border-t border-white/5 pt-6">
        {user?.email && (
          <p className="mb-3 truncate text-xs text-on-surface-variant">
            {user.displayName ?? user.email}
          </p>
        )}
        <button
          type="button"
          onClick={() => signOut()}
          className="w-full rounded-xl border border-white/10 px-3 py-2 text-sm text-on-surface-variant transition hover:border-primary/30 hover:text-primary"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

function NavLink({
  item,
  active,
}: {
  item: { href: string; label: string; icon: string };
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? "border-l-2 border-primary bg-primary/10 text-primary"
          : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
      }`}
    >
      <span className="material-symbols-outlined text-xl">{item.icon}</span>
      {item.label}
    </Link>
  );
}
