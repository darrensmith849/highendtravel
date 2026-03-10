import { getDemoStore } from '@/lib/demo-data';
import type { UserProfile, UserRole } from '@/types/database';
import { USER_CONSULTANT_1_ID } from '@/lib/constants/seed-ids';
import { cookies } from 'next/headers';

const MOCK_USER_COOKIE = 'mock_user_id';

export async function getMockUserId(): Promise<string> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(MOCK_USER_COOKIE)?.value || USER_CONSULTANT_1_ID;
  } catch {
    return USER_CONSULTANT_1_ID;
  }
}

export async function setMockUserCookie(userId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(MOCK_USER_COOKIE, userId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  });
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  if (process.env.NEXT_PUBLIC_INTEGRATION_MODE !== 'live') {
    const userId = await getMockUserId();
    const store = getDemoStore();
    return store.users.find((u) => u.id === userId) || null;
  }
  return null;
}

export function hasRole(user: UserProfile, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(user.role);
}

export function canEditTrips(user: UserProfile): boolean {
  return hasRole(user, ['admin', 'consultant', 'operations']);
}

export function canGenerateBriefs(user: UserProfile): boolean {
  return hasRole(user, ['admin', 'consultant']);
}

export function canGenerateEmails(user: UserProfile): boolean {
  return hasRole(user, ['admin', 'consultant']);
}

export function canChangeStatus(user: UserProfile): boolean {
  return hasRole(user, ['admin', 'consultant', 'operations']);
}

export function canViewDocuments(user: UserProfile): boolean {
  return hasRole(user, ['admin', 'consultant', 'operations', 'viewer']);
}

export function isAdmin(user: UserProfile): boolean {
  return user.role === 'admin';
}
