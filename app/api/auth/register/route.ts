import { NextRequest } from 'next/server';
import { handleRegister } from '@/controllers/authController';

export async function POST(req: NextRequest) {
  return handleRegister(req);
}
