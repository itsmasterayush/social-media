'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IPost } from '@/types/post';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from './ui/Toast';
import { Card } from './ui/Card';
import { Heart, Eye, Calendar, User, Edit3, Trash2 } from 'lucide-react';
import { formatDate, truncateText } from '@/lib/utils';
import { DeleteModal } from './DeleteModal';

interface PostCardProps {
  post: IPost;
  onLike?: (postId: string) => Promise<{ success: boolean; message?: string }>;
  onDeleteSuccess?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post: initialPost, onLike, onDeleteSuccess }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [post, setPost] = useState<IPost>(initialPost);
  const [liking, setLiking] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const authorId = typeof post.author === 'object' ? post.author._id : post.author;
  const authorName = typeof post.author === 'object' ? post.author.name : 'Unknown Author';
  const isAuthor = user ? user._id === authorId : false;
  const isLikedByCurrentUser = user ? post.likedBy?.includes(user._id) : false;

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast('Please log in to like posts', 'info');
      return;
    }

    if (isLikedByCurrentUser) {
      showToast('You have already liked this post', 'info');
      return;
    }

    if (onLike && !liking) {
      setLiking(true);
      // Instant optimistic update
      setPost((prev) => ({
        ...prev,
        likes: prev.likes + 1,
        likedBy: [...(prev.likedBy || []), user._id],
      }));

      const res = await onLike(post._id);
      setLiking(false);

      if (!res.success) {
        // Rollback on failure
        setPost(initialPost);
        showToast(res.message || 'Failed to like post', 'error');
      } else {
        showToast('Liked post!', 'success');
      }
    }
  };

  return (
    <>
      <Card className="group relative flex flex-col justify-between hover:shadow-lg dark:hover:border-indigo-500/30 transition-all duration-300">
        <div>
          {/* Header Metadata */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
            <div className="flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400">
              <User className="h-3.5 w-3.5" />
              <span>{authorName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/posts/${post._id}`} className="block">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
              {post.title}
            </h2>
          </Link>

          {/* Content Preview */}
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {truncateText(post.content, 140)}
          </p>
        </div>

        {/* Footer Actions & Counter Stats */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <button
              onClick={handleLikeClick}
              disabled={isLikedByCurrentUser || liking}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isLikedByCurrentUser
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 cursor-default'
                  : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-rose-950/60 dark:hover:text-rose-400'
              }`}
              title={isLikedByCurrentUser ? 'Already Liked' : 'Like Post'}
            >
              <Heart
                className={`h-4 w-4 transition-transform ${
                  isLikedByCurrentUser ? 'fill-rose-500 text-rose-500' : 'group-hover:scale-110'
                }`}
              />
              <span>{post.likes}</span>
            </button>

            {/* Views counter */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Eye className="h-4 w-4" />
              <span>{post.views} views</span>
            </div>
          </div>

          {/* Author Controls */}
          {isAuthor && (
            <div className="flex items-center gap-2">
              <Link href={`/posts/${post._id}/edit`}>
                <button
                  className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  title="Edit Post"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </Link>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Delete Post"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {isAuthor && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          postId={post._id}
          onDeleteSuccess={onDeleteSuccess}
        />
      )}
    </>
  );
};
