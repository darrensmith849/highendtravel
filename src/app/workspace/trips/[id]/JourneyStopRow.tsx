'use client';

import React, { useState, useCallback } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Hotel,
  ChevronDown,
  ChevronUp,
  Mail,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { statusLabel, statusColor, cn } from '@/lib/utils/format';
import { hotelImages } from '@/lib/constants/hotel-images';
import type { JourneyStop } from './useJourneyStops';

interface JourneyStopRowProps {
  stop: JourneyStop;
  isActive: boolean;
  showImages: boolean;
  onSelect: (id: string) => void;
}

const JourneyStopRow = React.memo(function JourneyStopRow({
  stop,
  isActive,
  showImages,
  onSelect,
}: JourneyStopRowProps) {
  const [expanded, setExpanded] = useState(false);
  const { booking, nights, tags } = stop;
  const imageData = hotelImages[booking.hotel_contact_id];

  const handleExpand = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      setExpanded((prev) => !prev);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(booking.id);
      }
    },
    [onSelect, booking.id]
  );

  const handleExpandKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleExpand(e);
      }
    },
    [handleExpand]
  );

  const visibleTags = tags.slice(0, 3);
  const extraTagCount = tags.length - 3;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${booking.hotel_contact?.hotel_name}, ${nights} nights`}
      className={cn(
        'rounded-lg border transition-all cursor-pointer',
        'p-3 flex gap-3 items-start',
        isActive
          ? 'border-accent/40 bg-accent/5'
          : 'border-border/60 bg-card hover:border-accent/20 hover:bg-card-hover'
      )}
      onClick={() => onSelect(booking.id)}
      onKeyDown={handleKeyDown}
    >
      {/* Optional thumbnail */}
      {showImages && imageData && (
        <Thumbnail
          src={imageData.fallback}
          alt={booking.hotel_contact?.hotel_name || 'Hotel'}
        />
      )}

      {/* Text content */}
      <div className="flex-1 min-w-0">
        {/* Row 1: Name + status */}
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-foreground truncate">
            {booking.hotel_contact?.hotel_name}
          </span>
          <span
            className={cn(
              'shrink-0 px-1.5 py-px rounded text-[9px] font-medium',
              statusColor(booking.status)
            )}
          >
            {statusLabel(booking.status)}
          </span>
        </div>

        {/* Row 2: Location */}
        <p className="text-[11px] text-muted flex items-center gap-1 mb-1">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{booking.hotel_contact?.location}</span>
        </p>

        {/* Row 3: Date + nights + guests */}
        <div className="flex items-center gap-3 text-[11px] text-muted/70 mb-1.5">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {format(parseISO(booking.check_in), 'MMM d')} –{' '}
            {format(parseISO(booking.check_out), 'MMM d')}
          </span>
          <span className="text-muted/30">·</span>
          <span>{nights}n</span>
          <span className="text-muted/30">·</span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {booking.guests}
          </span>
        </div>

        {/* Row 4: Tags */}
        {visibleTags.length > 0 && (
          <div className="flex items-center gap-1.5 mb-1">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-px rounded text-[9px] bg-zinc-800 text-muted border border-border/40"
              >
                {tag}
              </span>
            ))}
            {extraTagCount > 0 && (
              <span className="text-[9px] text-muted/50">+{extraTagCount}</span>
            )}
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={handleExpand}
          onKeyDown={handleExpandKeyDown}
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse details' : 'View details'}
          className="text-[10px] text-accent/70 hover:text-accent flex items-center gap-0.5 mt-0.5 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3 h-3" /> Hide details
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" /> View details
            </>
          )}
        </button>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-2 pt-2 border-t border-border/30 space-y-2 text-[11px]">
            {booking.room_type && (
              <div>
                <span className="text-muted/50 uppercase text-[9px] tracking-wider">
                  Room
                </span>
                <p className="text-muted flex items-center gap-1">
                  <Hotel className="w-3 h-3 shrink-0" />
                  {booking.room_type}
                </p>
              </div>
            )}

            {booking.special_requests && (
              <div>
                <span className="text-muted/50 uppercase text-[9px] tracking-wider">
                  Key Requests
                </span>
                <p className="text-muted leading-relaxed">
                  {booking.special_requests}
                </p>
              </div>
            )}

            {/* Email queue shortcut */}
            {booking.email_drafts && (booking.email_drafts as unknown[]).length > 0 && (
              <div className="flex items-center gap-1 text-accent/60">
                <Mail className="w-3 h-3" />
                <span>{(booking.email_drafts as unknown[]).length} email(s) queued</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

function Thumbnail({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-14 h-14 rounded-md overflow-hidden bg-zinc-800 shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default JourneyStopRow;
