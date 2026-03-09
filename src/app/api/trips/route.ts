import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demo-data';
import { getCurrentUser } from '@/lib/auth';
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const store = getDemoStore();
  const trips = store.trips
    .filter((t) => t.tenant_id === user.tenant_id)
    .map((trip) => {
      const client = store.clients.find((c) => c.id === trip.client_id);
      const consultant = store.users.find((u) => u.id === trip.consultant_id);
      const bookings = store.hotelBookings.filter((b) => b.trip_id === trip.id);

      return {
        ...trip,
        client,
        consultant,
        hotel_bookings: bookings.map((b) => ({
          ...b,
          hotel_contact: store.hotelContacts.find((h) => h.id === b.hotel_contact_id),
        })),
      };
    });

  return NextResponse.json(trips);
}
