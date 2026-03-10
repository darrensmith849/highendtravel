import {
  type Tenant,
  type TenantSettings,
  type UserProfile,
  type Client,
  type Traveller,
  type Trip,
  type HotelContact,
  type HotelBooking,
  type EmailDraft,
  type Document,
  type TravelPreference,
  type BookingBrief,
  type WorkflowEvent,
  type IntegrationProvider,
  type ProviderConnection,
  type ProviderSyncRun,
  type ProviderFieldMapping,
  type EmailTemplate,
  type PromptConfig,
  type WorkflowRule,
} from '@/types/database';
import * as ids from '@/lib/constants/seed-ids';

const now = '2026-03-09T10:00:00Z';

// ============================================
// TENANT
// ============================================
export const demoTenant: Tenant = {
  id: ids.TENANT_ID,
  name: 'AlexTravels',
  slug: 'alextravels',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: now,
};

// ============================================
// USERS
// ============================================
export const demoUsers: UserProfile[] = [
  {
    id: ids.USER_ADMIN_ID,
    tenant_id: ids.TENANT_ID,
    email: 'celeste@alextravels.com',
    full_name: 'Celeste Marchand',
    role: 'admin',
    avatar_url: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.USER_CONSULTANT_1_ID,
    tenant_id: ids.TENANT_ID,
    email: 'sophie@alextravels.com',
    full_name: 'Sophie Lavigne',
    role: 'consultant',
    avatar_url: null,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.USER_CONSULTANT_2_ID,
    tenant_id: ids.TENANT_ID,
    email: 'james@alextravels.com',
    full_name: 'James Harrington',
    role: 'consultant',
    avatar_url: null,
    created_at: '2025-02-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.USER_OPS_ID,
    tenant_id: ids.TENANT_ID,
    email: 'elena@alextravels.com',
    full_name: 'Elena Vasquez',
    role: 'operations',
    avatar_url: null,
    created_at: '2025-01-10T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.USER_VIEWER_ID,
    tenant_id: ids.TENANT_ID,
    email: 'marcus@alextravels.com',
    full_name: 'Marcus Chen',
    role: 'viewer',
    avatar_url: null,
    created_at: '2025-03-01T00:00:00Z',
    updated_at: now,
  },
];

// ============================================
// CLIENTS
// ============================================
export const demoClients: Client[] = [
  {
    id: ids.CLIENT_1_ID,
    tenant_id: ids.TENANT_ID,
    full_name: 'Victoria & Edward Ashworth',
    email: 'victoria.ashworth@email.com',
    phone: '+44 20 7946 0958',
    company: 'Ashworth Holdings',
    notes: 'Celebrate 25th wedding anniversary. Prefer boutique properties, excellent wine cellars. No group tours.',
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2025-06-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.CLIENT_2_ID,
    tenant_id: ids.TENANT_ID,
    full_name: 'The Nakamura Family',
    email: 'kenji.nakamura@email.com',
    phone: '+1 415 555 0192',
    company: 'Nakamura Ventures',
    notes: 'Family of four including two children (ages 8 and 12). Interested in wildlife, cultural experiences. Children have nut allergies.',
    created_by: ids.USER_CONSULTANT_2_ID,
    created_at: '2025-07-15T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.CLIENT_3_ID,
    tenant_id: ids.TENANT_ID,
    full_name: 'Isabelle Fontaine-Deschamps',
    email: 'isabelle.fd@email.com',
    phone: '+33 1 42 68 5300',
    company: null,
    notes: 'Solo traveller. Art curator. Prefers historic villas with privacy. Vegetarian. Speaks French, English, Italian.',
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2025-08-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.CLIENT_4_ID,
    tenant_id: ids.TENANT_ID,
    full_name: 'Henrik & Astrid Lindqvist',
    email: 'henrik.lindqvist@email.com',
    phone: '+46 8 555 0147',
    company: 'Lindqvist Capital',
    notes: 'Newly married couple. First luxury holiday together. Love skiing, spa, fine dining. No budget constraints.',
    created_by: ids.USER_CONSULTANT_2_ID,
    created_at: '2025-09-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.CLIENT_5_ID,
    tenant_id: ids.TENANT_ID,
    full_name: 'Oliver & Diana Pemberton',
    email: 'oliver.pemberton@email.com',
    phone: '+44 20 7123 4567',
    company: 'Pemberton & Associates',
    notes: 'Experienced safari travellers. Want exclusive access, private guides, luxury camps. Keen photographers.',
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2025-10-01T00:00:00Z',
    updated_at: now,
  },
];

// ============================================
// TRAVELLERS
// ============================================
export const demoTravellers: Traveller[] = [
  // Ashworths
  {
    id: '31000000-0000-0000-0000-000000000001',
    tenant_id: ids.TENANT_ID,
    client_id: ids.CLIENT_1_ID,
    full_name: 'Victoria Ashworth',
    date_of_birth: '1975-04-12',
    passport_nationality: 'British',
    dietary_requirements: 'No shellfish',
    special_requests: 'Prefers high floor rooms',
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2025-06-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: '31000000-0000-0000-0000-000000000002',
    tenant_id: ids.TENANT_ID,
    client_id: ids.CLIENT_1_ID,
    full_name: 'Edward Ashworth',
    date_of_birth: '1973-11-28',
    passport_nationality: 'British',
    dietary_requirements: null,
    special_requests: 'Wine enthusiast - arrange tastings where possible',
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2025-06-01T00:00:00Z',
    updated_at: now,
  },
  // Nakamura Family
  {
    id: '31000000-0000-0000-0000-000000000003',
    tenant_id: ids.TENANT_ID,
    client_id: ids.CLIENT_2_ID,
    full_name: 'Kenji Nakamura',
    date_of_birth: '1982-07-19',
    passport_nationality: 'American',
    dietary_requirements: null,
    special_requests: null,
    created_by: ids.USER_CONSULTANT_2_ID,
    created_at: '2025-07-15T00:00:00Z',
    updated_at: now,
  },
  {
    id: '31000000-0000-0000-0000-000000000004',
    tenant_id: ids.TENANT_ID,
    client_id: ids.CLIENT_2_ID,
    full_name: 'Yuki Nakamura',
    date_of_birth: '1984-02-05',
    passport_nationality: 'American',
    dietary_requirements: null,
    special_requests: null,
    created_by: ids.USER_CONSULTANT_2_ID,
    created_at: '2025-07-15T00:00:00Z',
    updated_at: now,
  },
  {
    id: '31000000-0000-0000-0000-000000000005',
    tenant_id: ids.TENANT_ID,
    client_id: ids.CLIENT_2_ID,
    full_name: 'Hana Nakamura',
    date_of_birth: '2014-09-14',
    passport_nationality: 'American',
    dietary_requirements: 'Nut allergy (severe)',
    special_requests: null,
    created_by: ids.USER_CONSULTANT_2_ID,
    created_at: '2025-07-15T00:00:00Z',
    updated_at: now,
  },
  {
    id: '31000000-0000-0000-0000-000000000006',
    tenant_id: ids.TENANT_ID,
    client_id: ids.CLIENT_2_ID,
    full_name: 'Ren Nakamura',
    date_of_birth: '2018-03-22',
    passport_nationality: 'American',
    dietary_requirements: 'Nut allergy (severe)',
    special_requests: null,
    created_by: ids.USER_CONSULTANT_2_ID,
    created_at: '2025-07-15T00:00:00Z',
    updated_at: now,
  },
  // Isabelle
  {
    id: '31000000-0000-0000-0000-000000000007',
    tenant_id: ids.TENANT_ID,
    client_id: ids.CLIENT_3_ID,
    full_name: 'Isabelle Fontaine-Deschamps',
    date_of_birth: '1988-06-30',
    passport_nationality: 'French',
    dietary_requirements: 'Vegetarian',
    special_requests: 'Art gallery access, private cultural tours preferred',
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2025-08-01T00:00:00Z',
    updated_at: now,
  },
  // Lindqvists
  {
    id: '31000000-0000-0000-0000-000000000008',
    tenant_id: ids.TENANT_ID,
    client_id: ids.CLIENT_4_ID,
    full_name: 'Henrik Lindqvist',
    date_of_birth: '1990-12-03',
    passport_nationality: 'Swedish',
    dietary_requirements: null,
    special_requests: 'Advanced skier',
    created_by: ids.USER_CONSULTANT_2_ID,
    created_at: '2025-09-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: '31000000-0000-0000-0000-000000000009',
    tenant_id: ids.TENANT_ID,
    client_id: ids.CLIENT_4_ID,
    full_name: 'Astrid Lindqvist',
    date_of_birth: '1992-05-17',
    passport_nationality: 'Swedish',
    dietary_requirements: 'Gluten-free',
    special_requests: 'Spa treatments, preferably couples packages',
    created_by: ids.USER_CONSULTANT_2_ID,
    created_at: '2025-09-01T00:00:00Z',
    updated_at: now,
  },
  // Pembertons
  {
    id: '31000000-0000-0000-0000-000000000010',
    tenant_id: ids.TENANT_ID,
    client_id: ids.CLIENT_5_ID,
    full_name: 'Oliver Pemberton',
    date_of_birth: '1970-08-25',
    passport_nationality: 'British',
    dietary_requirements: null,
    special_requests: 'Photography hides, early morning game drives',
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2025-10-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: '31000000-0000-0000-0000-000000000011',
    tenant_id: ids.TENANT_ID,
    client_id: ids.CLIENT_5_ID,
    full_name: 'Diana Pemberton',
    date_of_birth: '1972-01-14',
    passport_nationality: 'British',
    dietary_requirements: 'Pescatarian',
    special_requests: 'Bird watching, nature walks',
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2025-10-01T00:00:00Z',
    updated_at: now,
  },
];

