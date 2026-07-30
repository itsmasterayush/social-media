'use client';

import React from 'react';
import { usePosts } from '@/hooks/usePosts';
import { PostCard } from '@/components/PostCard';
import { SearchBar } from '@/components/SearchBar';
import { Pagination } from '@/components/Pagination';
import { PostCardSkeleton } from '@/components/ui/Skeleton';
import { Sparkles, FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const {
    posts,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    totalPages,
    totalPosts,
    refetch,
    likePost,
  } = usePosts(1, '');

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-indigo-500" />
            Feed & Trending Posts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover community posts, share ideas, and engage with top content.
          </p>
        </div>
        <Link href="/posts/create">
          <Button size="md" className="gap-2">
            Create New Post
          </Button>
        </Link>
      </div>

      {/* Real-time Search */}
      <SearchBar
        value={search}
        onChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        placeholder="Filter posts by title, content, or author..."
      />

      {/* Error state */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300 text-center">
          {error}
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        /* Empty state */
        <div className="text-center py-16 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 space-y-4">
          <FileQuestion className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No posts found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {search
              ? `No posts matched "${search}". Try searching for something else.`
              : 'Be the first person to publish a post on SocialPulse!'}
          </p>
          <Link href="/posts/create">
            <Button className="mt-2">Create First Post</Button>
          </Link>
        </div>
      ) : (
        /* Posts Feed Grid */
        <div className="space-y-6">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing {posts.length} of {totalPosts} posts
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onLike={likePost}
                onDeleteSuccess={refetch}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}
    </div>
  );
}
