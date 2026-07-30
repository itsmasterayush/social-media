'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema, PostInput } from '@/utils/validators';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';

interface PostFormProps {
  initialData?: { title: string; content: string };
  onSubmit: (data: PostInput) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
}

export const PostForm: React.FC<PostFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitText = 'Submit Post',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
    },
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Title"
          placeholder="Enter an engaging post title..."
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Content
          </label>
          <textarea
            rows={8}
            placeholder="Write your story, thoughts, or ideas here..."
            className={`w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-400 ${
              errors.content ? 'border-red-500 focus:ring-red-500' : ''
            }`}
            {...register('content')}
          />
          {errors.content && (
            <p className="text-xs font-medium text-red-500 mt-1">{errors.content.message}</p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" size="lg" isLoading={isLoading}>
            {submitText}
          </Button>
        </div>
      </form>
    </Card>
  );
};
