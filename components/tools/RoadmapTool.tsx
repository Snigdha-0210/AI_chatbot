"use client";

import { useState, useEffect } from "react";
import { postRoadmap } from "@/utils/api";
import { useRoadmapProgress } from "@/hooks/useRoadmapProgress";
import { useResumes } from "@/hooks/useResumes";
import { Spinner } from "@/components/ui/Spinner";
import type { CareerRoadmap } from "@/types";
import { CAREER_REGISTRY } from "@/lib/careerRegistry";

export function RoadmapTool() {
  const [setupMode, setSetupMode] = useState(true);
  const [selectedRole, setSelectedRole] = useState("software_engineer");
  const [selectedYear, setSelectedYear] = useState<string>("1st Year");
  const [selectedLevel, setSelectedLevel] = useState<string>("Beginner");

  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [loadingMap, setLoadingMap] = useState(false);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  // Cross-tool integration: ATS Missing Skills
  const { resumes } = useResumes();
  const latestResume = resumes.length > 0 ? resumes[0] : null;
  const atsMissingSkills = new Set(
    (latestResume?.feedback?.missingSkills || []).map(s => s.toLowerCase())
  );

  const { progress, toggleSkill } = useRoadmapProgress(
    setupMode ? null : selectedRole, 
    selectedYear, 
    selectedLevel, 
    roadmap
  );

  useEffect(() => {
    if (setupMode) return;
    async function load() {
      setLoadingMap(true);
      try {
        console.log("Generating Roadmap for:", selectedRole, selectedYear, selectedLevel);
        const data = await postRoadmap(selectedRole, selectedYear, selectedLevel);
        setRoadmap(data);
      } catch (e) {
        console.error("Failed to load roadmap", e);
      } finally {
        setLoadingMap(false);
      }
    }
    load();
  }, [selectedRole, setupMode, selectedYear, selectedLevel]);

  function handleStart() {
    setSetupMode(false);
  }

  // Calculations
  let totalSkills = 0;
  let masteredSkills = 0;
  let totalImportance = 0;
  let masteredImportance = 0;

  if (roadmap && !setupMode) {
    roadmap.stages.forEach(stage => {
      stage.skills?.forEach(skill => {
        totalSkills++;
        totalImportance += skill.importanceScore;
        if (progress?.completedSkills.includes(skill.name)) {
          masteredSkills++;
          masteredImportance += skill.importanceScore;
        }
      });
    });
  }

  const completionPct = totalSkills > 0 ? Math.round((masteredSkills / totalSkills) * 100) : 0;
  const readinessPct = totalImportance > 0 ? Math.round((masteredImportance / totalImportance) * 100) : 0;

  if (setupMode) {
    return (
      <div className="mx-auto max-w-2xl mt-12">
        <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-primary mb-6">explore</span>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Personalize Your Journey</h1>
          <p className="text-on-surface-variant mb-10">Configure your starting point so we can generate the perfect roadmap for you.</p>

          <div className="space-y-6 text-left">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">What do you want to become?</label>
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

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">What year are you currently in?</label>
              <select 
                className="w-full bg-surface-container border border-white/10 text-on-surface text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">What is your current skill level?</label>
              <select 
                className="w-full bg-surface-container border border-white/10 text-on-surface text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced (Fast-track Foundations)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full mt-10 rounded-full bg-gradient-to-r from-primary to-primary-container px-8 py-4 text-sm font-bold text-on-primary-container shadow-lg shadow-primary/20 transition hover:opacity-90"
          >
            GENERATE ROADMAP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Career Roadmap Engine</h1>
          <p className="text-sm text-on-surface-variant flex gap-2 items-center mt-1">
            <span className="material-symbols-outlined text-[14px]">person</span>
            {selectedYear} • {selectedLevel}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setSetupMode(true)}
            className="text-xs font-bold text-on-surface-variant bg-surface-container hover:bg-white/10 px-4 py-2 rounded-lg transition"
          >
            EDIT PROFILE
          </button>
          {/* Role Selector Override */}
          <div className="relative">
            <select 
              className="appearance-none bg-surface-container border border-white/10 text-on-surface text-sm font-semibold rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-primary cursor-pointer"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {CAREER_REGISTRY.map(r => (
                <option key={r.roleId} value={r.roleId}>{r.title}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-sm">
              expand_more
            </span>
          </div>
        </div>
      </header>

      {loadingMap && (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      )}

      {!loadingMap && roadmap && (
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          
          {/* Vertical Journey */}
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[23px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            {roadmap.stages.map((stage, idx) => (
              <div key={stage.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                {/* Timeline Dot */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-surface bg-surface-container text-on-surface-variant group-hover:text-primary transition-colors shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(255,255,255,0.02)] relative z-10">
                  <span className="material-symbols-outlined text-sm font-bold">{idx + 1}</span>
                </div>
                
                {/* Stage Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] glass-card rounded-2xl p-6 hover:-translate-y-1 transition-transform">
                  <h3 className="text-xl font-bold text-on-surface mb-2">{stage.title}</h3>
                  <p className="text-sm text-on-surface-variant mb-6">{stage.description}</p>
                  
                  {/* Skills Checklist */}
                  {stage.skills && stage.skills.length > 0 && (
                    <div className="space-y-3">
                      {stage.skills.map(skill => {
                        const isDone = progress?.completedSkills.includes(skill.name);
                        const isMissingInATS = atsMissingSkills.has(skill.name.toLowerCase());
                        const isExpanded = expandedSkill === skill.name;
                        
                        return (
                          <div 
                            key={skill.name} 
                            className={`rounded-xl border transition-all overflow-hidden ${
                              isDone ? "bg-primary/5 border-primary/20" : "bg-white/5 border-white/5 hover:bg-white/10"
                            }`}
                          >
                            <div 
                              className="p-3 cursor-pointer flex items-center justify-between"
                              onClick={() => setExpandedSkill(isExpanded ? null : skill.name)}
                            >
                              <div className="flex items-center gap-3">
                                <button
                                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors ${
                                    isDone ? "bg-primary border-primary text-on-primary" : "border-white/20 hover:border-primary"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSkill(skill.name, !isDone);
                                  }}
                                >
                                  {isDone && <span className="material-symbols-outlined text-[14px]">check</span>}
                                </button>
                                <div className="flex-1">
                                  <span className={`text-sm font-medium ${isDone ? "text-primary opacity-80" : "text-on-surface"}`}>
                                    {skill.name}
                                  </span>
                                </div>
                                <span className="text-[10px] uppercase font-mono tracking-widest text-on-surface-variant ml-2">
                                  {skill.difficulty}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {isMissingInATS && !isDone && (
                                  <span className="material-symbols-outlined text-[14px] text-error">warning</span>
                                )}
                                <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                                  expand_more
                                </span>
                              </div>
                            </div>
                            
                            {/* Expandable Accordion Body */}
                            {isExpanded && (
                              <div className="p-4 bg-black/20 border-t border-white/5 space-y-4">
                                
                                {skill.subtopics && skill.subtopics.length > 0 && (
                                  <div>
                                    <h5 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Subtopics</h5>
                                    <ul className="grid grid-cols-2 gap-2">
                                      {skill.subtopics.map(sub => (
                                        <li key={sub} className="text-xs text-on-surface flex items-center gap-2">
                                          <span className="w-1 h-1 rounded-full bg-primary/50" /> {sub}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {skill.miniProject && (
                                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                                    <h5 className="text-xs font-bold text-primary mb-1">Mini Project: {skill.miniProject.name}</h5>
                                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                                      {skill.miniProject.description}
                                    </p>
                                  </div>
                                )}

                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                                  <span className="text-xs font-mono text-on-surface-variant">Est: {skill.estimatedHours} hrs</span>
                                  <button 
                                    className="text-xs font-bold text-primary hover:underline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleSkill(skill.name, !isDone);
                                    }}
                                  >
                                    {isDone ? "Mark Incomplete" : "Mark Complete"}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Projects List */}
                  {stage.projects && stage.projects.length > 0 && (
                    <div className="space-y-3">
                      {stage.projects.map(proj => (
                        <div key={proj.name} className="p-4 rounded-xl bg-surface-container border border-white/5">
                          <h4 className="text-sm font-bold text-on-surface mb-1 flex justify-between">
                            {proj.name}
                            <span className="text-xs font-mono text-tertiary">{proj.difficulty}</span>
                          </h4>
                          <p className="text-xs text-on-surface-variant leading-relaxed">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Topics List */}
                  {stage.topics && stage.topics.length > 0 && (
                    <ul className="space-y-2 mt-4 bg-black/20 p-4 rounded-xl">
                      {stage.topics.map((topic, i) => (
                        <li key={i} className="text-sm text-on-surface-variant flex gap-2">
                          <span className="text-primary">•</span> {topic}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right Dashboard */}
          <div className="space-y-6">

            {/* Tool Stack Panel */}
            {roadmap.toolStack && (
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-6">
                  Required Tool Stack
                </h2>
                <div className="space-y-4">
                  {Object.entries(roadmap.toolStack).map(([category, tools]) => {
                    if (!tools || tools.length === 0) return null;
                    return (
                      <div key={category}>
                        <h4 className="text-[10px] font-bold text-on-surface-variant uppercase mb-2">{category}</h4>
                        <div className="flex flex-wrap gap-2">
                          {(tools as string[]).map(tool => (
                            <span key={tool} className="px-2 py-1 bg-surface-container border border-white/10 rounded text-[11px] font-medium text-on-surface">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Readiness Widget */}
            <div className="glass-card rounded-2xl p-6 sticky top-6">
              <h2 className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-6">
                Career Dashboard
              </h2>

              <div className="flex items-center gap-4 mb-8">
                <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="36" className="stroke-white/10" strokeWidth="8" fill="none" />
                    <circle cx="40" cy="40" r="36" className="stroke-primary transition-all duration-1000 ease-out" strokeWidth="8" fill="none" strokeDasharray={226} strokeDashoffset={226 - (226 * readinessPct) / 100} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xl font-bold">{readinessPct}%</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">Job Readiness</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Based on importance score of mastered skills.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono uppercase text-on-surface-variant mb-2">
                    <span>Skills Completed</span>
                    <span>{masteredSkills} / {totalSkills}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary transition-all" style={{ width: `${completionPct}%` }} />
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 mt-6">
                   <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-1 flex items-center gap-2">
                     <span className="material-symbols-outlined text-[16px]">work</span>
                     Career Status
                   </h4>
                   <p className="text-sm font-medium text-on-surface">
                     {readinessPct >= 80 ? "Ready for Junior Roles!" : readinessPct >= 50 ? "Ready for Internships" : "Building Foundations"}
                   </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}
