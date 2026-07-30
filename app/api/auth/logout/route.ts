import { handleLogout } from '@/controllers/authController';

export async function POST() {
  return handleLogout();
}
