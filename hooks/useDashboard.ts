"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fetchDashboardStats } from "@/utils/firestore-client";
import type { DashboardStats } from "@/types";

const empty: DashboardStats = {
  latestAtsScore: null,
  chatCount: 0,
  recentActivity: [],
};

export function useDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setStats(empty);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardStats(user.uid);
      setStats(data);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to load dashboard. Deploy Firestore indexes."
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, loading, error, refresh };
}
