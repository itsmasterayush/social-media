import { NextRequest } from 'next/server';
import { handleGetLeaderboard } from '@/controllers/leaderboardController';

export async function GET(req: NextRequest) {
  return handleGetLeaderboard(req);
}
