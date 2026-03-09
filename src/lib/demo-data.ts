import {
  type Tenant,
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
} from '@/types/database';
import * as ids from '@/lib/constants/seed-ids';

const now = '2026-03-09T10:00:00Z';

// ============================================
// TENANT
// ============================================
export const demoTenant: Tenant = {
  id: ids.TENANT_ID,
  name: 'Maison Atlas Journeys',
  slug: 'maison-atlas',
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
    email: 'celeste@maisonatlas.com',
    full_name: 'Celeste Marchand',
    role: 'admin',
    avatar_url: null,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.USER_CONSULTANT_1_ID,
    tenant_id: ids.TENANT_ID,
    email: 'sophie@maisonatlas.com',
    full_name: 'Sophie Lavigne',
    role: 'consultant',
    avatar_url: null,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.USER_CONSULTANT_2_ID,
    tenant_id: ids.TENANT_ID,
    email: 'james@maisonatlas.com',
    full_name: 'James Harrington',
    role: 'consultant',
    avatar_url: null,
    created_at: '2025-02-01T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.USER_OPS_ID,
    tenant_id: ids.TENANT_ID,
    email: 'elena@maisonatlas.com',
    full_name: 'Elena Vasquez',
    role: 'operations',
    avatar_url: null,
    created_at: '2025-01-10T00:00:00Z',
    updated_at: now,
  },
  {
    id: ids.USER_VIEWER_ID,
    tenant_id: ids.TENANT_ID,
    email: 'marcus@maisonatlas.com',
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
Maison Atlas Journeys`,
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
Maison Atlas Journeys`,
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
Maison Atlas Journeys`,
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
// IN-MEMORY STORE (for mock mode)
// ============================================
export interface DemoDataStore {
  tenant: Tenant;
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
}

let _store: DemoDataStore | null = null;

export function getDemoStore(): DemoDataStore {
  if (!_store) {
    _store = {
      tenant: { ...demoTenant },
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
    };
  }
  return _store;
}

export function resetDemoStore(): void {
  _store = null;
}
