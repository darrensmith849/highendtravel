import { NextResponse, type NextRequest } from 'next/server';

// In mock/demo mode, we don't enforce Supabase auth middleware
// When live auth is enabled, swap to updateSession from @/lib/supabase/middleware
const IS_MOCK = process.env.NEXT_PUBLIC_INTEGRATION_MODE !== 'live';

export async function middleware(request: NextRequest) {
  if (IS_MOCK) {
    // In mock mode, allow all requests (auth is simulated)
    return NextResponse.next();
  }

  // Live mode: enforce Supabase auth
  const { updateSession } = await import('@/lib/supabase/middleware');
  return updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
