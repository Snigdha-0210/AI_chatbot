import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import type { BulletImproverDoc } from "@/types";

export function useBulletImprovements() {
  const { user } = useAuth();
  const [results, setResults] = useState<BulletImproverDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchResults() {
    if (!user) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, "bullet_improvements"),
        where("userId", "==", user.uid)
      );
      const snap = await getDocs(q);
      const docs = snap.docs.map(
        (d) =>
          ({
            id: d.id,
            ...d.data(),
            createdAt: d.data().createdAt?.toDate() || null,
          }) as BulletImproverDoc
      );
      // Sort in memory to avoid needing a Firestore composite index
      docs.sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
      setResults(docs);
      setError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("requires an index")) {
        setError("History is being prepared. Please try again in a few minutes.");
      } else {
        setError(msg || "Failed to load improvements");
      }
    } finally {
      setLoading(false);
    }
  }

  async function getResult(id: string): Promise<BulletImproverDoc | null> {
    const ref = doc(db, "bullet_improvements", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return {
      id: snap.id,
      ...snap.data(),
      createdAt: snap.data().createdAt?.toDate() || null,
    } as BulletImproverDoc;
  }

  async function deleteImprovement(id: string) {
    try {
      const ref = doc(db, "bullet_improvements", id);
      await deleteDoc(ref);
      setResults(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      console.error("Failed to delete", e);
      throw e;
    }
  }

  useEffect(() => {
    fetchResults();
  }, [user]);

  return { results, loading, error, refresh: fetchResults, getResult, deleteImprovement };
}
