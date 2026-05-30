import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import type { RoadmapProgressDoc, CareerRoadmap } from "@/types";

export function useRoadmapProgress(
  roleId: string | null, 
  currentYear: string = "1st Year", 
  skillLevel: string = "Beginner",
  roadmapData: CareerRoadmap | null = null
) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<RoadmapProgressDoc | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProgress() {
    if (!user || !roleId) {
      setProgress(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const docId = `${user.uid}_${roleId}`;
      const ref = doc(db, "roadmap_progress", docId);
      const snap = await getDoc(ref);
      
      if (snap.exists()) {
        setProgress({
          id: snap.id,
          ...snap.data(),
          updatedAt: snap.data().updatedAt?.toDate() || null,
        } as RoadmapProgressDoc);
      } else {
        // --- DYNAMIC SLICING LOGIC ---
        // If user is Advanced, pre-complete all "Foundations" skills
        let initialSkills: string[] = [];
        if (skillLevel === "Advanced" && roadmapData) {
          const foundationStage = roadmapData.stages.find(s => s.id === "foundations");
          if (foundationStage && foundationStage.skills) {
            initialSkills = foundationStage.skills.map(s => s.name);
          }
        }

        const initial: RoadmapProgressDoc = {
          id: docId,
          userId: user.uid,
          roleId,
          currentYear,
          skillLevel,
          completedSkills: initialSkills,
          completedProjects: [],
          roadmapCompletionPct: 0,
          internshipReadinessPct: 0,
          jobReadinessPct: 0,
          updatedAt: new Date()
        };
        
        // Save initial state immediately so UI updates
        await setDoc(ref, {
          ...initial,
          updatedAt: serverTimestamp()
        });
        setProgress(initial);
      }
    } catch (e) {
      console.error("Failed to load roadmap progress", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProgress();
  }, [user, roleId, currentYear, skillLevel, roadmapData?.roleId]);

  async function toggleSkill(skillName: string, add: boolean) {
    if (!progress || !user || !roleId) return;

    const newSkills = add 
      ? [...progress.completedSkills, skillName] 
      : progress.completedSkills.filter(s => s !== skillName);
      
    const updated = { ...progress, completedSkills: Array.from(new Set(newSkills)) };
    setProgress(updated);
    
    const ref = doc(db, "roadmap_progress", progress.id);
    await setDoc(ref, {
      ...updated,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }

  return { progress, loading, toggleSkill, refresh: fetchProgress };
}
