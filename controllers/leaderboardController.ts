import { NextRequest } from 'next/server';
import { getLeaderboard } from '@/services/leaderboardService';
import { successResponse, errorResponse } from '@/utils/apiResponse';

export async function handleGetLeaderboard(_req: NextRequest) {
  try {
    const leaderboard = await getLeaderboard();
    return successResponse({ leaderboard });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to load leaderboard', 500);
  }
}
