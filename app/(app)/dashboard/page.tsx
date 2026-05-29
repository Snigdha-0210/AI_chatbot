import { DashboardCards } from "@/components/dashboard/DashboardCards";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-container-max">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-on-surface-variant">
          Overview of your career tools and recent activity.
        </p>
      </header>
      <DashboardCards />
    </div>
  );
}
