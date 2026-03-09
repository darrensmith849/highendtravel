import { getDemoStore } from '@/lib/demo-data';
import { IS_MOCK } from '@/lib/constants/env';
import type { UserProfile, UserRole } from '@/types/database';
import { USER_CONSULTANT_1_ID } from '@/lib/constants/seed-ids';

// In mock mode, we use a simulated current user
// In live mode, this would come from Supabase Auth session
let _currentMockUserId = USER_CONSULTANT_1_ID;

export function setMockUserId(userId: string) {
  _currentMockUserId = userId;
}

export function getMockUserId(): string {
  return _currentMockUserId;
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  if (IS_MOCK) {
    const store = getDemoStore();
    return store.users.find((u) => u.id === _currentMockUserId) || null;
  }
  // In live mode, fetch from Supabase session
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
