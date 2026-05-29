"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fetchAllResumes, fetchResumeById } from "@/utils/firestore-client";
import type { ResumeDoc } from "@/types";

export function useResumes() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<ResumeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setResumes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await fetchAllResumes(user.uid);
      setResumes(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getResume = useCallback(
    async (id: string) => {
      if (!user) return null;
      return fetchResumeById(id, user.uid);
    },
    [user]
  );

  return { resumes, loading, error, refresh, getResume };
}
