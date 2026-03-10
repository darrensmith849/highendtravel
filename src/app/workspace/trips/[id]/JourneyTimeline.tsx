'use client';

import { useState } from 'react';
import { MapPin, Image, ImageOff } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { formatDateRange, cn } from '@/lib/utils/format';
import type { TravelPreference, Traveller } from '@/types/database';
import { useJourneyStops, type BookingWithHotel } from './useJourneyStops';
import JourneyStopRow from './JourneyStopRow';

interface JourneyTimelineProps {
  bookings: BookingWithHotel[];
  travellers: Traveller[];
  preferences: TravelPreference[];
  tripStart: string;
  tripEnd: string;
  destination: string;
  activeBooking: string | null;
  onSelectBooking: (id: string) => void;
}

export default function JourneyTimeline({
  bookings,
  travellers,
  preferences,
  tripStart,
  tripEnd,
  destination,
  activeBooking,
  onSelectBooking,
}: JourneyTimelineProps) {
  const [showImages, setShowImages] = useState(false);
  const stops = useJourneyStops(bookings, travellers, preferences);
  const totalDays = differenceInDays(parseISO(tripEnd), parseISO(tripStart));

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
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

        {/* Images toggle */}
        <button
          onClick={() => setShowImages((v) => !v)}
          aria-label={showImages ? 'Hide images' : 'Show images'}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] transition-colors border',
            showImages
              ? 'border-accent/30 text-accent bg-accent/5'
              : 'border-border text-muted hover:text-foreground hover:border-accent/20'
          )}
        >
          {showImages ? (
            <Image className="w-3 h-3" />
          ) : (
            <ImageOff className="w-3 h-3" />
          )}
          Images: {showImages ? 'On' : 'Off'}
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {stops.map((stop, index) => {
          const isActive = stop.booking.id === activeBooking;
          const isLast = index === stops.length - 1;

          return (
            <div key={stop.booking.id} className="relative flex">
              {/* Left rail */}
              <div
                className="relative flex flex-col items-center shrink-0"
                style={{ width: 40 }}
              >
                {/* Node */}
                <div
                  className={cn(
                    'w-[10px] h-[10px] rounded-full border-2 mt-4 z-10',
                    isActive
                      ? 'bg-accent border-accent shadow-[0_0_6px_rgba(201,169,110,0.4)]'
                      : 'bg-card border-zinc-600'
                  )}
                />

                {/* Duration segment (proportional) */}
                {!isLast && (
                  <div
                    className="relative w-px bg-border/60 flex-shrink-0"
                    style={{ height: stop.segmentHeight }}
                  >
                    {/* Nights label */}
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] text-muted/40 whitespace-nowrap"
                    >
                      {stop.nights}n
                    </span>
                  </div>
                )}

                {/* Gap indicator */}
                {!isLast && stop.gapDaysAfter !== null && (
                  <div className="relative flex flex-col items-center">
                    <div
                      className="w-px border-l border-dashed border-muted/20"
                      style={{ height: 32 }}
                    />
                    <span className="absolute top-1/2 left-5 -translate-y-1/2 text-[9px] text-muted/30 whitespace-nowrap">
                      {stop.gapDaysAfter}d transfer
                    </span>
                  </div>
                )}
              </div>

              {/* Right: Stop card */}
              <div className="flex-1 min-w-0 pt-1 pb-6">
                <JourneyStopRow
                  stop={stop}
                  isActive={isActive}
                  showImages={showImages}
                  onSelect={onSelectBooking}
                />
              </div>
            </div>
          );
        })}

        {/* End node */}
        <div className="relative flex">
          <div className="flex flex-col items-center shrink-0" style={{ width: 40 }}>
            <div className="w-[10px] h-[10px] rounded-full border-2 bg-card border-accent/40 mt-1 z-10" />
          </div>
          <div className="pt-0">
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
