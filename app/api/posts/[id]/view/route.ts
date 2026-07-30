import { NextRequest } from 'next/server';
import { handleIncrementView } from '@/controllers/postController';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return handleIncrementView(req, { params });
}