// ============================================
// HOTEL CONTACTS
// ============================================
export const demoHotelContacts: HotelContact[] = [
  {
    id: ids.HOTEL_1_ID,
    tenant_id: ids.TENANT_ID,
    hotel_name: 'Castello di Velona Resort',
    contact_name: 'Marco Bellini',
    contact_email: 'reservations@castellodevelona.com',
    phone: '+39 0577 839002',
    location: 'Montalcino, Tuscany',
    category: 'Luxury Estate',
    notes: 'Excellent wine programme. Michelin-starred restaurant. 30-day advance booking recommended.',
    created_by: ids.USER_OPS_ID,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.HOTEL_2_ID,
    tenant_id: ids.TENANT_ID,
    hotel_name: 'Rosewood Cape Kidnappers',
    contact_name: 'Sarah Mitchell',
    contact_email: 'reservations@rosewoodck.com',
    phone: '+27 21 431 4511',
    location: 'Cape Town, South Africa',
    category: 'Luxury Lodge',
    notes: 'Stunning clifftop location. Golf course. Family-friendly suites available.',
    created_by: ids.USER_OPS_ID,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.HOTEL_3_ID,
    tenant_id: ids.TENANT_ID,
    hotel_name: 'Singita Kruger National Park',
    contact_name: 'Thabo Mokoena',
    contact_email: 'reservations@singita.com',
    phone: '+27 21 683 3424',
    location: 'Kruger, South Africa',
    category: 'Safari Lodge',
    notes: 'Ultra-luxury safari. Private guides. Minimum 3-night stay. Child policy varies by lodge.',
    created_by: ids.USER_OPS_ID,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.HOTEL_4_ID,
    tenant_id: ids.TENANT_ID,
    hotel_name: 'Villa Treville',
    contact_name: 'Giulia Romano',
    contact_email: 'concierge@villatreville.com',
    phone: '+39 089 812 2444',
    location: 'Positano, Amalfi Coast',
    category: 'Private Villa',
    notes: 'Former private estate. Only 6 suites. Exclusive-use options available. Cliffside infinity pool.',
    created_by: ids.USER_OPS_ID,
    created_at: '2025-02-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.HOTEL_5_ID,
    tenant_id: ids.TENANT_ID,
    hotel_name: 'The Alpina Gstaad',
    contact_name: 'Lukas Brunner',
    contact_email: 'reservations@thealpinagstaad.ch',
    phone: '+41 33 888 98 88',
    location: 'Gstaad, Switzerland',
    category: 'Mountain Resort',
    notes: 'Six Senses Spa. Private ski instructor arrangements. Cigar lounge. Michelin dining.',
    created_by: ids.USER_OPS_ID,
    created_at: '2025-02-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.HOTEL_6_ID,
    tenant_id: ids.TENANT_ID,
    hotel_name: 'andBeyond Ngorongoro Crater Lodge',
    contact_name: 'Grace Mwangi',
    contact_email: 'reservations@andbeyond.com',
    phone: '+27 11 809 4300',
    location: 'Ngorongoro, Tanzania',
    category: 'Safari Lodge',
    notes: 'Crater rim location. Baroque-meets-Maasai décor. Butler service. Crater floor game drives.',
    created_by: ids.USER_OPS_ID,
    created_at: '2025-02-15T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.HOTEL_7_ID,
    tenant_id: ids.TENANT_ID,
    hotel_name: 'Segera Retreat',
    contact_name: 'Daniel Oduya',
    contact_email: 'info@segera.com',
    phone: '+254 20 600 3090',
    location: 'Laikipia, Kenya',
    category: 'Conservation Retreat',
    notes: 'Art collection on-site. Conservation-focused. Horse riding, helicopter safaris available.',
    created_by: ids.USER_OPS_ID,
    created_at: '2025-02-15T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.HOTEL_8_ID,
    tenant_id: ids.TENANT_ID,
    hotel_name: 'Borgo Santo Pietro',
    contact_name: 'Francesca De Luca',
    contact_email: 'info@borgosantopietro.com',
    phone: '+39 0577 751 222',
    location: 'Chiusdino, Tuscany',
    category: 'Luxury Estate',
    notes: 'Organic farm. Cooking classes. Spa with garden botanicals. Intimate and romantic.',
    created_by: ids.USER_OPS_ID,
    created_at: '2025-03-01T00:00:00Z',
    updated_at: now,
  },
];

