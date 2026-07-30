import { NextRequest } from 'next/server';
import { handleGetPostById, handleUpdatePost, handleDeletePost } from '@/controllers/postController';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return handleGetPostById(req, { params });
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return handleUpdatePost(req, { params });
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return handleDeletePost(req, { params });
}
