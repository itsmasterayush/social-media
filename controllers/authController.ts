import { NextRequest } from 'next/server';
import { registerSchema, loginSchema } from '@/utils/validators';
import { registerUser, loginUser, getUserById } from '@/services/authService';
import { signToken } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/utils/apiResponse';
import { authenticateRequest } from '@/middleware/authMiddleware';

export async function handleRegister(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      const errorMessage = validation.error.errors[0]?.message || 'Invalid registration input';
      return errorResponse(errorMessage, 400);
    }

    const user = await registerUser(validation.data);
    const token = signToken({ userId: user._id, email: user.email, name: user.name });

    const response = successResponse({ user }, 201, 'Registration successful');
    
    // Set HttpOnly cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    return errorResponse(error.message || 'Registration failed', 400);
  }
}

export async function handleLogin(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      const errorMessage = validation.error.errors[0]?.message || 'Invalid login input';
      return errorResponse(errorMessage, 400);
    }

    const user = await loginUser(validation.data);
    const token = signToken({ userId: user._id, email: user.email, name: user.name });

    const response = successResponse({ user }, 200, 'Login successful');

    // Set HttpOnly cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    return errorResponse(error.message || 'Login failed', 401);
  }
}

export async function handleLogout() {
  const response = successResponse(null, 200, 'Logged out successfully');
  response.cookies.set('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}

export async function handleMe(req: NextRequest) {
  try {
    const userPayload = await authenticateRequest(req);
    if (!userPayload) {
      return errorResponse('Unauthorized', 401);
    }

    const user = await getUserById(userPayload.userId);
    if (!user) {
      return errorResponse('User not found', 444);
    }

    return successResponse({ user });
  } catch (error: any) {
    return errorResponse('Failed to fetch user profile', 500);
  }
}