// ============================================
// TRIPS
// ============================================
export const demoTrips: Trip[] = [
  {
    id: ids.TRIP_1_ID,
    tenant_id: ids.TENANT_ID,
    client_id: ids.CLIENT_1_ID,
    title: 'Tuscany Anniversary Escape',
    destination: 'Tuscany, Italy',
    start_date: '2026-06-15',
    end_date: '2026-06-25',
    status: 'draft_created',
    internal_notes: 'Silver wedding anniversary celebration. Focus on wine, gastronomy, and romance. Edward mentioned wanting a private truffle hunting experience.',
    consultant_id: ids.USER_CONSULTANT_1_ID,
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2026-01-10T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.TRIP_2_ID,
    tenant_id: ids.TENANT_ID,
    client_id: ids.CLIENT_2_ID,
    title: 'Cape & Safari Family Journey',
    destination: 'South Africa',
    start_date: '2026-07-20',
    end_date: '2026-08-03',
    status: 'brief_ready',
    internal_notes: 'Family trip with children. Must ensure nut-free dining at all properties. Kids aged 8 and 12 - check age policies at safari lodges. Parents want mix of adventure and relaxation.',
    consultant_id: ids.USER_CONSULTANT_2_ID,
    created_by: ids.USER_CONSULTANT_2_ID,
    created_at: '2026-01-20T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.TRIP_3_ID,
    tenant_id: ids.TENANT_ID,
    client_id: ids.CLIENT_3_ID,
    title: 'Amalfi Private Villa Itinerary',
    destination: 'Amalfi Coast, Italy',
    start_date: '2026-09-05',
    end_date: '2026-09-15',
    status: 'not_started',
    internal_notes: 'Solo art-focused trip. Isabelle wants to visit ceramics workshops in Vietri sul Mare. Arrange private boat to Capri. Vegetarian dining focus.',
    consultant_id: ids.USER_CONSULTANT_1_ID,
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2026-02-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.TRIP_4_ID,
    tenant_id: ids.TENANT_ID,
    client_id: ids.CLIENT_4_ID,
    title: 'Swiss Winter Honeymoon',
    destination: 'Gstaad, Switzerland',
    start_date: '2026-12-20',
    end_date: '2027-01-03',
    status: 'sent',
    internal_notes: 'Honeymoon trip. Henrik is an advanced skier, Astrid intermediate. Want couples spa, private dining, and New Year\'s Eve celebration at hotel.',
    consultant_id: ids.USER_CONSULTANT_2_ID,
    created_by: ids.USER_CONSULTANT_2_ID,
    created_at: '2026-02-15T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.TRIP_5_ID,
    tenant_id: ids.TENANT_ID,
    client_id: ids.CLIENT_5_ID,
    title: 'East Africa Multi-Property Safari',
    destination: 'Kenya & Tanzania',
    start_date: '2026-08-10',
    end_date: '2026-08-24',
    status: 'awaiting_reply',
    internal_notes: 'Experienced safari couple. Want exclusive camp access, photography hides, and conservation experiences. Oliver shoots with Canon R5 - check if photography guides available.',
    consultant_id: ids.USER_CONSULTANT_1_ID,
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2026-02-20T00:00:00Z',
    updated_at: now,
  },
];

// ============================================
// HOTEL BOOKINGS
// ============================================
export const demoHotelBookings: HotelBooking[] = [
  // Trip 1: Tuscany
  {
    id: ids.BOOKING_1_ID,
    tenant_id: ids.TENANT_ID,
    trip_id: ids.TRIP_1_ID,
    hotel_contact_id: ids.HOTEL_1_ID,
    check_in: '2026-06-15',
    check_out: '2026-06-20',
    room_type: 'Grand Suite with vineyard view',
    guests: 2,
    status: 'draft_created',
    special_requests: 'Anniversary cake on arrival. Wine tasting arranged for Day 2. Late checkout if possible.',
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2026-01-10T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.BOOKING_2_ID,
    tenant_id: ids.TENANT_ID,
    trip_id: ids.TRIP_1_ID,
    hotel_contact_id: ids.HOTEL_8_ID,
    check_in: '2026-06-20',
    check_out: '2026-06-25',
    room_type: 'Garden Suite',
    guests: 2,
    status: 'not_started',
    special_requests: 'Cooking class booking. Spa treatments for two on arrival day.',
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2026-01-10T00:00:00Z',
    updated_at: now,
  },
  // Trip 2: Cape & Safari
  {
    id: ids.BOOKING_3_ID,
    tenant_id: ids.TENANT_ID,
    trip_id: ids.TRIP_2_ID,
    hotel_contact_id: ids.HOTEL_2_ID,
    check_in: '2026-07-20',
    check_out: '2026-07-25',
    room_type: 'Family Suite',
    guests: 4,
    status: 'brief_ready',
    special_requests: 'Nut-free dining throughout stay. Kids club enrolment. Interconnecting rooms if suite unavailable.',
    created_by: ids.USER_CONSULTANT_2_ID,
    created_at: '2026-01-20T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.BOOKING_4_ID,
    tenant_id: ids.TENANT_ID,
    trip_id: ids.TRIP_2_ID,
    hotel_contact_id: ids.HOTEL_3_ID,
    check_in: '2026-07-25',
    check_out: '2026-08-03',
    room_type: 'Lebombo Suite',
    guests: 4,
    status: 'brief_ready',
    special_requests: 'Confirm child age policy. Nut-free meals. Private game drives. Kids safari programme.',
    created_by: ids.USER_CONSULTANT_2_ID,
    created_at: '2026-01-20T00:00:00Z',
    updated_at: now,
  },
  // Trip 3: Amalfi
  {
    id: ids.BOOKING_5_ID,
    tenant_id: ids.TENANT_ID,
    trip_id: ids.TRIP_3_ID,
    hotel_contact_id: ids.HOTEL_4_ID,
    check_in: '2026-09-05',
    check_out: '2026-09-15',
    room_type: 'Sea View Suite',
    guests: 1,
    status: 'not_started',
    special_requests: 'Vegetarian menu. Private boat arrangement to Capri. Ceramics workshop coordination.',
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2026-02-01T00:00:00Z',
    updated_at: now,
  },
  // Trip 4: Swiss Honeymoon
  {
    id: ids.BOOKING_6_ID,
    tenant_id: ids.TENANT_ID,
    trip_id: ids.TRIP_4_ID,
    hotel_contact_id: ids.HOTEL_5_ID,
    check_in: '2026-12-20',
    check_out: '2027-01-03',
    room_type: 'Panorama Suite',
    guests: 2,
    status: 'sent',
    special_requests: 'Honeymoon package. Private ski instructor (advanced and intermediate). New Year\'s Eve gala dinner. Couples spa daily.',
    created_by: ids.USER_CONSULTANT_2_ID,
    created_at: '2026-02-15T00:00:00Z',
    updated_at: now,
  },
  // Trip 5: East Africa Safari
  {
    id: ids.BOOKING_7_ID,
    tenant_id: ids.TENANT_ID,
    trip_id: ids.TRIP_5_ID,
    hotel_contact_id: ids.HOTEL_6_ID,
    check_in: '2026-08-10',
    check_out: '2026-08-17',
    room_type: 'Tree House Suite',
    guests: 2,
    status: 'awaiting_reply',
    special_requests: 'Photography guide. Crater floor private picnic. Pescatarian dining for Diana. Early morning game drives.',
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2026-02-20T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.BOOKING_8_ID,
    tenant_id: ids.TENANT_ID,
    trip_id: ids.TRIP_5_ID,
    hotel_contact_id: ids.HOTEL_7_ID,
    check_in: '2026-08-17',
    check_out: '2026-08-24',
    room_type: 'Villa One',
    guests: 2,
    status: 'awaiting_reply',
    special_requests: 'Photography hides. Horse safari. Conservation tour. Helicopter safari over Laikipia Plateau.',
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2026-02-20T00:00:00Z',
    updated_at: now,
  },
];

