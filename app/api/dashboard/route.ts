import { NextRequest } from 'next/server';
import { handleGetDashboard } from '@/controllers/dashboardController';

export async function GET(req: NextRequest) {
  return handleGetDashboard(req);
}
