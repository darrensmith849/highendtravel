import { NextResponse } from 'next/server';
import { resetDemoStore } from '@/lib/demo-data';
import { resetAuditLogs } from '@/lib/audit';

export async function POST() {
  resetDemoStore();
  resetAuditLogs();
  return NextResponse.json({ success: true, message: 'Demo data reset successfully' });
}