// ============================================
// EMAIL DRAFTS
// ============================================
export const demoEmailDrafts: EmailDraft[] = [
  {
    id: '70000000-0000-0000-0000-000000000001',
    tenant_id: ids.TENANT_ID,
    hotel_booking_id: ids.BOOKING_1_ID,
    subject: 'Reservation Enquiry — Ashworth, June 15–20, Grand Suite',
    body: `Dear Marco,

I hope this message finds you well. I am writing on behalf of my clients, Mr & Mrs Edward Ashworth, who are celebrating their 25th wedding anniversary.

We would like to enquire about availability for the Grand Suite with vineyard view from 15th to 20th June 2026.

A few details to share:
- Anniversary celebration — an arrival cake and floral arrangement would be appreciated
- Mr Ashworth is a dedicated wine enthusiast; we'd love to arrange a private tasting with your sommelier
- Late checkout on departure day if available
- No shellfish for Mrs Ashworth

Please confirm availability and your best rate for this period.

Warm regards,
Sophie Lavigne
AlexTravels`,
    to_email: 'reservations@castellodevelona.com',
    status: 'draft',
    gmail_draft_id: 'mock-draft-001',
    sent_at: null,
    reply_received_at: null,
    reply_body: null,
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2026-03-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: '70000000-0000-0000-0000-000000000002',
    tenant_id: ids.TENANT_ID,
    hotel_booking_id: ids.BOOKING_6_ID,
    subject: 'Honeymoon Booking — Lindqvist, Dec 20 – Jan 3, Panorama Suite',
    body: `Dear Lukas,

I trust you are keeping well. I'm reaching out regarding a honeymoon booking for my clients, Henrik & Astrid Lindqvist.

They are looking to stay in the Panorama Suite from 20th December 2026 to 3rd January 2027.

Key requests:
- Full honeymoon package including champagne on arrival, turndown amenities
- Private ski instructor: Henrik (advanced), Astrid (intermediate) — mornings preferred
- Couples spa treatments daily, ideally late afternoon
- New Year's Eve gala dinner — best table available
- Gluten-free dining options for Mrs Lindqvist

Please advise on availability, honeymoon package details, and rates.

Kind regards,
James Harrington
AlexTravels`,
    to_email: 'reservations@thealpinagstaad.ch',
    status: 'sent',
    gmail_draft_id: 'mock-draft-002',
    sent_at: '2026-03-05T14:30:00Z',
    reply_received_at: null,
    reply_body: null,
    created_by: ids.USER_CONSULTANT_2_ID,
    created_at: '2026-03-04T00:00:00Z',
    updated_at: now,
  },
  {
    id: '70000000-0000-0000-0000-000000000003',
    tenant_id: ids.TENANT_ID,
    hotel_booking_id: ids.BOOKING_7_ID,
    subject: 'Booking Enquiry — Pemberton, Aug 10–17, Tree House Suite',
    body: `Dear Grace,

I hope you are well. I'm writing to enquire about the Tree House Suite for my clients, Oliver & Diana Pemberton, from 10th to 17th August 2026.

The Pembertons are experienced safari travellers and keen photographers. Key details:
- Oliver shoots with a Canon R5 — is a dedicated photography guide available?
- Private crater floor picnic arrangement
- Pescatarian dining for Mrs Pemberton
- Early morning game drives (5:30am departures preferred)
- Bird watching guide for Diana

Please confirm availability and share your current rates.

Best regards,
Sophie Lavigne
AlexTravels`,
    to_email: 'reservations@andbeyond.com',
    status: 'sent',
    gmail_draft_id: 'mock-draft-003',
    sent_at: '2026-03-06T10:00:00Z',
    reply_received_at: '2026-03-08T09:15:00Z',
    reply_body: `Dear Sophie,

Thank you for your enquiry. We are delighted to confirm availability for the Tree House Suite from 10th to 17th August 2026.

I can confirm the following:
- Photography guide: Yes, we have an excellent wildlife photography guide, Joseph Maasai, available for the full stay
- Crater floor picnic: Confirmed for Day 3, weather permitting
- Pescatarian dining: Our chef will prepare a bespoke menu for Mrs Pemberton
- Early morning drives: 5:30am departures confirmed with private vehicle

Rate: USD 2,850 per person per night (all-inclusive)

Shall I proceed with a provisional hold?

Warm regards,
Grace Mwangi
andBeyond Ngorongoro Crater Lodge`,
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2026-03-05T00:00:00Z',
    updated_at: now,
  },
];

// ============================================
// DOCUMENTS
// ============================================
export const demoDocuments: Document[] = [
  {
    id: '80000000-0000-0000-0000-000000000001',
    tenant_id: ids.TENANT_ID,
    trip_id: ids.TRIP_1_ID,
    file_name: 'Ashworth_Travel_Preferences.pdf',
    file_type: 'application/pdf',
    sharefile_id: 'mock-sf-001',
    status: 'completed',
    category: 'preference_form',
    url: null,
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2025-12-15T00:00:00Z',
    updated_at: now,
  },
  {
    id: '80000000-0000-0000-0000-000000000002',
    tenant_id: ids.TENANT_ID,
    trip_id: ids.TRIP_1_ID,
    file_name: 'Ashworth_Passports.pdf',
    file_type: 'application/pdf',
    sharefile_id: 'mock-sf-002',
    status: 'completed',
    category: 'travel_documents',
    url: null,
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2026-01-05T00:00:00Z',
    updated_at: now,
  },
  {
    id: '80000000-0000-0000-0000-000000000003',
    tenant_id: ids.TENANT_ID,
    trip_id: ids.TRIP_2_ID,
    file_name: 'Nakamura_Family_Preferences.pdf',
    file_type: 'application/pdf',
    sharefile_id: 'mock-sf-003',
    status: 'completed',
    category: 'preference_form',
    url: null,
    created_by: ids.USER_CONSULTANT_2_ID,
    created_at: '2026-01-10T00:00:00Z',
    updated_at: now,
  },
  {
    id: '80000000-0000-0000-0000-000000000004',
    tenant_id: ids.TENANT_ID,
    trip_id: ids.TRIP_2_ID,
    file_name: 'Nakamura_Medical_Allergy_Info.pdf',
    file_type: 'application/pdf',
    sharefile_id: 'mock-sf-004',
    status: 'completed',
    category: 'medical',
    url: null,
    created_by: ids.USER_CONSULTANT_2_ID,
    created_at: '2026-01-12T00:00:00Z',
    updated_at: now,
  },
  {
    id: '80000000-0000-0000-0000-000000000005',
    tenant_id: ids.TENANT_ID,
    trip_id: ids.TRIP_3_ID,
    file_name: 'Fontaine_Deschamps_Preferences.pdf',
    file_type: 'application/pdf',
    sharefile_id: null,
    status: 'missing',
    category: 'preference_form',
    url: null,
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2026-02-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: '80000000-0000-0000-0000-000000000006',
    tenant_id: ids.TENANT_ID,
    trip_id: ids.TRIP_4_ID,
    file_name: 'Lindqvist_Travel_Preferences.pdf',
    file_type: 'application/pdf',
    sharefile_id: 'mock-sf-006',
    status: 'completed',
    category: 'preference_form',
    url: null,
    created_by: ids.USER_CONSULTANT_2_ID,
    created_at: '2026-02-20T00:00:00Z',
    updated_at: now,
  },
  {
    id: '80000000-0000-0000-0000-000000000007',
    tenant_id: ids.TENANT_ID,
    trip_id: ids.TRIP_5_ID,
    file_name: 'Pemberton_Safari_Preferences.pdf',
    file_type: 'application/pdf',
    sharefile_id: 'mock-sf-007',
    status: 'completed',
    category: 'preference_form',
    url: null,
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2026-02-25T00:00:00Z',
    updated_at: now,
  },
  {
    id: '80000000-0000-0000-0000-000000000008',
    tenant_id: ids.TENANT_ID,
    trip_id: ids.TRIP_5_ID,
    file_name: 'Pemberton_Travel_Insurance.pdf',
    file_type: 'application/pdf',
    sharefile_id: 'mock-sf-008',
    status: 'pending',
    category: 'insurance',
    url: null,
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2026-03-01T00:00:00Z',
    updated_at: now,
  },
];

