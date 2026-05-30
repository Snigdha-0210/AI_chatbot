"use client";

import { useState, useEffect } from "react";
import { postInterviewV2 } from "@/utils/api";
import { usePlacementProgress } from "@/hooks/usePlacementProgress";
import { Spinner } from "@/components/ui/Spinner";
import type { PrepSubject, CodingQuestionV2, ProjectVivaGuide, ExtendedCompanyTrack } from "@/types";
import { CAREER_REGISTRY } from "@/lib/careerRegistry";
import Link from "next/link";

export function InterviewPrepTool() {
  const [setupMode, setSetupMode] = useState(true);
  const [selectedRole, setSelectedRole] = useState("software_engineer");
  
  const [activeTab, setActiveTab] = useState<"subjects" | "coding" | "viva" | "companies">("subjects");
  const [codingCompanyFilter, setCodingCompanyFilter] = useState<string>("All");

  const [data, setData] = useState<{
    subjects: PrepSubject[];
    coding: CodingQuestionV2[];
    viva: ProjectVivaGuide[];
    companies: ExtendedCompanyTrack[];
    dsaRoadmap?: any;
  } | null>(null);
  
  const [loadingMap, setLoadingMap] = useState(false);

  const { progress, toggleCodingQuestion, toggleTopic } = usePlacementProgress(
    setupMode ? null : selectedRole
  );

  useEffect(() => {
    if (setupMode) return;
    async function load() {
      setLoadingMap(true);
      try {
        const res = await postInterviewV2(selectedRole, "all");
        setData(res);
      } catch (e) {
        console.error("Failed to load interview V3 data", e);
      } finally {
        setLoadingMap(false);
      }
    }
    load();
  }, [setupMode, selectedRole]);

  if (setupMode) {
    return (
      <div className="mx-auto max-w-2xl mt-12">
        <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-primary mb-6">rocket_launch</span>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Placement Preparation V3</h1>
          <p className="text-on-surface-variant mb-10">Select your target career from the unified registry to unlock deep theoretical roadmaps and placement tracking.</p>

          <div className="space-y-6 text-left">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Target Career</label>
              <select 
                className="w-full bg-surface-container border border-white/10 text-on-surface text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {CAREER_REGISTRY.map(r => (
                  <option key={r.roleId} value={r.roleId}>{r.title}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => setSetupMode(false)}
            className="w-full mt-10 rounded-full bg-gradient-to-r from-primary to-primary-container px-8 py-4 text-sm font-bold text-on-primary-container shadow-lg shadow-primary/20 transition hover:opacity-90"
          >
            ENTER PLACEMENT DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Placement Dashboard</h1>
          <p className="text-sm text-on-surface-variant mt-1">Role: {CAREER_REGISTRY.find(r => r.roleId === selectedRole)?.title}</p>
        </div>
        <button 
          onClick={() => setSetupMode(true)}
          className="text-xs font-bold text-on-surface-variant bg-surface-container hover:bg-white/10 px-4 py-2 rounded-lg transition"
        >
          CHANGE PROFILE
        </button>
      </header>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-white/10 pb-4 mb-8 custom-scrollbar">
        {[
          { id: "subjects", label: "Preparation Roadmap", icon: "menu_book" },
          { id: "coding", label: "Coding Tracker", icon: "terminal" },
          { id: "viva", label: "Project Viva", icon: "architecture" },
          { id: "companies", label: "Company Profiles", icon: "business" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id ? "bg-primary text-on-primary shadow-lg shadow-primary/20" : "bg-surface-container text-on-surface hover:bg-white/10"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {loadingMap && (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      )}

      {!loadingMap && data && (
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          
          {/* Main Content Area */}
          <div className="space-y-8">
            
            {activeTab === "subjects" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-on-surface mb-6">Subject-Wise Roadmap</h2>
                {data.subjects.map((sub, i) => (
                  <SubjectAccordion key={i} sub={sub} progress={progress} toggleTopic={toggleTopic} selectedRole={selectedRole} />
                ))}
              </div>
            )}

            {activeTab === "coding" && data.dsaRoadmap && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-2">
                  <div>
                    <h2 className="text-xl font-bold text-on-surface">15-Week DSA Roadmap</h2>
                    <p className="text-xs text-on-surface-variant mt-1">Structured learning path for FAANG and top product companies.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Filter</label>
                    <select 
                      className="bg-surface-container border border-white/10 text-on-surface text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                      value={codingCompanyFilter}
                      onChange={(e) => setCodingCompanyFilter(e.target.value)}
                    >
                      <option value="All">All Companies</option>
                      <option value="Google">Google</option>
                      <option value="Amazon">Amazon</option>
                      <option value="Microsoft">Microsoft</option>
                      <option value="Meta">Meta</option>
                      <option value="Apple">Apple</option>
                    </select>
                  </div>
                </div>

                {/* Company Tracks */}
                <div className="grid md:grid-cols-2 gap-4">
                  {(data.dsaRoadmap.companyTracks || []).map((t: any) => (
                    <div key={t.id} className="glass-card p-5 rounded-2xl border-white/5 bg-gradient-to-br from-surface-container to-transparent">
                      <h4 className="font-bold text-primary mb-1">{t.title}</h4>
                      <p className="text-xs text-on-surface-variant mb-4">Target: {t.targetCount}+ Questions</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {t.companies.map((c: string) => <span key={c} className="text-[9px] uppercase tracking-widest text-on-surface-variant border border-white/10 px-1 rounded">{c}</span>)}
                      </div>
                      <div className="text-xs font-medium text-on-surface">
                        <strong className="text-on-surface-variant">Focus:</strong> {t.focus.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 15-Week Tracks */}
                <div className="space-y-6">
                  {(data.dsaRoadmap.tracks || []).map((track: any) => (
                    <div key={track.id} className="space-y-4">
                      <div className="border-b border-white/10 pb-2 mt-4">
                        <h3 className="font-bold text-lg text-primary">{track.title}</h3>
                        <p className="text-xs text-on-surface-variant">{track.description}</p>
                      </div>

                      <div className="space-y-4">
                        {(track.weeks || []).map((week: any) => {
                          const weekQuestions = (week.questions || []).filter((q: any) => 
                            codingCompanyFilter === "All" || (q.companies || []).includes(codingCompanyFilter)
                          );
                          const totalSolved = weekQuestions.filter((q: any) => progress?.solvedCodingIds.includes(q.id)).length;
                          
                          // Defensive Fallback: Empty dataset
                          if (weekQuestions.length === 0 && codingCompanyFilter === "All") {
                            console.error(`[Data Error] Week ${week.week} is missing questions.`);
                            return (
                              <div key={week.week} className="glass-card p-6 rounded-2xl border-error/20 bg-error/5 flex items-center justify-center">
                                <p className="text-sm font-bold text-error flex items-center gap-2">
                                  <span className="material-symbols-outlined">error</span>
                                  Content Unavailable: Week {week.week} data failed to load.
                                </p>
                              </div>
                            );
                          }

                          // Hide week if filter is active and no questions match
                          if (codingCompanyFilter !== "All" && weekQuestions.length === 0) return null;

                          return (
                            <div key={week.week} className="glass-card rounded-2xl border-white/5 overflow-hidden">
                              <div className="p-4 bg-surface-container/50 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors">
                                <div>
                                  <h4 className="font-bold text-on-surface">Week {week.week}: {week.title}</h4>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {week.focus.map((f: string) => <span key={f} className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-on-surface-variant">{f}</span>)}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs font-bold text-primary">{totalSolved} / {weekQuestions.length}</div>
                                  <div className="text-[10px] text-on-surface-variant uppercase tracking-widest">Goal: {week.targetCount}</div>
                                </div>
                              </div>
                              
                              <div className="p-4 space-y-4">
                                {/* Week Projects */}
                                {week.projects && week.projects.length > 0 && (
                                  <div className="mb-4">
                                    <h5 className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-2">Applied Projects</h5>
                                    <div className="flex flex-wrap gap-2">
                                      {week.projects.map((p: any) => (
                                        <button key={p.name} className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 transition-colors text-primary border border-primary/20 px-3 py-1.5 rounded-lg text-xs font-bold">
                                          <span className="material-symbols-outlined text-[14px]">architecture</span>
                                          {p.name}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Week Questions */}
                                <div className="space-y-2">
                                  {weekQuestions.map((q: any) => (
                                    <div key={q.id} className="bg-black/20 p-3 rounded-xl flex items-center justify-between border border-white/5 hover:border-white/10 transition-colors">
                                      <div className="flex gap-3 items-center">
                                        <button 
                                          className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${progress?.solvedCodingIds.includes(q.id) ? "bg-primary border-primary text-on-primary" : "border-white/20"}`}
                                          onClick={() => toggleCodingQuestion(q.id, !(progress?.solvedCodingIds.includes(q.id)))}
                                        >
                                          {progress?.solvedCodingIds.includes(q.id) && <span className="material-symbols-outlined text-[12px]">check</span>}
                                        </button>
                                        <div>
                                          <a href={q.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-on-surface hover:text-primary transition-colors flex items-center gap-2">
                                            {q.title}
                                            <span className="material-symbols-outlined text-[12px] text-on-surface-variant">open_in_new</span>
                                          </a>
                                          <div className="flex flex-wrap gap-2 mt-1 items-center">
                                            <span className={`text-[9px] font-bold uppercase tracking-widest ${q.difficulty === 'Hard' ? 'text-error' : q.difficulty === 'Medium' ? 'text-tertiary' : 'text-primary'}`}>{q.difficulty}</span>
                                            <div className="flex gap-1 ml-1">
                                              {(q.companies || []).map((c: string) => <span key={c} className="text-[9px] uppercase tracking-widest text-on-surface-variant">{c}</span>)}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  {weekQuestions.length === 0 && <p className="text-xs text-on-surface-variant italic p-2">Curated questions coming soon.</p>}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "viva" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-on-surface mb-6">Project Viva Preparation</h2>
                {data.viva.map((v, i) => (
                  <div key={i} className="glass-card rounded-2xl p-6 border-white/5 space-y-6">
                    <header>
                      <h3 className="font-bold text-xl text-primary mb-2">{v.projectName}</h3>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{v.description}</p>
                    </header>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Business Use Case</h4>
                          <p className="text-sm font-medium text-on-surface">{v.businessUseCase || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Architecture</h4>
                          <p className="text-sm font-medium text-on-surface">{v.architectureDiagramDesc || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Tech Stack</h4>
                          <div className="flex flex-wrap gap-2">
                            {(v.techStack || []).map(t => <span key={t} className="px-2 py-1 bg-surface-container rounded text-[10px] font-bold text-on-surface">{t}</span>)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Database Design</h4>
                          <p className="text-sm font-medium text-on-surface">{v.databaseDesign || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">API Design</h4>
                          <p className="text-sm font-medium text-on-surface">{v.apiDesign || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Scalability & Performance</h4>
                          <p className="text-sm font-medium text-on-surface">{v.scalabilityDiscussion || "N/A"} {v.performanceOptimizations || ""}</p>
                        </div>
                      </div>
                    </div>

                    {v.questions && (
                      <div className="pt-6 border-t border-white/5">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px]">psychology</span>
                          Potential Interview Questions
                        </h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                            <h5 className="text-[10px] uppercase font-bold text-on-surface-variant mb-2 tracking-widest">System Design</h5>
                            <ul className="space-y-2 text-[11px] text-on-surface">
                              {(v.questions.systemDesign || []).map((q, j) => <li key={j} className="flex gap-2"><span className="text-primary">•</span>{q}</li>)}
                            </ul>
                          </div>
                          <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                            <h5 className="text-[10px] uppercase font-bold text-on-surface-variant mb-2 tracking-widest">Architecture</h5>
                            <ul className="space-y-2 text-[11px] text-on-surface">
                              {(v.questions.architecture || []).map((q, j) => <li key={j} className="flex gap-2"><span className="text-primary">•</span>{q}</li>)}
                            </ul>
                          </div>
                          <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                            <h5 className="text-[10px] uppercase font-bold text-on-surface-variant mb-2 tracking-widest">Optimization</h5>
                            <ul className="space-y-2 text-[11px] text-on-surface">
                              {(v.questions.optimization || []).map((q, j) => <li key={j} className="flex gap-2"><span className="text-primary">•</span>{q}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "companies" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-on-surface">Company Tracks</h2>
                  <span className="text-xs font-mono bg-surface-container px-3 py-1 rounded text-on-surface-variant">
                    {data.companies.length} Companies
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {data.companies.map((c, i) => (
                    <div key={i} className="glass-card rounded-2xl p-6 border-white/5 relative overflow-hidden flex flex-col">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                         <span className="material-symbols-outlined text-[100px]">corporate_fare</span>
                      </div>
                      <div className="flex-1 relative z-10">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-xl text-primary">{c.company}</h3>
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${c.difficultyLevel === 'Very Hard' ? 'bg-error/10 text-error' : c.difficultyLevel === 'Hard' ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'}`}>
                            {c.difficultyLevel}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant font-medium mb-6">{c.overview}</p>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-[10px] uppercase font-bold text-on-surface-variant mb-1 tracking-widest">Interview Rounds</h4>
                            <p className="text-sm text-on-surface font-medium">{c.interviewPattern}</p>
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-bold text-on-surface-variant mb-1 tracking-widest">Expected Skills</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {c.expectedSkills.map(s => <span key={s} className="px-2 py-1 bg-white/5 text-on-surface text-[10px] rounded font-medium">{s}</span>)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Est. Comp</span>
                        <span className="text-sm font-bold text-tertiary">{c.salaryRange}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Dashboard */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 sticky top-6">
              <h2 className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-6 flex items-center justify-between">
                Global Readiness
                <span className="material-symbols-outlined text-primary">donut_large</span>
              </h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-mono uppercase text-on-surface-variant mb-2">
                    <span>Subjects Conquered</span>
                    <span>{progress?.completedTopics.length || 0} / {data.subjects.reduce((acc, curr) => acc + curr.topics.length, 0)}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary transition-all" 
                      style={{ width: `${Math.min(100, ((progress?.completedTopics.length || 0) / (data.subjects.reduce((acc, curr) => acc + curr.topics.length, 0) || 1)) * 100)}%` }} 
                    />
                  </div>
                </div>

                {(() => {
                  const totalCuratedCoding = data.dsaRoadmap?.tracks?.reduce((acc: number, t: any) => acc + t.weeks.reduce((wAcc: number, w: any) => wAcc + w.questions.length, 0), 0) || 1;
                  const solvedCodingCount = progress?.solvedCodingIds.length || 0;
                  const codingProgressPercent = Math.min(100, (solvedCodingCount / totalCuratedCoding) * 100);
                  
                  const hardQuestionsSolved = (progress?.solvedCodingIds || []).filter(id => data.dsaRoadmap?.tracks?.some((t: any) => t.weeks.some((w: any) => w.questions.some((q: any) => q.id === id && q.difficulty === 'Hard')))).length;
                  
                  const mockRoadmapProgress = 0; 
                  const mockProjectProgress = 0; 
                  const mockResumeProgress = 0; 
                  const mockAtsScore = 0; 
                  const mockInterviewPrep = 0; 

                  const placementReadiness = 
                    (mockRoadmapProgress * 0.25) + 
                    (codingProgressPercent * 0.25) + 
                    (mockInterviewPrep * 0.20) + 
                    (mockProjectProgress * 0.15) + 
                    (mockResumeProgress * 0.10) + 
                    (mockAtsScore * 0.05);

                  const systemDesignProgress = 0; 
                  const hardTarget = 30; 
                  const faangReadiness = 
                    (codingProgressPercent * 0.60) + 
                    (Math.min(100, (hardQuestionsSolved / hardTarget) * 100) * 0.20) + 
                    (systemDesignProgress * 0.20);
                  
                  return (
                    <>
                      <div>
                        <div className="flex justify-between text-xs font-mono uppercase text-on-surface-variant mb-2">
                          <span>Coding Mastery (Curated)</span>
                          <span>{solvedCodingCount} / {totalCuratedCoding}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-tertiary transition-all" 
                            style={{ width: `${codingProgressPercent}%` }} 
                          />
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/10 space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-mono uppercase text-on-surface-variant mb-2">
                            <span>Placement Readiness</span>
                            <span className={`font-bold ${placementReadiness > 70 ? 'text-secondary' : placementReadiness > 30 ? 'text-primary' : 'text-on-surface-variant'}`}>
                              {Math.round(placementReadiness)}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-secondary transition-all" style={{ width: `${placementReadiness}%` }}></div></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-mono uppercase text-on-surface-variant mb-2">
                            <span>FAANG Readiness</span>
                            <span className={`font-bold ${faangReadiness > 70 ? 'text-tertiary' : faangReadiness > 30 ? 'text-primary' : 'text-on-surface-variant'}`}>
                              {Math.round(faangReadiness)}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-tertiary transition-all" style={{ width: `${faangReadiness}%` }}></div></div>
                        </div>
                      </div>
                    </>
                  );
                })()}

                <div className="pt-6 border-t border-white/10 text-center">
                  <div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">Current Streak</div>
                  <div className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[28px]">local_fire_department</span>
                    {progress?.currentStreak || 0} Days
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// Deep Subject Accordion V4
function SubjectAccordion({ sub, progress, toggleTopic, selectedRole }: { sub: PrepSubject; progress: any; toggleTopic: any; selectedRole: string }) {
  const [expanded, setExpanded] = useState(false);
  const totalTopics = sub.topics.length;
  const completedTopics = sub.topics.filter(t => progress?.completedTopics.includes(t.name)).length;
  const isAllDone = totalTopics > 0 && completedTopics === totalTopics;

  return (
    <div className={`rounded-2xl border transition-all overflow-hidden ${isAllDone ? "bg-primary/5 border-primary/20" : "bg-white/5 border-white/5"}`}>
      <div className="p-6 cursor-pointer flex justify-between items-center" onClick={() => setExpanded(!expanded)}>
        <div>
          <h3 className="font-bold text-lg text-primary mb-1">{sub.name}</h3>
          <p className="text-sm text-on-surface-variant">{sub.description}</p>
          <div className="flex gap-3 mt-3">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded text-on-surface">{sub.difficulty}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs font-mono text-on-surface-variant">{completedTopics}/{totalTopics} Completed</div>
            {isAllDone && <div className="text-xs font-bold text-primary mt-1">MASTERED</div>}
          </div>
          <span className={`material-symbols-outlined transition-transform ${expanded ? "rotate-180" : ""}`}>expand_more</span>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/10 bg-black/20 p-6">
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">info</span> Why this matters
            </h4>
            <p className="text-sm text-on-surface leading-relaxed max-w-3xl">{sub.whyItMatters}</p>
          </div>

          <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">explore</span> Dedicated Topic Portals
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {sub.topics.map(t => {
              const isDone = progress?.completedTopics.includes(t.name);
              // Fallback slug generation if it wasn't returned
              const topicSlug = (t as any).slug || t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              
              return (
                <div key={t.name} className="bg-surface-container rounded-xl p-4 flex justify-between items-center group hover:bg-white/5 transition-colors border border-white/5 hover:border-primary/50">
                  <Link href={`/interview/${selectedRole}/${topicSlug}`} className="flex-1">
                    <h5 className="font-bold text-on-surface text-sm group-hover:text-primary transition-colors">{t.name}</h5>
                    <p className="text-[11px] text-on-surface-variant mt-1 flex gap-2 items-center">
                      <span className="material-symbols-outlined text-[14px]">timer</span>
                      Est. {t.estimatedHours} Hours
                    </p>
                  </Link>
                  <button 
                    className={`ml-4 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-colors shrink-0 ${
                      isDone
                        ? "bg-primary border-primary text-on-primary" 
                        : "bg-white/5 border-white/10 hover:border-white/30 text-on-surface"
                    }`}
                    onClick={(e) => { e.stopPropagation(); toggleTopic(t.name, !isDone); }}
                  >
                    {isDone ? "COMPLETED" : "MARK DONE"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
