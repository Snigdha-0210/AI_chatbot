"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getInterviewTopic } from "@/utils/api";
import { Spinner } from "@/components/ui/Spinner";
import type { DetailedTopicPage } from "@/types";

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  
  const roleId = params.role as string;
  const topicSlug = params.subject as string;
  
  const [data, setData] = useState<DetailedTopicPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getInterviewTopic(roleId, topicSlug);
        setData(res);
      } catch (e) {
        console.error("Failed to load topic page", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [roleId, topicSlug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6 text-center">
        <h1 className="text-2xl font-bold text-on-surface mb-4">Topic Not Found</h1>
        <button onClick={() => router.back()} className="text-primary hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-6 max-w-[1000px] mx-auto">
      
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-8"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        BACK TO DASHBOARD
      </button>
      
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-surface-container rounded-full text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">
            {data.subjectName}
          </span>
          <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest ${
            data.expectedDifficulty === 'Expert' || data.expectedDifficulty === 'Advanced' 
              ? 'bg-error/10 text-error' 
              : data.expectedDifficulty === 'Intermediate' 
                ? 'bg-tertiary/10 text-tertiary' 
                : 'bg-primary/10 text-primary'
          }`}>
            {data.expectedDifficulty}
          </span>
          <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase font-mono tracking-widest text-on-surface">
            {data.estimatedPreparationTime}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-on-surface mb-4">
          Mastering <span className="text-primary">{data.topicName}</span>
        </h1>
        <p className="text-lg text-on-surface-variant leading-relaxed">
          {data.topicOverview}
        </p>
      </header>
      
      <div className="space-y-12">
        
        <section className="glass-card rounded-2xl p-8 border-primary/20 bg-primary/5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">lightbulb</span>
            Why It Matters
          </h2>
          <p className="text-on-surface leading-relaxed font-medium">
            {data.whyItMatters}
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-on-surface border-b border-white/10 pb-4">Core Concepts</h2>
            <ul className="space-y-3">
              {data.concepts.map((c, i) => (
                <li key={i} className="flex gap-3 text-on-surface-variant bg-surface-container p-4 rounded-xl">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span className="text-sm">{c}</span>
                </li>
              ))}
            </ul>
          </section>
          
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-on-surface border-b border-white/10 pb-4">Interview Questions</h2>
            <ul className="space-y-3">
              {data.interviewQuestions.map((q, i) => (
                <li key={i} className="flex gap-3 text-on-surface-variant bg-black/20 p-4 rounded-xl border border-white/5">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">psychology</span>
                  <span className="text-sm font-medium">{q}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="space-y-6">
          <h2 className="text-xl font-bold text-on-surface border-b border-white/10 pb-4">Learning Resources</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {data.resources.map((r, i) => (
              <a 
                key={i} 
                href={r.url} 
                target="_blank" 
                rel="noreferrer" 
                className="glass-card p-6 rounded-2xl hover:-translate-y-1 transition-all group border-white/5 hover:border-primary/50"
              >
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">
                    {r.type === 'video' ? 'play_circle' : r.type === 'docs' ? 'menu_book' : 'code'}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-on-surface mb-1">{r.title}</h3>
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-mono">
                  {r.type} link
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-bold text-on-surface border-b border-white/10 pb-4">Project Integrations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-on-surface-variant mb-4 uppercase tracking-widest">Mini Projects</h3>
              <ul className="space-y-3">
                {data.miniProjects.map((p, i) => (
                  <li key={i} className="text-sm text-on-surface bg-surface-container px-4 py-3 rounded-lg border-l-2 border-secondary">{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface-variant mb-4 uppercase tracking-widest">Advanced Projects</h3>
              <ul className="space-y-3">
                {data.advancedProjects.map((p, i) => (
                  <li key={i} className="text-sm text-on-surface bg-surface-container px-4 py-3 rounded-lg border-l-2 border-error">{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