// ============================================
// TRAVEL PREFERENCES
// ============================================
export const demoPreferences: TravelPreference[] = [
  // Ashworths
  { id: '90000000-0000-0000-0000-000000000001', tenant_id: ids.TENANT_ID, trip_id: ids.TRIP_1_ID, category: 'dining', preference_key: 'Cuisine preference', preference_value: 'Italian, French. No shellfish (Victoria).', created_by: ids.USER_CONSULTANT_1_ID, created_at: '2026-01-10T00:00:00Z', updated_at: now },
  { id: '90000000-0000-0000-0000-000000000002', tenant_id: ids.TENANT_ID, trip_id: ids.TRIP_1_ID, category: 'accommodation', preference_key: 'Room type', preference_value: 'Suite with view. High floor. King bed. Quiet location.', created_by: ids.USER_CONSULTANT_1_ID, created_at: '2026-01-10T00:00:00Z', updated_at: now },
  { id: '90000000-0000-0000-0000-000000000003', tenant_id: ids.TENANT_ID, trip_id: ids.TRIP_1_ID, category: 'activities', preference_key: 'Interests', preference_value: 'Wine tasting, truffle hunting, cooking classes, spa.', created_by: ids.USER_CONSULTANT_1_ID, created_at: '2026-01-10T00:00:00Z', updated_at: now },
  // Nakamuras
  { id: '90000000-0000-0000-0000-000000000004', tenant_id: ids.TENANT_ID, trip_id: ids.TRIP_2_ID, category: 'dietary', preference_key: 'Allergies', preference_value: 'Severe nut allergy (both children). Must be communicated to all properties.', created_by: ids.USER_CONSULTANT_2_ID, created_at: '2026-01-20T00:00:00Z', updated_at: now },
  { id: '90000000-0000-0000-0000-000000000005', tenant_id: ids.TENANT_ID, trip_id: ids.TRIP_2_ID, category: 'activities', preference_key: 'Family activities', preference_value: 'Wildlife viewing, cultural experiences, beach days. Kids programme at each property.', created_by: ids.USER_CONSULTANT_2_ID, created_at: '2026-01-20T00:00:00Z', updated_at: now },
  // Isabelle
  { id: '90000000-0000-0000-0000-000000000006', tenant_id: ids.TENANT_ID, trip_id: ids.TRIP_3_ID, category: 'dining', preference_key: 'Diet', preference_value: 'Strict vegetarian. Appreciates farm-to-table cuisine.', created_by: ids.USER_CONSULTANT_1_ID, created_at: '2026-02-01T00:00:00Z', updated_at: now },
  { id: '90000000-0000-0000-0000-000000000007', tenant_id: ids.TENANT_ID, trip_id: ids.TRIP_3_ID, category: 'activities', preference_key: 'Cultural interests', preference_value: 'Art galleries, ceramics workshops, private cultural tours. Speaks French, English, Italian.', created_by: ids.USER_CONSULTANT_1_ID, created_at: '2026-02-01T00:00:00Z', updated_at: now },
  // Lindqvists
  { id: '90000000-0000-0000-0000-000000000008', tenant_id: ids.TENANT_ID, trip_id: ids.TRIP_4_ID, category: 'activities', preference_key: 'Skiing', preference_value: 'Henrik: advanced. Astrid: intermediate. Morning sessions preferred.', created_by: ids.USER_CONSULTANT_2_ID, created_at: '2026-02-15T00:00:00Z', updated_at: now },
  { id: '90000000-0000-0000-0000-000000000009', tenant_id: ids.TENANT_ID, trip_id: ids.TRIP_4_ID, category: 'wellness', preference_key: 'Spa', preference_value: 'Couples treatments daily. Late afternoon preferred. Hot stone, deep tissue.', created_by: ids.USER_CONSULTANT_2_ID, created_at: '2026-02-15T00:00:00Z', updated_at: now },
  // Pembertons
  { id: '90000000-0000-0000-0000-000000000010', tenant_id: ids.TENANT_ID, trip_id: ids.TRIP_5_ID, category: 'activities', preference_key: 'Photography', preference_value: 'Oliver: Canon R5 shooter, dedicated hides. Diana: birding, nature walks.', created_by: ids.USER_CONSULTANT_1_ID, created_at: '2026-02-20T00:00:00Z', updated_at: now },
  { id: '90000000-0000-0000-0000-000000000011', tenant_id: ids.TENANT_ID, trip_id: ids.TRIP_5_ID, category: 'dining', preference_key: 'Diet', preference_value: 'Diana: pescatarian. Oliver: no restrictions.', created_by: ids.USER_CONSULTANT_1_ID, created_at: '2026-02-20T00:00:00Z', updated_at: now },
];

// ============================================
// BOOKING BRIEFS
// ============================================
export const demoBookingBriefs: BookingBrief[] = [
  {
    id: 'A0000000-0000-0000-0000-000000000001',
    tenant_id: ids.TENANT_ID,
    trip_id: ids.TRIP_1_ID,
    hotel_booking_id: ids.BOOKING_1_ID,
    content: `## Booking Brief: Castello di Velona Resort

**Clients:** Victoria & Edward Ashworth
**Occasion:** 25th Wedding Anniversary
**Dates:** June 15–20, 2026
**Room:** Grand Suite with vineyard view

### Guest Profile
- Experienced luxury travellers
- Edward is a dedicated wine enthusiast
- Victoria avoids shellfish

### Special Arrangements Required
1. Anniversary celebration cake and floral arrangement on arrival
2. Private wine tasting with head sommelier — Day 2
3. Truffle hunting experience — arrange through hotel concierge
4. Late checkout on June 20 if available
5. Dinner reservation at Michelin restaurant for anniversary evening

### Dietary Notes
- Victoria: No shellfish
- Edward: No restrictions

### Communication Style
- Formal but warm. Mr & Mrs Ashworth appreciate attentive, discreet service.`,
    generated_at: '2026-03-01T00:00:00Z',
    created_by: ids.USER_CONSULTANT_1_ID,
    created_at: '2026-03-01T00:00:00Z',
    updated_at: now,
  },
];

// ============================================
// WORKFLOW EVENTS
// ============================================
export const demoWorkflowEvents: WorkflowEvent[] = [
  { id: 'B0000000-0000-0000-0000-000000000001', tenant_id: ids.TENANT_ID, trip_id: ids.TRIP_1_ID, hotel_booking_id: ids.BOOKING_1_ID, from_status: null, to_status: 'not_started', changed_by: ids.USER_CONSULTANT_1_ID, note: 'Booking created', created_at: '2026-01-10T00:00:00Z' },
  { id: 'B0000000-0000-0000-0000-000000000002', tenant_id: ids.TENANT_ID, trip_id: ids.TRIP_1_ID, hotel_booking_id: ids.BOOKING_1_ID, from_status: 'not_started', to_status: 'brief_ready', changed_by: ids.USER_CONSULTANT_1_ID, note: 'Booking brief generated', created_at: '2026-03-01T00:00:00Z' },
  { id: 'B0000000-0000-0000-0000-000000000003', tenant_id: ids.TENANT_ID, trip_id: ids.TRIP_1_ID, hotel_booking_id: ids.BOOKING_1_ID, from_status: 'brief_ready', to_status: 'draft_created', changed_by: ids.USER_CONSULTANT_1_ID, note: 'Hotel email draft created', created_at: '2026-03-01T12:00:00Z' },
  { id: 'B0000000-0000-0000-0000-000000000004', tenant_id: ids.TENANT_ID, trip_id: ids.TRIP_4_ID, hotel_booking_id: ids.BOOKING_6_ID, from_status: null, to_status: 'not_started', changed_by: ids.USER_CONSULTANT_2_ID, note: 'Booking created', created_at: '2026-02-15T00:00:00Z' },
  { id: 'B0000000-0000-0000-0000-000000000005', tenant_id: ids.TENANT_ID, trip_id: ids.TRIP_4_ID, hotel_booking_id: ids.BOOKING_6_ID, from_status: 'not_started', to_status: 'brief_ready', changed_by: ids.USER_CONSULTANT_2_ID, note: 'Brief generated', created_at: '2026-03-03T00:00:00Z' },
  { id: 'B0000000-0000-0000-0000-000000000006', tenant_id: ids.TENANT_ID, trip_id: ids.TRIP_4_ID, hotel_booking_id: ids.BOOKING_6_ID, from_status: 'brief_ready', to_status: 'draft_created', changed_by: ids.USER_CONSULTANT_2_ID, note: 'Email draft created', created_at: '2026-03-04T00:00:00Z' },
  { id: 'B0000000-0000-0000-0000-000000000007', tenant_id: ids.TENANT_ID, trip_id: ids.TRIP_4_ID, hotel_booking_id: ids.BOOKING_6_ID, from_status: 'draft_created', to_status: 'sent', changed_by: ids.USER_CONSULTANT_2_ID, note: 'Email sent to hotel', created_at: '2026-03-05T14:30:00Z' },
  { id: 'B0000000-0000-0000-0000-000000000008', tenant_id: ids.TENANT_ID, trip_id: ids.TRIP_5_ID, hotel_booking_id: ids.BOOKING_7_ID, from_status: 'sent', to_status: 'awaiting_reply', changed_by: ids.USER_CONSULTANT_1_ID, note: 'Waiting for hotel response', created_at: '2026-03-07T00:00:00Z' },
];

