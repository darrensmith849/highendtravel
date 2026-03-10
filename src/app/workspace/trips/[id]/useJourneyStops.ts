import { useMemo } from 'react';
import { parseISO, differenceInDays } from 'date-fns';
import type { HotelBooking, TravelPreference, Traveller } from '@/types/database';

export type BookingWithHotel = HotelBooking & {
  hotel_contact?: { hotel_name: string; contact_name: string; contact_email: string; location: string };
  email_drafts?: unknown[];
};

export interface JourneyStop {
  booking: BookingWithHotel;
  nights: number;
  segmentHeight: number;
  gapDaysAfter: number | null;
  tags: string[];
}

function deriveTags(
  booking: BookingWithHotel,
  travellers: Traveller[],
  preferences: TravelPreference[],
): string[] {
  const tags: string[] = [];

  // Party size tag
  if (booking.guests > 4) tags.push('Large Party');
  else if (booking.guests > 2) tags.push('Family');
  else if (booking.guests === 2) tags.push('Couple');

  // Dietary from travellers
  const hasDietary = travellers.some((t) => t.dietary_requirements);
  if (hasDietary) tags.push('Dietary');

  // Preference-based tags
  for (const pref of preferences) {
    const cat = pref.category.toLowerCase();
    const key = pref.preference_key.toLowerCase();
    if (cat === 'dietary' || key.includes('allerg')) {
      if (!tags.includes('Dietary')) tags.push('Dietary');
    }
    if (cat === 'wellness' || key.includes('spa')) {
      if (!tags.includes('Wellness')) tags.push('Wellness');
    }
    if (cat === 'activities') {
      if (!tags.includes('Activities')) tags.push('Activities');
    }
  }

  // Special requests
  if (booking.special_requests) tags.push('Requests');

  // Status-based
  if (booking.status === 'confirmed') tags.push('Confirmed');

  return tags;
}

export function useJourneyStops(
  bookings: BookingWithHotel[],
  travellers: Traveller[],
  preferences: TravelPreference[],
): JourneyStop[] {
  return useMemo(() => {
    const sorted = [...bookings].sort(
      (a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime()
    );

    return sorted.map((booking, index) => {
      const nights = Math.max(
        1,
        differenceInDays(parseISO(booking.check_out), parseISO(booking.check_in))
      );

      // Proportional segment: clamp(56 + nights * 18, 90, 240)
      const segmentHeight = Math.min(240, Math.max(90, 56 + nights * 18));

      // Gap to next stop
      let gapDaysAfter: number | null = null;
      if (index < sorted.length - 1) {
        const next = sorted[index + 1];
        const gap = differenceInDays(parseISO(next.check_in), parseISO(booking.check_out));
        if (gap > 0) gapDaysAfter = gap;
      }

      const tags = deriveTags(booking, travellers, preferences);

      return { booking, nights, segmentHeight, gapDaysAfter, tags };
    });
  }, [bookings, travellers, preferences]);
}
