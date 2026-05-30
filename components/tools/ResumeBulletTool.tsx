"use client";

import { useState } from "react";
import { useBulletImprovements } from "@/hooks/useBulletImprovements";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { postImproveBullet } from "@/utils/api";
import { CopyButton } from "@/components/ui/CopyButton";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import type { BulletImproverDoc } from "@/types";

export function ResumeBulletTool() {
  const { user } = useAuth();
  const { results, loading, error, refresh, getResult, deleteImprovement } = useBulletImprovements();
  const toast = useToast();

  const [input, setInput] = useState("");
  const [improving, setImproving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [currentResult, setCurrentResult] = useState<BulletImproverDoc | null>(null);

  async function improve() {
    if (!input.trim()) {
      toast.error("Enter a resume bullet first");
      return;
    }
    if (!user) {
      toast.error("You must be logged in.");
      return;
    }
    
    setImproving(true);
    setCurrentResult(null);
    setSelectedId(null);
    try {
      const data = await postImproveBullet(input.trim(), user.uid);
      setCurrentResult(data);
      toast.success("Bullet improved");
      await refresh();
      setSelectedId(data.id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to improve");
    } finally {
      setImproving(false);
    }
  }

  async function loadHistory(id: string) {
    setLoadingDetail(true);
    setCurrentResult(null);
    try {
      const doc = await getResult(id);
      if (doc) {
        setInput(doc.originalBullet);
        setCurrentResult(doc);
        setSelectedId(id);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load");
    } finally {
      setLoadingDetail(false);
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 86) return "text-green-400";
    if (score >= 71) return "text-primary";
    if (score >= 41) return "text-secondary";
    return "text-error";
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface">Smart Resume Bullet Improver</h1>
        <p className="text-sm text-on-surface-variant">
          Transform weak bullets into ATS-friendly statements using deterministic rules.
        </p>
      </header>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        
        {/* Left Panel: Input Area */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
            <label className="font-mono text-xs uppercase tracking-widest text-on-surface-variant flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined">edit</span>
              Original Bullet
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              placeholder='e.g. "made a chatbot in python"'
              className="flex-1 w-full resize-none rounded-xl border border-white/10 bg-surface-container px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:outline-none mb-4"
            />
            <button
              type="button"
              onClick={improve}
              disabled={improving || !input.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-container px-6 py-4 text-sm font-bold text-on-primary-container transition hover:opacity-90 disabled:opacity-50"
            >
              {improving && <Spinner className="h-4 w-4 border-on-primary-container" />}
              {improving ? "Optimizing..." : "IMPROVE BULLET"}
            </button>
          </div>
        </div>

        {/* Center Panel: Results Area */}
        <div className="lg:col-span-5 space-y-4">
          {loadingDetail && (
            <div className="glass-card rounded-2xl p-12 flex justify-center items-center h-full">
              <Spinner />
            </div>
          )}

          {!loadingDetail && !currentResult && !improving && (
            <div className="glass-card rounded-2xl p-12 flex flex-col justify-center items-center h-full text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">analytics</span>
              <h3 className="text-lg font-bold text-on-surface mb-2">Awaiting Input</h3>
              <p className="text-sm text-on-surface-variant">Enter a bullet point on the left and click improve to see the ATS scoring and variations.</p>
            </div>
          )}

          {!loadingDetail && currentResult && (
            <div className="flex flex-col gap-4">
              
              {/* Score Card Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card rounded-2xl p-5 flex flex-col justify-center items-center">
                   <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-2">ATS Score</p>
                   <div className={`text-4xl font-bold ${getScoreColor(currentResult.atsScore)}`}>
                     {currentResult.atsScore}<span className="text-lg opacity-50 text-on-surface-variant">/100</span>
                   </div>
                </div>
                <div className="glass-card rounded-2xl p-5 flex flex-col justify-center items-center">
                   <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-2">Quality</p>
                   <div className={`text-xl font-bold px-4 py-2 rounded-full border border-white/10 ${getScoreColor(currentResult.atsScore)} bg-white/5`}>
                     {currentResult.qualityLevel}
                   </div>
                </div>
              </div>

              {/* Improved Variations */}
              <div className="glass-card rounded-2xl p-5 flex flex-col gap-3">
                 <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary mb-2">
                   <span className="material-symbols-outlined">auto_fix_high</span>
                   Improved Variations
                 </h2>
                 {currentResult.improvedVersions.map((version, idx) => (
                   <div key={idx} className="bg-surface-container rounded-xl p-4 border border-white/5 relative group">
                     <p className="text-sm text-on-surface pr-8 leading-relaxed">{version}</p>
                     <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       <CopyButton text={version} />
                     </div>
                   </div>
                 ))}
              </div>

              {/* Tech Badges & Suggestions Row */}
              {currentResult.detectedTechnologies.length > 0 && (
                <div className="glass-card rounded-2xl p-5">
                   <p className="font-mono text-xs uppercase tracking-widest text-tertiary mb-3">Detected Technologies</p>
                   <div className="flex flex-wrap gap-2">
                     {currentResult.detectedTechnologies.map(tech => (
                       <span key={tech} className="px-3 py-1 bg-tertiary/20 text-tertiary rounded-md text-xs font-semibold border border-tertiary/20">
                         {tech}
                       </span>
                     ))}
                   </div>
                </div>
              )}

              <div className="glass-card rounded-2xl p-5">
                 <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-3">Actionable Feedback</p>
                 <ul className="space-y-2">
                   {currentResult.suggestions.map((s, idx) => (
                     <li key={idx} className="flex gap-2 items-start text-sm text-on-surface-variant">
                       <span className="text-secondary mt-0.5">•</span> {s}
                     </li>
                   ))}
                 </ul>
              </div>

            </div>
          )}
        </div>

        {/* Right Panel: History */}
        <div className="lg:col-span-3">
          <aside className="glass-card flex h-full max-h-[800px] flex-col rounded-2xl p-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-4 flex gap-2 items-center">
              <span className="material-symbols-outlined text-sm">history</span>
              Recent Improvements
            </h2>
  
            {loading && (
              <div className="mt-4">
                <ListSkeleton rows={5} />
              </div>
            )}
  
            {error && (
              <p className="mt-4 text-xs text-error">{error}</p>
            )}
  
            {!loading && !error && results.length === 0 && (
              <div className="mt-4 flex-1">
                <EmptyState
                  icon="history"
                  title="No history yet"
                  description="Your improved bullets will appear here."
                />
              </div>
            )}
  
            <ul className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
              {results.map((r) => {
                const active = selectedId === r.id;
                return (
                  <li key={r.id} className="relative group">
                    <button
                      type="button"
                      onClick={() => loadHistory(r.id)}
                      className={`w-full rounded-xl px-3 py-3 text-left transition border ${
                        active
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "text-on-surface-variant hover:bg-white/5 border-transparent"
                      }`}
                    >
                      <p className="line-clamp-2 text-xs font-medium mb-1 pr-6">
                        &quot;{r.originalBullet}&quot;
                      </p>
                      <div className="flex items-center justify-between opacity-70">
                        <span className={`text-[10px] font-bold ${getScoreColor(r.atsScore)}`}>
                          Score: {r.atsScore}
                        </span>
                        {r.createdAt && (
                          <span className="text-[10px]">{r.createdAt.toLocaleDateString()}</span>
                        )}
                      </div>
                    </button>
                    {/* Hover Actions */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container rounded-md shadow-md p-1">
                       <button 
                         onClick={(e) => { e.stopPropagation(); setInput(r.originalBullet); setImproving(false); }}
                         className="p-1 hover:bg-white/10 rounded text-on-surface-variant hover:text-primary transition-colors"
                         title="Reuse"
                       >
                         <span className="material-symbols-outlined text-[14px]">refresh</span>
                       </button>
                       <button 
                         onClick={async (e) => { 
                           e.stopPropagation(); 
                           try {
                             await deleteImprovement(r.id);
                             if (selectedId === r.id) {
                               setCurrentResult(null);
                               setSelectedId(null);
                               setInput("");
                             }
                             toast.success("Deleted from history");
                           } catch (err) {
                             toast.error("Failed to delete");
                           }
                         }}
                         className="p-1 hover:bg-white/10 rounded text-on-surface-variant hover:text-error transition-colors"
                         title="Delete"
                       >
                         <span className="material-symbols-outlined text-[14px]">delete</span>
                       </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>

      </div>
    </div>
  );
}