// ============================================
// PHASE 2: TENANT SETTINGS
// ============================================
export const demoTenantSettings: TenantSettings = {
  id: 'C0000000-0000-0000-0000-000000000001',
  tenant_id: ids.TENANT_ID,
  brand_name: 'AlexTravels',
  support_email: 'ops@alextravels.com',
  default_timezone: 'Europe/London',
  operational_notes: 'Phase 1 demo tenant. All integrations running in mock mode. No live client data.',
  default_draft_status: 'draft',
  reply_followup_days: 3,
  internal_review_required: false,
  email_generation_mode: 'draft_only',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: now,
};

// ============================================
// PHASE 2: INTEGRATION PROVIDERS
// ============================================
const PROVIDER_GMAIL_ID = 'D0000000-0000-0000-0000-000000000001';
const PROVIDER_NOTION_ID = 'D0000000-0000-0000-0000-000000000002';
const PROVIDER_SHAREFILE_ID = 'D0000000-0000-0000-0000-000000000003';

export const demoIntegrationProviders: IntegrationProvider[] = [
  {
    id: PROVIDER_GMAIL_ID,
    tenant_id: ids.TENANT_ID,
    provider_type: 'gmail',
    mode: 'mock',
    enabled: true,
    display_name: 'Gmail',
    description: 'Hotel outreach email drafts and reply tracking',
    config_checklist: [
      { label: 'Google Workspace connected', done: false },
      { label: 'OAuth credentials configured', done: false },
      { label: 'Sending email address verified', done: false },
      { label: 'Reply webhook configured', done: false },
    ],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: PROVIDER_NOTION_ID,
    tenant_id: ids.TENANT_ID,
    provider_type: 'notion',
    mode: 'mock',
    enabled: true,
    display_name: 'Notion',
    description: 'Trip records, traveller data, and booking source of truth',
    config_checklist: [
      { label: 'Notion API key configured', done: false },
      { label: 'Trip database selected', done: false },
      { label: 'Traveller database selected', done: false },
      { label: 'Field mappings verified', done: false },
    ],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: PROVIDER_SHAREFILE_ID,
    tenant_id: ids.TENANT_ID,
    provider_type: 'sharefile',
    mode: 'mock',
    enabled: true,
    display_name: 'ShareFile',
    description: 'Client documents, preference forms, and secure file exchange',
    config_checklist: [
      { label: 'ShareFile API credentials configured', done: false },
      { label: 'Client folder structure mapped', done: false },
      { label: 'Document categories defined', done: false },
      { label: 'Preference form template linked', done: false },
    ],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: now,
  },
];

// ============================================
// PHASE 2: PROVIDER CONNECTIONS
// ============================================
export const demoProviderConnections: ProviderConnection[] = [
  { id: 'D1000000-0000-0000-0000-000000000001', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_GMAIL_ID, status: 'connected', last_connected_at: '2026-03-09T08:00:00Z', error_message: null, created_at: '2025-01-01T00:00:00Z', updated_at: now },
  { id: 'D1000000-0000-0000-0000-000000000002', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_NOTION_ID, status: 'connected', last_connected_at: '2026-03-09T07:30:00Z', error_message: null, created_at: '2025-01-01T00:00:00Z', updated_at: now },
  { id: 'D1000000-0000-0000-0000-000000000003', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_SHAREFILE_ID, status: 'connected', last_connected_at: '2026-03-08T22:00:00Z', error_message: null, created_at: '2025-01-01T00:00:00Z', updated_at: now },
];

// ============================================
// PHASE 2: SYNC RUNS
// ============================================
export const demoSyncRuns: ProviderSyncRun[] = [
  { id: 'D2000000-0000-0000-0000-000000000001', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_NOTION_ID, status: 'success', started_at: '2026-03-09T07:30:00Z', ended_at: '2026-03-09T07:30:12Z', records_processed: 5, records_created: 0, records_updated: 2, records_failed: 0, error_summary: null, created_at: '2026-03-09T07:30:00Z' },
  { id: 'D2000000-0000-0000-0000-000000000002', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_NOTION_ID, status: 'success', started_at: '2026-03-08T07:30:00Z', ended_at: '2026-03-08T07:30:08Z', records_processed: 5, records_created: 1, records_updated: 1, records_failed: 0, error_summary: null, created_at: '2026-03-08T07:30:00Z' },
  { id: 'D2000000-0000-0000-0000-000000000003', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_GMAIL_ID, status: 'success', started_at: '2026-03-09T08:00:00Z', ended_at: '2026-03-09T08:00:05Z', records_processed: 3, records_created: 0, records_updated: 1, records_failed: 0, error_summary: null, created_at: '2026-03-09T08:00:00Z' },
  { id: 'D2000000-0000-0000-0000-000000000004', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_GMAIL_ID, status: 'warning', started_at: '2026-03-07T08:00:00Z', ended_at: '2026-03-07T08:00:03Z', records_processed: 3, records_created: 0, records_updated: 0, records_failed: 1, error_summary: 'Rate limit reached during reply check. 1 thread skipped.', created_at: '2026-03-07T08:00:00Z' },
  { id: 'D2000000-0000-0000-0000-000000000005', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_SHAREFILE_ID, status: 'success', started_at: '2026-03-08T22:00:00Z', ended_at: '2026-03-08T22:00:18Z', records_processed: 8, records_created: 0, records_updated: 3, records_failed: 0, error_summary: null, created_at: '2026-03-08T22:00:00Z' },
  { id: 'D2000000-0000-0000-0000-000000000006', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_SHAREFILE_ID, status: 'failed', started_at: '2026-03-06T22:00:00Z', ended_at: '2026-03-06T22:00:02Z', records_processed: 0, records_created: 0, records_updated: 0, records_failed: 0, error_summary: 'Authentication token expired. Re-authentication required.', created_at: '2026-03-06T22:00:00Z' },
];

