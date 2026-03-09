import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { getDemoStore } from '@/lib/demo-data';
import { getCurrentUser, canChangeStatus } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!canChangeStatus(user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const store = getDemoStore();
  const booking = store.hotelBookings.find(
    (b) => b.id === id && b.tenant_id === user.tenant_id
  );

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  const oldStatus = booking.status;
  booking.status = body.status;
  booking.updated_at = new Date().toISOString();

  store.workflowEvents.push({
    id: uuid(),
    tenant_id: user.tenant_id,
    trip_id: booking.trip_id,
    hotel_booking_id: booking.id,
    from_status: oldStatus,
    to_status: body.status,
    changed_by: user.id,
    note: body.note || `Status updated to ${body.status}`,
    created_at: new Date().toISOString(),
  });

  await logAuditEvent({
    tenantId: user.tenant_id,
    userId: user.id,
    action: 'changed_status',
    resourceType: 'hotel_booking',
    resourceId: booking.id,
    metadata: { from: oldStatus, to: body.status },
  });

  return NextResponse.json(booking);
}
