export interface NotionTripRecord {
  id: string;
  title: string;
  clientName: string;
  consultantOwner: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: string;
  internalNotes: string;
  hotelTargets: string[];
  travellers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NotionTravellerRecord {
  id: string;
  fullName: string;
  clientName: string;
  passportNationality: string;
  dietaryRequirements: string | null;
  specialRequests: string | null;
}

export interface NotionAdapter {
  getTripRecords(tenantId: string): Promise<NotionTripRecord[]>;
  getTripRecord(tenantId: string, tripId: string): Promise<NotionTripRecord | null>;
  getTravellerRecords(tenantId: string, clientName: string): Promise<NotionTravellerRecord[]>;
  searchTrips(tenantId: string, query: string): Promise<NotionTripRecord[]>;
}
