import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/middleware/authMiddleware';
import { getUserDashboard } from '@/services/dashboardService';
import { successResponse, errorResponse } from '@/utils/apiResponse';

export async function handleGetDashboard(req: NextRequest) {
  try {
    const authUser = await authenticateRequest(req);
    if (!authUser) {
      return errorResponse('Unauthorized: Please log in to view dashboard', 401);
    }

    const dashboardData = await getUserDashboard(authUser.userId);
    return successResponse({ dashboard: dashboardData });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to load dashboard', 500);
  }
}
