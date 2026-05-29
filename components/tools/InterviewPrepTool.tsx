"use client";

import { useState } from "react";
import { useAiResults } from "@/hooks/useAiResults";
import { useToast } from "@/components/ui/Toast";
import { postInterview } from "@/utils/api";
import { HistoryPanel } from "@/components/tools/HistoryPanel";
import { CopyButton } from "@/components/ui/CopyButton";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import type { InterviewContent } from "@/types";

const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export function InterviewPrepTool() {
  const { results, loading, error, refresh, getResult } =
    useAiResults("interview");
  const toast = useToast();

  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [interview, setInterview] = useState<InterviewContent | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  async function generate(more = false) {
    if (!role.trim()) {
      toast.error("Enter a role");
      return;
    }
    setGenerating(true);
    if (!more) {
      setInterview(null);
      setResultId(null);
      setSelectedId(null);
    }
    try {
      const data = await postInterview({
        role: role.trim(),
        difficulty,
        existing: more && interview ? interview : undefined,
        resultId: more && resultId ? resultId : undefined,
      });
      setInterview({
        role: data.role,
        difficulty: data.difficulty,
        technical: data.technical,
        behavioral: data.behavioral,
      });
      setResultId(data.resultId);
      setSelectedId(data.resultId);
      toast.success(more ? "More questions added" : "Questions generated");
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
      if (doc && doc.type === "interview") {
        const c = doc.content as InterviewContent;
        setInterview(c);
        setRole(c.role);
        setDifficulty(c.difficulty);
        setResultId(id);
        setSelectedId(id);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load");
    } finally {
      setLoadingDetail(false);
    }
  }

  const copyAll = interview
    ? [
        `Interview prep: ${interview.role} (${interview.difficulty})`,
        "",
        "Technical:",
        ...interview.technical.map((q, i) => `${i + 1}. ${q}`),
        "",
        "Behavioral:",
        ...interview.behavioral.map((q, i) => `${i + 1}. ${q}`),
      ].join("\n")
    : "";

  return (
    <div className="mx-auto max-w-container-max">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface">Interview Prep</h1>
        <p className="text-sm text-on-surface-variant">
          Technical and behavioral questions for your target role
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="glass-card grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
            <div>
              <label className="font-mono text-xs uppercase text-on-surface-variant">
                Role
              </label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Software engineer intern"
                className="mt-2 w-full rounded-xl border border-white/10 bg-surface-container px-4 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-mono text-xs uppercase text-on-surface-variant">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-surface-container px-4 py-2.5 text-sm focus:border-primary/50 focus:outline-none"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button
                type="button"
                onClick={() => generate(false)}
                disabled={generating || !role.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary disabled:opacity-50"
              >
                {generating && !interview && <Spinner className="h-4 w-4" />}
                Generate questions
              </button>
              {interview && (
                <button
                  type="button"
                  onClick={() => generate(true)}
                  disabled={generating}
                  className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium text-on-surface transition hover:bg-white/5 disabled:opacity-50"
                >
                  {generating ? "Adding…" : "Generate more"}
                </button>
              )}
            </div>
          </div>

          {loadingDetail && (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          )}

          {!loadingDetail && interview && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <CopyButton text={copyAll} label="Copy all" />
              </div>
              <QuestionCard
                title="Technical questions"
                icon="code"
                questions={interview.technical}
              />
              <QuestionCard
                title="Behavioral / HR questions"
                icon="groups"
                questions={interview.behavioral}
              />
            </div>
          )}

          {!loadingDetail && !interview && !generating && (
            <EmptyState
              icon="record_voice_over"
              title="No questions yet"
              description="Pick a role and difficulty to generate practice questions."
            />
          )}
        </div>

        <HistoryPanel
          title="Past question sets"
          results={results}
          loading={loading}
          error={error}
          selectedId={selectedId}
          onSelect={loadHistory}
          emptyIcon="quiz"
          emptyTitle="No saved sets yet"
        />
      </div>
    </div>
  );
}

function QuestionCard({
  title,
  icon,
  questions,
}: {
  title: string;
  icon: string;
  questions: string[];
}) {
  if (!questions.length) return null;
  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-on-surface-variant">
        <span className="material-symbols-outlined text-tertiary">{icon}</span>
        {title}
      </h2>
      <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-on-surface-variant">
        {questions.map((q, i) => (
          <li key={i} className="leading-relaxed text-on-surface">
            {q}
          </li>
        ))}
      </ol>
    </div>
  );
}
