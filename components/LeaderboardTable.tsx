'use client';

import React from 'react';
import Link from 'next/link';
import { ILeaderboardPost } from '@/types/post';
import { Trophy, Heart, Eye, Sparkles } from 'lucide-react';
import { Badge } from './ui/Badge';

interface LeaderboardTableProps {
  posts: ILeaderboardPost[];
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ posts }) => {
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 font-bold text-xs">
          <Trophy className="h-3.5 w-3.5" /> #1 Gold
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-300/20 text-slate-400 border border-slate-400/30 font-bold text-xs">
          <Trophy className="h-3.5 w-3.5" /> #2 Silver
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-700/20 text-amber-700 dark:text-amber-600 border border-amber-700/30 font-bold text-xs">
          <Trophy className="h-3.5 w-3.5" /> #3 Bronze
        </span>
      );
    }
    return <span className="font-semibold text-slate-500 dark:text-slate-400 text-sm">#{rank}</span>;
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
        <Sparkles className="mx-auto h-12 w-12 text-slate-400 mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-base">No top posts yet on the leaderboard!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/50 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
            <th className="px-6 py-4 font-bold">Rank</th>
            <th className="px-6 py-4 font-bold">Post Title</th>
            <th className="px-6 py-4 font-bold">Author</th>
            <th className="px-6 py-4 font-bold text-center">Likes</th>
            <th className="px-6 py-4 font-bold text-center">Views</th>
            <th className="px-6 py-4 font-bold text-right">Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
          {posts.map((post) => {
            const authorName = typeof post.author === 'object' ? post.author.name : 'Unknown Author';

            return (
              <tr
                key={post._id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">{getRankBadge(post.rank)}</td>
                <td className="px-6 py-4 max-w-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  <Link href={`/posts/${post._id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    {post.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                  {authorName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                    <Heart className="h-4 w-4 fill-rose-500" />
                    {post.likes}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-slate-600 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <Eye className="h-4 w-4 text-indigo-500" />
                    {post.views}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Badge variant="primary" className="text-sm px-3 py-1 font-bold">
                    {post.score} pts
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
