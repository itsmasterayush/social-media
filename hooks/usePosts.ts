'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { IPost, PaginatedPosts } from '@/types/post';

export function usePosts(initialPage = 1, initialSearch = '') {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [search, setSearch] = useState<string>(initialSearch);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(0);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<any>(`/posts?page=${page}&limit=10&search=${encodeURIComponent(search)}`);
      if (res.data.success && res.data.data) {
        const data: PaginatedPosts = res.data.data;
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        setTotalPosts(data.totalPosts);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const likePost = async (postId: string) => {
    try {
      const res = await api.post(`/posts/${postId}/like`);
      if (res.data.success && res.data.data?.post) {
        const updatedPost: IPost = res.data.data.post;
        setPosts((prev) => prev.map((p) => (p._id === postId ? updatedPost : p)));
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Failed to like post' };
    }
  };

  return {
    posts,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    totalPages,
    totalPosts,
    refetch: fetchPosts,
    likePost,
  };
}
