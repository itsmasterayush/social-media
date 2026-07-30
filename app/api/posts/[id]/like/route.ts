import { NextRequest } from 'next/server';
import { handleLikePost } from '@/controllers/postController';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return handleLikePost(req, { params });
}