// ============================================
// PHASE 2: FIELD MAPPINGS
// ============================================
export const demoFieldMappings: ProviderFieldMapping[] = [
  // Notion mappings
  { id: 'D3000000-0000-0000-0000-000000000001', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_NOTION_ID, source_field: 'Name', source_label: 'Trip Name', target_table: 'trips', target_field: 'title', target_label: 'Trip Title', is_required: true, status: 'valid', sample_value: 'Tuscany Anniversary Escape', created_at: now, updated_at: now },
  { id: 'D3000000-0000-0000-0000-000000000002', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_NOTION_ID, source_field: 'Destination', source_label: 'Destination', target_table: 'trips', target_field: 'destination', target_label: 'Destination', is_required: true, status: 'valid', sample_value: 'Tuscany, Italy', created_at: now, updated_at: now },
  { id: 'D3000000-0000-0000-0000-000000000003', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_NOTION_ID, source_field: 'Lead Consultant', source_label: 'Lead Consultant', target_table: 'trips', target_field: 'consultant_id', target_label: 'Consultant Owner', is_required: true, status: 'valid', sample_value: 'Sophie Lavigne', created_at: now, updated_at: now },
  { id: 'D3000000-0000-0000-0000-000000000004', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_NOTION_ID, source_field: 'Start Date', source_label: 'Travel Start', target_table: 'trips', target_field: 'start_date', target_label: 'Start Date', is_required: true, status: 'valid', sample_value: '2026-06-15', created_at: now, updated_at: now },
  { id: 'D3000000-0000-0000-0000-000000000005', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_NOTION_ID, source_field: 'End Date', source_label: 'Travel End', target_table: 'trips', target_field: 'end_date', target_label: 'End Date', is_required: true, status: 'valid', sample_value: '2026-06-25', created_at: now, updated_at: now },
  { id: 'D3000000-0000-0000-0000-000000000006', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_NOTION_ID, source_field: 'Client Name', source_label: 'Client', target_table: 'clients', target_field: 'full_name', target_label: 'Client Name', is_required: true, status: 'valid', sample_value: 'Victoria & Edward Ashworth', created_at: now, updated_at: now },
  { id: 'D3000000-0000-0000-0000-000000000007', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_NOTION_ID, source_field: 'Internal Notes', source_label: 'Notes', target_table: 'trips', target_field: 'internal_notes', target_label: 'Internal Notes', is_required: false, status: 'valid', sample_value: 'Silver wedding anniversary celebration...', created_at: now, updated_at: now },
  { id: 'D3000000-0000-0000-0000-000000000008', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_NOTION_ID, source_field: 'Hotel Targets', source_label: 'Hotels', target_table: 'hotel_bookings', target_field: 'hotel_contact_id', target_label: 'Target Hotels', is_required: false, status: 'valid', sample_value: 'Castello di Velona, Borgo Santo Pietro', created_at: now, updated_at: now },
  // ShareFile mappings
  { id: 'D3000000-0000-0000-0000-000000000009', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_SHAREFILE_ID, source_field: 'FileName', source_label: 'File Name', target_table: 'documents', target_field: 'file_name', target_label: 'Document Name', is_required: true, status: 'valid', sample_value: 'Ashworth_Travel_Preferences.pdf', created_at: now, updated_at: now },
  { id: 'D3000000-0000-0000-0000-000000000010', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_SHAREFILE_ID, source_field: 'Category', source_label: 'Document Category', target_table: 'documents', target_field: 'category', target_label: 'Category', is_required: true, status: 'valid', sample_value: 'preference_form', created_at: now, updated_at: now },
  { id: 'D3000000-0000-0000-0000-000000000011', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_SHAREFILE_ID, source_field: 'DietaryNotes', source_label: 'Dietary Notes', target_table: 'travel_preferences', target_field: 'preference_value', target_label: 'Dietary Requirements', is_required: false, status: 'valid', sample_value: 'No shellfish (Victoria)', created_at: now, updated_at: now },
  { id: 'D3000000-0000-0000-0000-000000000012', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_SHAREFILE_ID, source_field: 'Celebration', source_label: 'Celebration Type', target_table: 'trips', target_field: 'internal_notes', target_label: 'Special Occasions', is_required: false, status: 'valid', sample_value: '25th Wedding Anniversary', created_at: now, updated_at: now },
  // Gmail mappings
  { id: 'D3000000-0000-0000-0000-000000000013', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_GMAIL_ID, source_field: 'threadId', source_label: 'Thread ID', target_table: 'email_drafts', target_field: 'gmail_draft_id', target_label: 'Gmail Draft ID', is_required: true, status: 'valid', sample_value: 'mock-draft-001', created_at: now, updated_at: now },
  { id: 'D3000000-0000-0000-0000-000000000014', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_GMAIL_ID, source_field: 'to', source_label: 'Recipient', target_table: 'email_drafts', target_field: 'to_email', target_label: 'To Email', is_required: true, status: 'valid', sample_value: 'reservations@castellodevelona.com', created_at: now, updated_at: now },
  { id: 'D3000000-0000-0000-0000-000000000015', tenant_id: ids.TENANT_ID, provider_id: PROVIDER_GMAIL_ID, source_field: 'subject', source_label: 'Subject', target_table: 'email_drafts', target_field: 'subject', target_label: 'Email Subject', is_required: true, status: 'valid', sample_value: 'Reservation Enquiry — Ashworth, June 15–20', created_at: now, updated_at: now },
];

// ============================================
// PHASE 2: EMAIL TEMPLATES
// ============================================
export const demoEmailTemplates: EmailTemplate[] = [
  {
    id: 'E0000000-0000-0000-0000-000000000001',
    tenant_id: ids.TENANT_ID,
    template_key: 'initial_outreach',
    name: 'Initial Hotel Outreach',
    subject_template: 'Reservation Enquiry — {{client_name}}, {{travel_dates}}, {{room_type}}',
    body_template: `Dear {{hotel_contact_name}},

I hope this message finds you well. I am writing on behalf of my client{{client_plural}}, {{client_name}}, regarding a stay at {{hotel_name}}.

We would like to enquire about availability for the following:

Dates: {{travel_dates}}
Room: {{room_type}}
Guests: {{guest_count}}
Travellers: {{traveller_summary}}

{{special_requests_section}}
{{dietary_section}}
Please confirm availability and your best available rate for this period.

Warm regards,
{{consultant_name}}
{{brand_name}}`,
    is_active: true,
    version: 1,
    last_edited_by: ids.USER_ADMIN_ID,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: 'E0000000-0000-0000-0000-000000000002',
    tenant_id: ids.TENANT_ID,
    template_key: 'follow_up',
    name: 'Follow-Up Email',
    subject_template: 'Follow-Up: {{client_name}} — {{hotel_name}}, {{travel_dates}}',
    body_template: `Dear {{hotel_contact_name}},

I hope you are well. I wanted to follow up on my earlier enquiry regarding availability for {{client_name}} at {{hotel_name}} from {{travel_dates}}.

Would you be able to provide an update on availability and rates at your earliest convenience?

Many thanks,
{{consultant_name}}
{{brand_name}}`,
    is_active: true,
    version: 1,
    last_edited_by: ids.USER_ADMIN_ID,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: now,
  },
  {
    id: 'E0000000-0000-0000-0000-000000000003',
    tenant_id: ids.TENANT_ID,
    template_key: 'confirmation_request',
    name: 'Confirmation Request',
    subject_template: 'Booking Confirmation — {{client_name}}, {{hotel_name}}, {{travel_dates}}',
    body_template: `Dear {{hotel_contact_name}},

Thank you for confirming availability. We would like to proceed with the booking for {{client_name}}.

Booking Details:
- Dates: {{travel_dates}}
- Room: {{room_type}}
- Guests: {{guest_count}}

{{special_requests_section}}

Please send through the confirmation and any deposit requirements.

Kind regards,
{{consultant_name}}
{{brand_name}}`,
    is_active: true,
    version: 1,
    last_edited_by: ids.USER_ADMIN_ID,
    created_at: '2025-02-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: 'E0000000-0000-0000-0000-000000000004',
    tenant_id: ids.TENANT_ID,
    template_key: 'special_requests',
    name: 'Special Requests Clarification',
    subject_template: 'Special Arrangements — {{client_name}}, {{hotel_name}}',
    body_template: `Dear {{hotel_contact_name}},

I am writing to discuss some additional arrangements for our upcoming guest{{client_plural}}, {{client_name}}, staying {{travel_dates}}.

{{special_requests_section}}

Could you kindly confirm which of these arrangements can be accommodated? Please let me know if any require additional coordination.

Thank you,
{{consultant_name}}
{{brand_name}}`,
    is_active: true,
    version: 1,
    last_edited_by: ids.USER_ADMIN_ID,
    created_at: '2025-02-15T00:00:00Z',
    updated_at: now,
  },
];

