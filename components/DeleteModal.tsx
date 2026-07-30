'use client';

import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import api from '@/lib/api';
import { useToast } from './ui/Toast';
import { AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  onDeleteSuccess?: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  postId,
  onDeleteSuccess,
}) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await api.delete(`/posts/${postId}`);
      if (res.data.success) {
        showToast('Post deleted successfully', 'success');
        onClose();
        if (onDeleteSuccess) onDeleteSuccess();
      } else {
        showToast(res.data.message || 'Failed to delete post', 'error');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete post', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Post">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300">
          <AlertTriangle className="h-6 w-6 shrink-0 text-red-600 dark:text-red-400" />
          <p className="text-sm">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={loading}>
            Delete Post
          </Button>
        </div>
      </div>
    </Modal>
  );
};
