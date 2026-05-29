"use client";

import { useState } from "react";
import { useResumes } from "@/hooks/useResumes";
import { useToast } from "@/components/ui/Toast";
import { postAts } from "@/utils/api";
import { ATSResultView } from "@/components/ats/ATSResultView";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AtsAnalysis, ResumeDoc } from "@/types";

export function ATSScanner() {
  const { resumes, loading, error, refresh, getResume } = useResumes();
  const toast = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [selected, setSelected] = useState<ResumeDoc | null>(null);
  const [freshResult, setFreshResult] = useState<
    (AtsAnalysis & { resumeId: string }) | null
  >(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  async function scan() {
    if (!file) {
      toast.error("Select a PDF resume first");
      return;
    }
    setScanning(true);
    setFreshResult(null);
    setSelected(null);
    try {
      const data = await postAts(file);
      setFreshResult(data);
      toast.success("Resume analyzed successfully");
      await refresh();
      const doc = await getResume(data.resumeId);
      if (doc) setSelected(doc);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Scan failed");
    } finally {
      setScanning(false);
    }
  }

  async function selectResume(id: string) {
    setFreshResult(null);
    setLoadingDetail(true);
    try {
      const doc = await getResume(id);
      setSelected(doc);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load scan");
    } finally {
      setLoadingDetail(false);
    }
  }

  const displayScore = freshResult?.score ?? selected?.score;
  const displayFeedback =
    freshResult ?? selected?.feedback ?? null;

  return (
    <div className="mx-auto max-w-container-max">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface">ATS Resume Scanner</h1>
        <p className="text-sm text-on-surface-variant">
          Upload a PDF and review past scans
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="glass-card rounded-2xl border border-dashed border-white/15 p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-tertiary">
              upload_file
            </span>
            <p className="mt-3 text-sm text-on-surface-variant">
              PDF only · max 5 MB
            </p>
            <input
              type="file"
              accept="application/pdf"
              className="mx-auto mt-4 block max-w-xs text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-on-primary"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setFreshResult(null);
              }}
            />
            <button
              type="button"
              onClick={scan}
              disabled={!file || scanning}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-container px-8 py-3 text-sm font-semibold text-on-primary-container shadow-lg shadow-primary/20 transition hover:opacity-90 disabled:opacity-50"
            >
              {scanning && <Spinner className="h-4 w-4 border-on-primary-container" />}
              {scanning ? "Analyzing…" : "Analyze resume"}
            </button>
          </div>

          {loadingDetail && (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          )}

          {!loadingDetail && displayFeedback && displayScore !== undefined && (
            <ATSResultView score={displayScore} feedback={displayFeedback} />
          )}

          {!loadingDetail &&
            !displayFeedback &&
            !scanning &&
            !selected &&
            !freshResult && (
              <EmptyState
                icon="description"
                title="No scan selected"
                description="Upload a resume or pick one from your history."
              />
            )}
        </div>

        <aside className="glass-card flex max-h-[calc(100vh-12rem)] flex-col rounded-2xl p-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">
            Scan history
          </h2>

          {loading && (
            <div className="mt-4">
              <ListSkeleton rows={5} />
            </div>
          )}

          {error && (
            <p className="mt-4 text-xs text-error">{error}</p>
          )}

          {!loading && !error && resumes.length === 0 && (
            <div className="mt-4 flex-1">
              <EmptyState
                icon="folder_open"
                title="No resumes uploaded"
                description="Your ATS scans will appear here."
              />
            </div>
          )}

          <ul className="mt-3 flex-1 space-y-1 overflow-y-auto">
            {resumes.map((r) => {
              const active = selected?.id === r.id && !freshResult;
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => selectResume(r.id)}
                    className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      active
                        ? "bg-primary/15 text-primary"
                        : "text-on-surface-variant hover:bg-white/5"
                    }`}
                  >
                    <span className="line-clamp-1 font-medium">
                      {r.fileName ?? "Resume"}
                    </span>
                    <span className="mt-0.5 flex items-center justify-between text-xs opacity-70">
                      <span>Score: {r.score}</span>
                      {r.createdAt && (
                        <span>{r.createdAt.toLocaleDateString()}</span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}
