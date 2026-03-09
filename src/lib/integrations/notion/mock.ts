import { getDemoStore } from '@/lib/demo-data';
import type { NotionAdapter, NotionTripRecord, NotionTravellerRecord } from './types';

export class MockNotionAdapter implements NotionAdapter {
  async getTripRecords(tenantId: string): Promise<NotionTripRecord[]> {
    const store = getDemoStore();
    if (store.tenant.id !== tenantId) return [];

    return store.trips.map((trip) => this.mapTrip(trip.id));
  }

  async getTripRecord(tenantId: string, tripId: string): Promise<NotionTripRecord | null> {
    const store = getDemoStore();
    if (store.tenant.id !== tenantId) return null;
    const trip = store.trips.find((t) => t.id === tripId);
    if (!trip) return null;
    return this.mapTrip(tripId);
  }

  async getTravellerRecords(tenantId: string, clientName: string): Promise<NotionTravellerRecord[]> {
    const store = getDemoStore();
    if (store.tenant.id !== tenantId) return [];

    const client = store.clients.find((c) => c.full_name === clientName);
    if (!client) return [];

    return store.travellers
      .filter((t) => t.client_id === client.id)
      .map((t) => ({
        id: t.id,
        fullName: t.full_name,
        clientName: client.full_name,
        passportNationality: t.passport_nationality || 'Not provided',
        dietaryRequirements: t.dietary_requirements,
        specialRequests: t.special_requests,
      }));
  }

  async searchTrips(tenantId: string, query: string): Promise<NotionTripRecord[]> {
    const store = getDemoStore();
    if (store.tenant.id !== tenantId) return [];
    const q = query.toLowerCase();

    return store.trips
      .filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q)
      )
      .map((t) => this.mapTrip(t.id));
  }

  private mapTrip(tripId: string): NotionTripRecord {
    const store = getDemoStore();
    const trip = store.trips.find((t) => t.id === tripId)!;
    const client = store.clients.find((c) => c.id === trip.client_id)!;
    const consultant = store.users.find((u) => u.id === trip.consultant_id)!;
    const bookings = store.hotelBookings.filter((b) => b.trip_id === trip.id);
    const hotelTargets = bookings.map((b) => {
      const hotel = store.hotelContacts.find((h) => h.id === b.hotel_contact_id);
      return hotel?.hotel_name || 'Unknown';
    });
    const travellers = store.travellers
      .filter((t) => t.client_id === client.id)
      .map((t) => t.full_name);

    return {
      id: trip.id,
      title: trip.title,
      clientName: client.full_name,
      consultantOwner: consultant.full_name,
      destination: trip.destination,
      startDate: trip.start_date,
      endDate: trip.end_date,
      status: trip.status,
      internalNotes: trip.internal_notes || '',
      hotelTargets,
      travellers,
      createdAt: trip.created_at,
      updatedAt: trip.updated_at,
    };
  }
}