// ============================================
// PHASE 2: PROMPT CONFIGS
// ============================================
export const demoPromptConfigs: PromptConfig[] = [
  {
    id: 'F0000000-0000-0000-0000-000000000001',
    tenant_id: ids.TENANT_ID,
    prompt_key: 'booking_brief',
    name: 'Booking Brief Generation',
    system_prompt: `You are a luxury travel operations assistant for AlexTravels. Generate a structured booking brief that a hotel reservations team can action.

Include:
- Guest profile and occasion
- Room and date requirements
- Dietary restrictions and allergies (critical)
- Special arrangements needed
- Communication style guidance

Tone: Professional, warm, detail-oriented. Anticipate needs before they are asked.`,
    tone_profile: 'professional_warm',
    extra_detail_enabled: true,
    banned_phrases: ['cheap', 'budget', 'discount', 'deal', 'bargain', 'affordable', 'basic'],
    style_guidelines: [
      'Always reference the occasion if one exists',
      'Lead with guest comfort and preferences',
      'Highlight dietary restrictions prominently',
      'Use formal titles unless client prefers otherwise',
      'Include specific room and view preferences',
    ],
    last_edited_by: ids.USER_ADMIN_ID,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: 'F0000000-0000-0000-0000-000000000002',
    tenant_id: ids.TENANT_ID,
    prompt_key: 'hotel_email',
    name: 'Hotel Email Generation',
    system_prompt: `You are a luxury travel consultant composing a hotel reservation enquiry on behalf of AlexTravels. Write a professional, courteous email to the hotel contact.

Structure:
1. Warm greeting
2. Introduction of client (without oversharing)
3. Booking requirements (dates, room, guests)
4. Special requests and dietary needs
5. Rate enquiry
6. Professional sign-off

Tone: Sophisticated, warm, concise. Demonstrate that you value the hotel relationship.`,
    tone_profile: 'professional_warm',
    extra_detail_enabled: true,
    banned_phrases: ['cheap', 'budget', 'discount', 'deal', 'ASAP', 'urgent'],
    style_guidelines: [
      'Open with a personal greeting to the contact',
      'Reference the hotel by name naturally',
      'Keep requests clear and numbered where helpful',
      'Close with a professional but warm sign-off',
      'Never pressure on price — enquire gracefully',
    ],
    last_edited_by: ids.USER_ADMIN_ID,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: now,
  },
];

// ============================================
// PHASE 2: WORKFLOW RULES
// ============================================
export const demoWorkflowRules: WorkflowRule[] = [
  { id: 'G0000000-0000-0000-0000-000000000001', tenant_id: ids.TENANT_ID, rule_key: 'review_before_send', name: 'Require review before sending', description: 'Email drafts must be reviewed by admin or operations before marking as sent', enabled: false, allowed_roles: ['admin', 'operations'], created_at: now, updated_at: now },
  { id: 'G0000000-0000-0000-0000-000000000002', tenant_id: ids.TENANT_ID, rule_key: 'send_permission', name: 'Who can mark emails as sent', description: 'Only these roles can mark email drafts as sent to hotels', enabled: true, allowed_roles: ['admin', 'consultant', 'operations'], created_at: now, updated_at: now },
  { id: 'G0000000-0000-0000-0000-000000000003', tenant_id: ids.TENANT_ID, rule_key: 'regenerate_draft', name: 'Who can regenerate email drafts', description: 'Only these roles can regenerate an existing email draft', enabled: true, allowed_roles: ['admin', 'consultant'], created_at: now, updated_at: now },
  { id: 'G0000000-0000-0000-0000-000000000004', tenant_id: ids.TENANT_ID, rule_key: 'change_booking_status', name: 'Who can change booking status', description: 'Only these roles can manually change a hotel booking status', enabled: true, allowed_roles: ['admin', 'consultant', 'operations'], created_at: now, updated_at: now },
  { id: 'G0000000-0000-0000-0000-000000000005', tenant_id: ids.TENANT_ID, rule_key: 'reset_demo_data', name: 'Who can reset demo data', description: 'Only these roles can reset the demo environment data', enabled: true, allowed_roles: ['admin'], created_at: now, updated_at: now },
];

// ============================================
// IN-MEMORY STORE (for mock mode)
// ============================================
export interface DemoDataStore {
  tenant: Tenant;
  tenantSettings: TenantSettings;
  users: UserProfile[];
  clients: Client[];
  travellers: Traveller[];
  trips: Trip[];
  hotelContacts: HotelContact[];
  hotelBookings: HotelBooking[];
  emailDrafts: EmailDraft[];
  documents: Document[];
  preferences: TravelPreference[];
  bookingBriefs: BookingBrief[];
  workflowEvents: WorkflowEvent[];
  integrationProviders: IntegrationProvider[];
  providerConnections: ProviderConnection[];
  syncRuns: ProviderSyncRun[];
  fieldMappings: ProviderFieldMapping[];
  emailTemplates: EmailTemplate[];
  promptConfigs: PromptConfig[];
  workflowRules: WorkflowRule[];
}

let _store: DemoDataStore | null = null;

export function getDemoStore(): DemoDataStore {
  if (!_store) {
    _store = {
      tenant: { ...demoTenant },
      tenantSettings: { ...demoTenantSettings },
      users: demoUsers.map((u) => ({ ...u })),
      clients: demoClients.map((c) => ({ ...c })),
      travellers: demoTravellers.map((t) => ({ ...t })),
      trips: demoTrips.map((t) => ({ ...t })),
      hotelContacts: demoHotelContacts.map((h) => ({ ...h })),
      hotelBookings: demoHotelBookings.map((b) => ({ ...b })),
      emailDrafts: demoEmailDrafts.map((e) => ({ ...e })),
      documents: demoDocuments.map((d) => ({ ...d })),
      preferences: demoPreferences.map((p) => ({ ...p })),
      bookingBriefs: demoBookingBriefs.map((b) => ({ ...b })),
      workflowEvents: demoWorkflowEvents.map((w) => ({ ...w })),
      integrationProviders: demoIntegrationProviders.map((p) => ({ ...p, config_checklist: p.config_checklist.map((c) => ({ ...c })) })),
      providerConnections: demoProviderConnections.map((c) => ({ ...c })),
      syncRuns: demoSyncRuns.map((s) => ({ ...s })),
      fieldMappings: demoFieldMappings.map((m) => ({ ...m })),
      emailTemplates: demoEmailTemplates.map((t) => ({ ...t })),
      promptConfigs: demoPromptConfigs.map((p) => ({ ...p, banned_phrases: [...p.banned_phrases], style_guidelines: [...p.style_guidelines] })),
      workflowRules: demoWorkflowRules.map((r) => ({ ...r, allowed_roles: [...r.allowed_roles] })),
    };
  }
  return _store;
}

export function resetDemoStore(): void {
  _store = null;
}
