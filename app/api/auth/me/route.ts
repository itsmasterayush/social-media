import { NextRequest } from 'next/server';
import { handleMe } from '@/controllers/authController';

export async function GET(req: NextRequest) {
  return handleMe(req);
}
