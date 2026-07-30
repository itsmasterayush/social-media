'use client';

import React from 'react';
import { IDashboardStats } from '@/types/post';
import { Card } from './ui/Card';
import { FileText, Heart, Eye, Sparkles } from 'lucide-react';
import { PostCard } from './PostCard';

interface DashboardStatsProps {
  stats: IDashboardStats;
  onRefresh?: () => void;
  onLikePost?: (postId: string) => Promise<{ success: boolean; message?: string }>;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, onRefresh, onLikePost }) => {
  const metricCards = [
    {
      label: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800',
    },
    {
      label: 'Likes Received',
      value: stats.totalLikes,
      icon: Heart,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800',
    },
    {
      label: 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {card.label}
                  </p>
                  <p className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3.5 rounded-2xl border ${card.bg}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Posts Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          My Recent Posts
        </h2>

        {!stats.recentPosts || stats.recentPosts.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              You haven't created any posts yet. Click "Create Post" to publish your first post!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.recentPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onLike={onLikePost}
                onDeleteSuccess={onRefresh}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
