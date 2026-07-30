'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { ILeaderboardPost } from '@/types/post';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { Flame, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<ILeaderboardPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/leaderboard');
        if (res.data.success && res.data.data?.leaderboard) {
          setLeaderboard(res.data.data.leaderboard);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-xs mb-3 border border-amber-500/20">
          <Trophy className="h-3.5 w-3.5" />
          Community Rankings
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Flame className="h-7 w-7 text-amber-500" />
          Top Posts Leaderboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Posts ranked by overall engagement score: <span className="font-semibold text-slate-700 dark:text-slate-300">Score = Likes + Views</span>
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <LeaderboardTable posts={leaderboard} />
      )}
    </div>
  );
}
