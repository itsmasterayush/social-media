import { NextRequest } from 'next/server';
import { handleLogin } from '@/controllers/authController';

export async function POST(req: NextRequest) {
  return handleLogin(req);
}
