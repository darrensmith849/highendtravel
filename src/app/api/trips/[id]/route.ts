import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';
import { getCurrentUser } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const store = getDemoStore();
  const trip = store.trips.find(
    (t) => t.id === id && t.tenant_id === user.tenant_id
  );

  if (!trip) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await logAuditEvent({
    tenantId: user.tenant_id,
    userId: user.id,
    action: 'viewed_trip',
    resourceType: 'trip',
    resourceId: trip.id,
  });

  const client = store.clients.find((c) => c.id === trip.client_id);
  const consultant = store.users.find((u) => u.id === trip.consultant_id);
  const travellers = store.travellers.filter((t) => t.client_id === trip.client_id);
  const bookings = store.hotelBookings
    .filter((b) => b.trip_id === trip.id)
    .map((b) => ({
      ...b,
      hotel_contact: store.hotelContacts.find((h) => h.id === b.hotel_contact_id),
      email_drafts: store.emailDrafts.filter((e) => e.hotel_booking_id === b.id),
    }));
  const documents = store.documents.filter((d) => d.trip_id === trip.id);
  const preferences = store.preferences.filter((p) => p.trip_id === trip.id);
  const briefs = store.bookingBriefs.filter((b) => b.trip_id === trip.id);
  const events = store.workflowEvents
    .filter((e) => e.trip_id === trip.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json({
    ...trip,
    client,
    consultant,
    travellers,
    hotel_bookings: bookings,
    documents,
    preferences,
    briefs,
    workflow_events: events,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const store = getDemoStore();
  const trip = store.trips.find(
    (t) => t.id === id && t.tenant_id === user.tenant_id
  );

  if (!trip) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (body.status) {
    const oldStatus = trip.status;
    trip.status = body.status;
    trip.updated_at = new Date().toISOString();

    store.workflowEvents.push({
      id: crypto.randomUUID(),
      tenant_id: user.tenant_id,
      trip_id: trip.id,
      hotel_booking_id: null,
      from_status: oldStatus,
      to_status: body.status,
      changed_by: user.id,
      note: body.note || `Status changed to ${body.status}`,
      created_at: new Date().toISOString(),
    });

    await logAuditEvent({
      tenantId: user.tenant_id,
      userId: user.id,
      action: 'changed_status',
      resourceType: 'trip',
      resourceId: trip.id,
      metadata: { from: oldStatus, to: body.status },
    });
  }

  return NextResponse.json(trip);
}
