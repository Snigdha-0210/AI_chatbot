"use client";

import { useState } from "react";
import { useAiResults } from "@/hooks/useAiResults";
import { useToast } from "@/components/ui/Toast";
import { postImproveBullet } from "@/utils/api";
import { HistoryPanel } from "@/components/tools/HistoryPanel";
import { CopyButton } from "@/components/ui/CopyButton";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import type { BulletContent } from "@/types";

export function ResumeBulletTool() {
  const { results, loading, error, refresh, getResult } = useAiResults("bullet");
  const toast = useToast();

  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [improving, setImproving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  async function improve() {
    if (!input.trim()) {
      toast.error("Enter a resume bullet first");
      return;
    }
    setImproving(true);
    setOutput(null);
    setSelectedId(null);
    try {
      const data = await postImproveBullet(input.trim());
      setOutput(data.output);
      toast.success("Bullet improved");
      await refresh();
      setSelectedId(data.resultId);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to improve");
    } finally {
      setImproving(false);
    }
  }

  async function loadHistory(id: string) {
    setLoadingDetail(true);
    try {
      const doc = await getResult(id);
      if (doc && doc.type === "bullet") {
        const c = doc.content as BulletContent;
        setInput(c.input);
        setOutput(c.output);
        setSelectedId(id);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load");
    } finally {
      setLoadingDetail(false);
    }
  }

  return (
    <div className="mx-auto max-w-container-max">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface">Resume Bullet Improver</h1>
        <p className="text-sm text-on-surface-variant">
          Turn weak bullets into strong, ATS-friendly statements
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <label className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">
              Your bullet
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
              placeholder='e.g. "made a chatbot in python"'
              className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-surface-container px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:outline-none"
            />
            <button
              type="button"
              onClick={improve}
              disabled={improving || !input.trim()}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary transition hover:opacity-90 disabled:opacity-50"
            >
              {improving && <Spinner className="h-4 w-4" />}
              {improving ? "Improving…" : "Improve"}
            </button>
          </div>

          {loadingDetail && (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          )}

          {!loadingDetail && output && (
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <p className="font-mono text-xs uppercase tracking-widest text-primary">
                  Improved bullet
                </p>
                <CopyButton text={output} />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-on-surface">{output}</p>
            </div>
          )}

          {!loadingDetail && !output && !improving && (
            <EmptyState
              icon="edit_note"
              title="No output yet"
              description="Enter a bullet and click Improve to see results."
            />
          )}
        </div>

        <HistoryPanel
          title="Past improvements"
          results={results}
          loading={loading}
          error={error}
          selectedId={selectedId}
          onSelect={loadHistory}
          emptyIcon="history"
          emptyTitle="No saved bullets yet"
        />
      </div>
    </div>
  );
}
