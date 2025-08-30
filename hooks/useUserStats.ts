import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserStats } from '@/types/database';

export function useUserStats(userId?: string) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchStats();
    }
  }, [userId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      // If no stats exist, create initial stats
      if (!data) {
        const initialStats = {
          user_id: userId!,
          total_notes: 0,
          completed_tasks: 0,
          brain_score: 0,
          streak_days: 0,
          last_activity: new Date().toISOString(),
        };

        const { data: newStats, error: insertError } = await supabase
          .from('user_stats')
          .insert(initialStats)
          .select()
          .single();

        if (insertError) throw insertError;
        setStats(newStats);
      } else {
        setStats(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats,
  };
}