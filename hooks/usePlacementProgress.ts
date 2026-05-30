import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./useAuth";
import type { PlacementProgressDoc } from "@/types";

export function usePlacementProgress(roleId: string | null) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<PlacementProgressDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !roleId) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      const docRef = doc(db, "placement_progress", `${user!.uid}_${roleId}`);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setProgress(snap.data() as PlacementProgressDoc);
      } else {
        const init: PlacementProgressDoc = {
          id: `${user!.uid}_${roleId}`,
          userId: user!.uid,
          roleId,
          solvedCodingIds: [],
          completedTopics: [],
          currentStreak: 0,
          lastActiveDate: null,
          overallPlacementReadiness: 0,
          updatedAt: new Date()
        };
        await setDoc(docRef, init);
        setProgress(init);
      }
      setLoading(false);
    }
    load();
  }, [user, roleId]);

  const toggleCodingQuestion = async (questionId: string, solved: boolean) => {
    if (!user || !progress) return;
    let updated = [...progress.solvedCodingIds];
    if (solved && !updated.includes(questionId)) {
      updated.push(questionId);
    } else if (!solved) {
      updated = updated.filter(id => id !== questionId);
    }
    
    // Update streak (simplified logic)
    const newProgress = { 
      ...progress, 
      solvedCodingIds: updated,
      currentStreak: progress.currentStreak === 0 ? 1 : progress.currentStreak,
      lastActiveDate: new Date(),
      updatedAt: new Date() 
    };
    setProgress(newProgress);
    const docRef = doc(db, "placement_progress", progress.id);
    await setDoc(docRef, newProgress, { merge: true });
  };

  const toggleTopic = async (topicName: string, solved: boolean) => {
    if (!user || !progress) return;
    let updated = [...progress.completedTopics];
    if (solved && !updated.includes(topicName)) {
      updated.push(topicName);
    } else if (!solved) {
      updated = updated.filter(id => id !== topicName);
    }
    
    const newProgress = { ...progress, completedTopics: updated, updatedAt: new Date() };
    setProgress(newProgress);
    const docRef = doc(db, "placement_progress", progress.id);
    await setDoc(docRef, newProgress, { merge: true });
  };

  return {
    progress,
    loading,
    toggleCodingQuestion,
    toggleTopic
  };
}
