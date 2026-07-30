'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { IPost } from '@/types/post';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { PostForm } from '@/components/PostForm';
import { PostInput } from '@/utils/validators';
import { Skeleton } from '@/components/ui/Skeleton';
import { Edit3, ArrowLeft } from 'lucide-react';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const postId = resolvedParams.id;

  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/posts/${postId}`);
        if (res.data.success && res.data.data?.post) {
          const fetchedPost: IPost = res.data.data.post;
          const authorId = typeof fetchedPost.author === 'object' ? fetchedPost.author._id : fetchedPost.author;
          
          if (user && authorId !== user._id) {
            showToast('Unauthorized: You can only edit your own posts', 'error');
            router.push(`/posts/${postId}`);
            return;
          }
          setPost(fetchedPost);
        }
      } catch (err: any) {
        showToast('Failed to load post for editing', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (postId && !authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchPost();
      }
    }
  }, [postId, user, authLoading, router, showToast]);

  const handleSubmit = async (data: PostInput) => {
    try {
      setSubmitting(true);
      const res = await api.put(`/posts/${postId}`, data);
      setSubmitting(false);

      if (res.data.success) {
        showToast('Post updated successfully!', 'success');
        router.push(`/posts/${postId}`);
      } else {
        showToast(res.data.message || 'Failed to update post', 'error');
      }
    } catch (err: any) {
      setSubmitting(false);
      showToast(err.response?.data?.message || 'Failed to update post', 'error');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 max-w-2xl mx-auto">
        <Link
          href={`/posts/${postId}`}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Edit3 className="h-6 w-6 text-indigo-500" />
            Edit Post
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Update your post title or content
          </p>
        </div>
      </div>

      <PostForm
        initialData={{ title: post.title, content: post.content }}
        onSubmit={handleSubmit}
        isLoading={submitting}
        submitText="Save Changes"
      />
    </div>
  );
}
