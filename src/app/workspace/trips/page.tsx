'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  User,
  Hotel,
  ArrowRight,
  Search,
} from 'lucide-react';
import type { Trip } from '@/types/database';
import {
  formatDateRange,
  statusLabel,
  statusColor,
  cn,
} from '@/lib/utils/format';

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/api/trips')
      .then((r) => r.json())
      .then((data) => {
        setTrips(data);
        setLoading(false);
      });
  }, []);

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      !search ||
      trip.title.toLowerCase().includes(search.toLowerCase()) ||
      trip.destination.toLowerCase().includes(search.toLowerCase()) ||
      trip.client?.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = [
    'all',
    'not_started',
    'brief_ready',
    'draft_created',
    'sent',
    'awaiting_reply',
    'confirmed',
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted">Loading trips...</div>
      </div>
    );
  }

  return (
    <div className="px-8 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-wide text-foreground">
          Trip Pipeline
        </h1>
        <p className="text-sm text-muted mt-1">
          {trips.length} active {trips.length === 1 ? 'journey' : 'journeys'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search trips, clients, destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
        <div className="flex gap-1.5">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs transition-colors',
                statusFilter === s
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted hover:text-foreground hover:bg-card-hover'
              )}
            >
              {s === 'all' ? 'All' : statusLabel(s as Trip['status'])}
            </button>
          ))}
        </div>
      </div>

      {/* Trip Cards */}
      <div className="grid gap-4">
        {filteredTrips.map((trip) => (
          <Link
            key={trip.id}
            href={`/trips/${trip.id}`}
            className="group block bg-card border border-border rounded-xl p-6 hover:bg-card-hover hover:border-accent/20 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg font-medium text-foreground group-hover:text-accent transition-colors truncate">
                    {trip.title}
                  </h2>
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap',
                      statusColor(trip.status)
                    )}
                  >
                    {statusLabel(trip.status)}
                  </span>
                </div>

                <div className="flex items-center gap-5 text-sm text-muted">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {trip.client?.full_name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {trip.destination}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDateRange(trip.start_date, trip.end_date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Hotel className="w-3.5 h-3.5" />
                    {trip.hotel_bookings?.length || 0}{' '}
                    {(trip.hotel_bookings?.length || 0) === 1
                      ? 'property'
                      : 'properties'}
                  </span>
                </div>

                {/* Hotel tags */}
                {trip.hotel_bookings && trip.hotel_bookings.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {trip.hotel_bookings.map((b) => (
                      <span
                        key={b.id}
                        className="px-2.5 py-1 bg-zinc-800/50 rounded-md text-[11px] text-zinc-400"
                      >
                        {b.hotel_contact?.hotel_name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 ml-4">
                <div className="text-right">
                  <p className="text-xs text-muted">Consultant</p>
                  <p className="text-sm text-foreground">
                    {trip.consultant?.full_name}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
              </div>
            </div>
          </Link>
        ))}

        {filteredTrips.length === 0 && (
          <div className="text-center py-16 text-muted">
            No trips match your search.
          </div>
        )}
      </div>
    </div>
  );
}
