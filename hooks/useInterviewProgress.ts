import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./useAuth";
import type { InterviewPrepDoc } from "@/types";

export function useInterviewProgress(roleId: string | null, level: string | null) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<InterviewPrepDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !roleId || !level) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      const docRef = doc(db, "interview_progress", `${user!.uid}_${roleId}_${level}`);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setProgress(snap.data() as InterviewPrepDoc);
      } else {
        const init: InterviewPrepDoc = {
          id: `${user!.uid}_${roleId}_${level}`,
          userId: user!.uid,
          roleId,
          level: level as any,
          practicedQuestionIds: [],
          mockHistory: [],
          strongAreas: [],
          weakAreas: [],
          globalReadinessScore: 0,
          updatedAt: new Date()
        };
        await setDoc(docRef, init);
        setProgress(init);
      }
      setLoading(false);
    }
    load();
  }, [user, roleId, level]);

  const toggleQuestion = async (questionId: string, practiced: boolean) => {
    if (!user || !progress) return;
    let updated = [...progress.practicedQuestionIds];
    if (practiced && !updated.includes(questionId)) {
      updated.push(questionId);
    } else if (!practiced) {
      updated = updated.filter(id => id !== questionId);
    }
    
    const newProgress = { ...progress, practicedQuestionIds: updated, updatedAt: new Date() };
    setProgress(newProgress);
    const docRef = doc(db, "interview_progress", progress.id);
    await setDoc(docRef, newProgress, { merge: true });
  };

  const saveMockResult = async (questionId: string, answer: string, score: number) => {
    if (!user || !progress) return;
    const result = { questionId, userAnswer: answer, selfScore: score, date: new Date() };
    const newProgress = {
      ...progress,
      mockHistory: [...progress.mockHistory, result],
      updatedAt: new Date()
    };
    setProgress(newProgress);
    const docRef = doc(db, "interview_progress", progress.id);
    await setDoc(docRef, newProgress, { merge: true });
  };

  return {
    progress,
    loading,
    toggleQuestion,
    saveMockResult
  };
}
