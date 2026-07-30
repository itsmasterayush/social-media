'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { IPost } from '@/types/post';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { DeleteModal } from '@/components/DeleteModal';
import { Heart, Eye, Calendar, User, ArrowLeft, Edit3, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const postId = resolvedParams.id;

  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [liking, setLiking] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchAndIncrementView = async () => {
      try {
        setLoading(true);
        // Call view endpoint which automatically handles 1 view per session
        const res = await api.post(`/posts/${postId}/view`);
        if (res.data.success && res.data.data?.post) {
          setPost(res.data.data.post);
        } else {
          // Fallback to fetch post directly if view route returns alternative response
          const getRes = await api.get(`/posts/${postId}`);
          if (getRes.data.success && getRes.data.data?.post) {
            setPost(getRes.data.data.post);
          } else {
            setError('Post not found');
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchAndIncrementView();
    }
  }, [postId]);

  const handleLike = async () => {
    if (!user) {
      showToast('Please log in to like posts', 'info');
      return;
    }

    if (isLikedByCurrentUser) {
      showToast('You have already liked this post', 'info');
      return;
    }

    if (post && !liking) {
      setLiking(true);
      // Optimistic update
      setPost((prev) =>
        prev
          ? {
              ...prev,
              likes: prev.likes + 1,
              likedBy: [...(prev.likedBy || []), user._id],
            }
          : null
      );

      try {
        const res = await api.post(`/posts/${postId}/like`);
        setLiking(false);
        if (res.data.success && res.data.data?.post) {
          setPost(res.data.data.post);
          showToast('Liked post!', 'success');
        } else {
          showToast(res.data.message || 'Failed to like', 'error');
        }
      } catch (err: any) {
        setLiking(false);
        showToast(err.response?.data?.message || 'Failed to like', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-6 w-32" />
        <Card className="space-y-4 p-8">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </Card>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Post Not Found</h2>
        <p className="text-sm text-slate-500">{error || "The requested post doesn't exist."}</p>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Feed
          </Button>
        </Link>
      </div>
    );
  }

  const authorId = typeof post.author === 'object' ? post.author._id : post.author;
  const authorName = typeof post.author === 'object' ? post.author.name : 'Unknown Author';
  const isAuthor = user ? user._id === authorId : false;
  const isLikedByCurrentUser = user ? post.likedBy?.includes(user._id) : false;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Feed
      </Link>

      <Card className="p-8 space-y-6 shadow-md">
        {/* Post Metadata & Author Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-base">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                <User className="h-3.5 w-3.5 text-indigo-500" />
                <span>{authorName}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Author Controls */}
          {isAuthor && (
            <div className="flex items-center gap-2">
              <Link href={`/posts/${post._id}/edit`}>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Edit3 className="h-4 w-4" /> Edit
                </Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteModalOpen(true)}
                className="gap-1.5"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          )}
        </div>

        {/* Post Title */}
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
          {post.title}
        </h1>

        {/* Post Content */}
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-line text-base leading-relaxed">
          {post.content}
        </div>

        {/* Stats & Interactive Like Button */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleLike}
            disabled={isLikedByCurrentUser || liking}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              isLikedByCurrentUser
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800 cursor-default'
                : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-rose-950 dark:hover:text-rose-400'
            }`}
          >
            <Heart
              className={`h-5 w-5 ${
                isLikedByCurrentUser ? 'fill-rose-500 text-rose-500' : 'text-rose-500'
              }`}
            />
            <span>{post.likes} Likes</span>
          </button>

          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <Eye className="h-5 w-5 text-indigo-500" />
            <span>{post.views} Views</span>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {isAuthor && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          postId={post._id}
          onDeleteSuccess={() => router.push('/')}
        />
      )}
    </div>
  );
}
