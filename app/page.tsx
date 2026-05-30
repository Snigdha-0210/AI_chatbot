"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="glow-orb absolute -left-32 -top-32 h-96 w-96" />
        <div className="glow-orb absolute -right-48 top-1/3 h-[500px] w-[500px] opacity-60" />
        <div className="grid-bg absolute inset-0 opacity-30" />
      </div>

      <nav className="relative z-10 mx-auto flex h-16 max-w-container-max items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="material-symbols-outlined text-sm text-on-primary-container">
              school
            </span>
          </div>
          <span className="text-lg font-bold text-primary">CampusCopilot</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="hidden text-sm text-on-surface-variant hover:text-primary sm:block"
          >
            Sign in
          </button>
          <button
            onClick={() => router.push("/login")}
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-on-primary transition hover:opacity-90"
          >
            Get Started
          </button>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-container-max px-6 pb-24 pt-16 text-center lg:px-10 lg:pt-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface-container-high/80 px-4 py-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            AI career tools for students
          </span>
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          Your AI career copilot for{" "}
          <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
            jobs, skills, and resumes
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-on-surface-variant">
          Chat with a career coach, scan your resume for ATS compatibility, and
          prepare for interviews — built for college students.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log("=== NAV DEBUG ===");
              console.log("Button clicked: Get Started");
              console.log("Router defined:", !!router);
              try {
                router.push("/login");
                console.log("router.push('/login') executed successfully");
              } catch (err) {
                console.error("Router push failed:", err);
                console.log("Falling back to window.location");
                window.location.href = "/login";
              }
            }}
            className="rounded-xl bg-gradient-to-br from-primary to-primary-container px-8 py-4 font-semibold text-on-primary-container shadow-lg shadow-primary/25 transition hover:scale-[1.02]"
          >
            Get Started
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log("=== NAV DEBUG ===");
              console.log("Button clicked: Sign in with Google");
              console.log("Router defined:", !!router);
              try {
                router.push("/login");
                console.log("router.push('/login') executed successfully");
              } catch (err) {
                console.error("Router push failed:", err);
                console.log("Falling back to window.location");
                window.location.href = "/login";
              }
            }}
            className="rounded-xl border border-white/15 px-8 py-4 font-semibold text-on-surface transition hover:bg-white/5"
          >
            Sign in with Google
          </button>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-sm text-on-surface-variant">
        © {new Date().getFullYear()} CampusCopilot AI
      </footer>
    </div>
  );
}
