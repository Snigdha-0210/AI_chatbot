"use client";

import { useState } from "react";
import { useAiResults } from "@/hooks/useAiResults";
import { useToast } from "@/components/ui/Toast";
import { postRoadmap } from "@/utils/api";
import { HistoryPanel } from "@/components/tools/HistoryPanel";
import { CopyButton } from "@/components/ui/CopyButton";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import type { RoadmapContent } from "@/types";

export function RoadmapTool() {
  const { results, loading, error, refresh, getResult } = useAiResults("roadmap");
  const toast = useToast();

  const [role, setRole] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [roadmap, setRoadmap] = useState<RoadmapContent | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  async function generate() {
    if (!role.trim()) {
      toast.error("Enter a target role");
      return;
    }
    setGenerating(true);
    setRoadmap(null);
    setSelectedId(null);
    try {
      const data = await postRoadmap(role.trim(), timeframe.trim() || undefined);
      const { resultId, ...content } = data;
      setRoadmap(content);
      setSelectedId(resultId);
      toast.success("Roadmap generated");
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setGenerating(false);
    }
  }

  async function loadHistory(id: string) {
    setLoadingDetail(true);
    try {
      const doc = await getResult(id);
      if (doc && doc.type === "roadmap") {
        setRoadmap(doc.content as RoadmapContent);
        setRole((doc.content as RoadmapContent).role);
        setTimeframe((doc.content as RoadmapContent).timeframe ?? "");
        setSelectedId(id);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load");
    } finally {
      setLoadingDetail(false);
    }
  }

  const shareText = roadmap
    ? [
        `Roadmap: ${roadmap.role}`,
        roadmap.timeframe ? `Timeframe: ${roadmap.timeframe}` : "",
        "",
        "Skills:",
        ...roadmap.skills.map((s) => `• ${s}`),
        "",
        "Tools:",
        ...roadmap.tools.map((t) => `• ${t}`),
      ].join("\n")
    : "";

  return (
    <div className="mx-auto max-w-container-max">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface">Skill Roadmap</h1>
        <p className="text-sm text-on-surface-variant">
          Step-by-step path to your dream role
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="glass-card grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
            <div>
              <label className="font-mono text-xs uppercase text-on-surface-variant">
                Target role
              </label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend developer"
                className="mt-2 w-full rounded-xl border border-white/10 bg-surface-container px-4 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-mono text-xs uppercase text-on-surface-variant">
                Timeframe (optional)
              </label>
              <input
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                placeholder="e.g. 6 months"
                className="mt-2 w-full rounded-xl border border-white/10 bg-surface-container px-4 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={generate}
                disabled={generating || !role.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary disabled:opacity-50"
              >
                {generating && <Spinner className="h-4 w-4" />}
                {generating ? "Generating…" : "Generate roadmap"}
              </button>
            </div>
          </div>

          {loadingDetail && (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          )}

          {!loadingDetail && roadmap && (
            <RoadmapView roadmap={roadmap} shareText={shareText} />
          )}

          {!loadingDetail && !roadmap && !generating && (
            <EmptyState
              icon="map"
              title="No roadmap yet"
              description="Enter a role and generate your personalized learning path."
            />
          )}
        </div>

        <HistoryPanel
          title="Past roadmaps"
          results={results}
          loading={loading}
          error={error}
          selectedId={selectedId}
          onSelect={loadHistory}
          emptyIcon="folder_open"
          emptyTitle="No saved roadmaps yet"
        />
      </div>
    </div>
  );
}

function RoadmapView({
  roadmap,
  shareText,
}: {
  roadmap: RoadmapContent;
  shareText: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CopyButton text={shareText} label="Copy roadmap" />
      </div>
      <SectionCard title="Skills to learn" items={roadmap.skills} icon="school" />
      <SectionCard title="Tools" items={roadmap.tools} icon="build" />
      <SectionCard title="Projects" items={roadmap.projects} icon="rocket_launch" />
      {roadmap.timeline.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-on-surface-variant">
            <span className="material-symbols-outlined text-primary">timeline</span>
            Timeline
          </h2>
          <ol className="mt-4 space-y-4">
            {roadmap.timeline.map((phase, i) => (
              <li
                key={i}
                className="border-l-2 border-primary/30 pl-4"
              >
                <p className="font-medium text-on-surface">{phase.phase}</p>
                <p className="text-xs text-primary">{phase.duration}</p>
                <p className="mt-1 text-sm text-on-surface-variant">{phase.focus}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function SectionCard({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: string;
}) {
  if (!items.length) return null;
  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-on-surface-variant">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        {title}
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="rounded-full border border-white/10 bg-surface-container px-3 py-1 text-sm text-on-surface"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
