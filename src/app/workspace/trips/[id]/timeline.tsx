'use client';

import { MapPin, Calendar, Users, Hotel } from 'lucide-react';
import { formatDateRange, statusLabel, statusColor, cn } from '@/lib/utils/format';
import { hotelImages } from '@/lib/constants/hotel-images';
import type { HotelBooking } from '@/types/database';
import { format, parseISO, differenceInDays } from 'date-fns';

type BookingWithHotel = HotelBooking & {
  hotel_contact?: { hotel_name: string; contact_name: string; contact_email: string; location: string };
  email_drafts?: unknown[];
};

interface TripTimelineProps {
  bookings: BookingWithHotel[];
  tripStart: string;
  tripEnd: string;
  destination: string;
  activeBooking: string | null;
  onSelectBooking: (id: string) => void;
}

export default function TripTimeline({
  bookings,
  tripStart,
  tripEnd,
  destination,
  activeBooking,
  onSelectBooking,
}: TripTimelineProps) {
  const sorted = [...bookings].sort(
    (a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime()
  );

  const totalDays = differenceInDays(parseISO(tripEnd), parseISO(tripStart));

  return (
    <div className="space-y-0">
      {/* Timeline header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <MapPin className="w-4 h-4 text-accent" />
        </div>
        <div>
          <p className="text-xs text-accent uppercase tracking-wider font-medium">
            Journey Timeline
          </p>
          <p className="text-[11px] text-muted">
            {destination} &middot; {totalDays} nights &middot;{' '}
            {formatDateRange(tripStart, tripEnd)}
          </p>
        </div>
      </div>

      {/* Vertical timeline */}
      <div className="relative">
        {/* Continuous timeline line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

        {sorted.map((booking, index) => {
          const isActive = booking.id === activeBooking;
          const nights = differenceInDays(
            parseISO(booking.check_out),
            parseISO(booking.check_in)
          );
          const imageSrc = hotelImages[booking.hotel_contact_id];

          return (
            <div key={booking.id} className="relative pb-6 last:pb-0">
              {/* Timeline node */}
              <div className="absolute left-[14px] top-3 z-10">
                <div
                  className={cn(
                    'w-[11px] h-[11px] rounded-full border-2',
                    isActive
                      ? 'bg-accent border-accent shadow-[0_0_8px_rgba(201,169,110,0.4)]'
                      : 'bg-card border-zinc-600'
                  )}
                />
              </div>

              {/* Booking card */}
              <div
                className={cn(
                  'ml-12 rounded-xl border transition-all cursor-pointer group',
                  isActive
                    ? 'border-accent/40 bg-accent/5 shadow-lg shadow-accent/5'
                    : 'border-border bg-card hover:border-accent/20 hover:bg-card-hover'
                )}
                onClick={() => onSelectBooking(booking.id)}
              >
                {/* Hotel image */}
                {imageSrc && (
                  <div className="relative h-36 overflow-hidden rounded-t-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageSrc}
                      alt={booking.hotel_contact?.hotel_name || 'Hotel'}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Date badge on image */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-sm',
                          statusColor(booking.status)
                        )}
                      >
                        {statusLabel(booking.status)}
                      </span>
                    </div>

                    {/* Hotel name on image */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-sm font-medium text-white drop-shadow-md">
                        {booking.hotel_contact?.hotel_name}
                      </h4>
                      <p className="text-[11px] text-white/70 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {booking.hotel_contact?.location}
                      </p>
                    </div>
                  </div>
                )}

                {/* Card content */}
                <div className="p-3.5">
                  {/* If no image, show hotel name here */}
                  {!imageSrc && (
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-medium text-foreground">
                          {booking.hotel_contact?.hotel_name}
                        </h4>
                        <p className="text-[11px] text-muted flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {booking.hotel_contact?.location}
                        </p>
                      </div>
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-medium',
                          statusColor(booking.status)
                        )}
                      >
                        {statusLabel(booking.status)}
                      </span>
                    </div>
                  )}

                  {/* Details row */}
                  <div className="flex items-center gap-4 text-[11px] text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(parseISO(booking.check_in), 'MMM d')} –{' '}
                      {format(parseISO(booking.check_out), 'MMM d')}
                    </span>
                    <span className="text-muted/40">|</span>
                    <span>{nights} night{nights !== 1 ? 's' : ''}</span>
                    <span className="text-muted/40">|</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {booking.guests}
                    </span>
                  </div>

                  {/* Room type */}
                  {booking.room_type && (
                    <p className="text-[11px] text-muted/60 mt-1.5 flex items-center gap-1">
                      <Hotel className="w-3 h-3" />
                      {booking.room_type}
                    </p>
                  )}

                  {/* Special requests preview */}
                  {booking.special_requests && (
                    <p className="text-[10px] text-muted/50 mt-2 line-clamp-2 italic">
                      {booking.special_requests}
                    </p>
                  )}
                </div>
              </div>

              {/* Gap indicator between bookings */}
              {index < sorted.length - 1 && (() => {
                const nextBooking = sorted[index + 1];
                const gap = differenceInDays(
                  parseISO(nextBooking.check_in),
                  parseISO(booking.check_out)
                );
                if (gap > 0) {
                  return (
                    <div className="ml-12 py-2 flex items-center gap-2">
                      <div className="h-px flex-1 bg-border/50 border-dashed" />
                      <span className="text-[10px] text-muted/40 px-2">
                        {gap} day{gap !== 1 ? 's' : ''} transfer
                      </span>
                      <div className="h-px flex-1 bg-border/50 border-dashed" />
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          );
        })}

        {/* End node */}
        <div className="relative">
          <div className="absolute left-[14px] top-0 z-10">
            <div className="w-[11px] h-[11px] rounded-full border-2 bg-card border-accent/40" />
          </div>
          <div className="ml-12 pt-0.5">
            <p className="text-[11px] text-muted/50">
              End of journey &middot;{' '}
              {format(parseISO(tripEnd), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
