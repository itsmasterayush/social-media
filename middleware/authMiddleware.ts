import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { JWTPayload } from '@/types/auth';

export async function authenticateRequest(req: NextRequest): Promise<JWTPayload | null> {
  try {
    // 1. Try reading token from HttpOnly cookie
    let token = req.cookies.get('token')?.value;

    // 2. Fallback to Authorization header: Bearer <token>
    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    return payload;
  } catch (error) {
    return null;
  }
}
