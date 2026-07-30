'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { PostForm } from '@/components/PostForm';
import { PostInput } from '@/utils/validators';
import api from '@/lib/api';
import { PenSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreatePostPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      showToast('Please log in to create a post', 'info');
      router.push('/login');
    }
  }, [user, authLoading, router, showToast]);

  const handleSubmit = async (data: PostInput) => {
    try {
      setLoading(true);
      const res = await api.post('/posts', data);
      setLoading(false);

      if (res.data.success && res.data.data?.post) {
        showToast('Post created successfully!', 'success');
        router.push(`/posts/${res.data.data.post._id}`);
      } else {
        showToast(res.data.message || 'Failed to create post', 'error');
      }
    } catch (err: any) {
      setLoading(false);
      showToast(err.response?.data?.message || 'Failed to create post', 'error');
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <PenSquare className="h-6 w-6 text-indigo-500" />
            Create New Post
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Publish your article or discussion to the SocialPulse feed
          </p>
        </div>
      </div>

      <PostForm onSubmit={handleSubmit} isLoading={loading} submitText="Publish Post" />
    </div>
  );
}
