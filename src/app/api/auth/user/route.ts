import { NextResponse } from 'next/server';
import { getCurrentUser, setMockUserId } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(user);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (body.userId) {
    setMockUserId(body.userId);
  }
  const user = await getCurrentUser();
  return NextResponse.json(user);
}
