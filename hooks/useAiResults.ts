"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fetchAiResultById, fetchAiResults } from "@/utils/firestore-client";
import type { AiResultDoc, AiResultType } from "@/types";

export function useAiResults(type: AiResultType) {
  const { user } = useAuth();
  const [results, setResults] = useState<AiResultDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await fetchAiResults(user.uid, type);
      setResults(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [user, type]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getResult = useCallback(
    async (id: string) => {
      if (!user) return null;
      return fetchAiResultById(id, user.uid);
    },
    [user]
  );

  return { results, loading, error, refresh, getResult };
}
