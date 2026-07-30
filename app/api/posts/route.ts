import { NextRequest } from 'next/server';
import { handleGetPosts, handleCreatePost } from '@/controllers/postController';

export async function GET(req: NextRequest) {
  return handleGetPosts(req);
}

export async function POST(req: NextRequest) {
  return handleCreatePost(req);
}
