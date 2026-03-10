'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Hotel,
  FileText,
  Mail,
  Sparkles,
  Send,
  MessageSquare,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  File,
} from 'lucide-react';
import type {
  Trip,
  HotelBooking,
  EmailDraft,
  BookingBrief,
  TravelPreference,
  Document as DocType,
  WorkflowEvent,
  WorkflowStatus,
  Traveller,
} from '@/types/database';
import {
  formatDateRange,
  formatTimeAgo,
  statusLabel,
  statusColor,
  cn,
} from '@/lib/utils/format';
import TripTimeline from './timeline';

interface TripDetail extends Trip {
  travellers: Traveller[];
  hotel_bookings: (HotelBooking & {
    hotel_contact?: { hotel_name: string; contact_name: string; contact_email: string; location: string };
    email_drafts?: EmailDraft[];
  })[];
  documents: DocType[];
  preferences: TravelPreference[];
  briefs: BookingBrief[];
  workflow_events: WorkflowEvent[];
}

export default function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [trip, setTrip] = useState<TripDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeBooking, setActiveBooking] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);

  const loadTrip = () =>
    fetch(`/api/trips/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTrip(data);
        setLoading(false);
        if (data.hotel_bookings?.length > 0) {
          setActiveBooking((prev) => prev ?? data.hotel_bookings[0].id);
        }
      });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadTrip(); }, [id]);

  const generateBrief = async (bookingId: string) => {
    setGenerating('brief-' + bookingId);
    await fetch('/api/briefs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId: id, bookingId }),
    });
    await loadTrip();
    setGenerating(null);
  };

  const generateEmail = async (bookingId: string) => {
    setGenerating('email-' + bookingId);
    await fetch('/api/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId: id, bookingId }),
    });
    await loadTrip();
    setGenerating(null);
  };

  const sendEmail = async (emailId: string) => {
    setGenerating('send-' + emailId);
    await fetch(`/api/emails/${emailId}/send`, { method: 'POST' });
    await loadTrip();
    setGenerating(null);
  };

  const simulateReply = async (emailId: string) => {
    setGenerating('reply-' + emailId);
    await fetch(`/api/emails/${emailId}/simulate-reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    await loadTrip();
    setGenerating(null);
  };

  const updateBookingStatus = async (
    bookingId: string,
    status: WorkflowStatus
  ) => {
    await fetch(`/api/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    await loadTrip();
  };

  if (loading || !trip) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted">Loading trip...</div>
      </div>
    );
  }

  const currentBooking = trip.hotel_bookings.find(
    (b) => b.id === activeBooking
  );
  const currentBriefs = trip.briefs.filter(
    (b) => b.hotel_booking_id === activeBooking
  );
  const currentEmails = currentBooking?.email_drafts || [];
  const bookingEvents = trip.workflow_events.filter(
    (e) => e.hotel_booking_id === activeBooking
  );

  return (
    <div className="px-8 py-6 max-w-[1600px]">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/workspace/trips"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to trips
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-light tracking-wide">
                {trip.title}
              </h1>
              <span
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-[11px] font-medium',
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
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="text-muted">Consultant</p>
            <p className="text-foreground">{trip.consultant?.full_name}</p>
          </div>
        </div>
      </div>

      {/* Internal Notes */}
      {trip.internal_notes && (
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <p className="text-xs text-accent uppercase tracking-wider mb-2">
            Internal Notes
          </p>
          <p className="text-sm text-muted leading-relaxed">
            {trip.internal_notes}
          </p>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Journey Timeline */}
        <div className="col-span-3">
          <div className="bg-card border border-border rounded-xl p-4 sticky top-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            <TripTimeline
              bookings={trip.hotel_bookings}
              tripStart={trip.start_date}
              tripEnd={trip.end_date}
              destination={trip.destination}
              activeBooking={activeBooking}
              onSelectBooking={setActiveBooking}
            />
          </div>
        </div>

        {/* Center Column: Hotel Bookings Workspace */}
        <div className="col-span-5 space-y-6">
          {/* Hotel Booking Tabs */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex border-b border-border">
              {trip.hotel_bookings.map((booking) => (
                <button
                  key={booking.id}
                  onClick={() => setActiveBooking(booking.id)}
                  className={cn(
                    'flex-1 px-4 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px',
                    activeBooking === booking.id
                      ? 'border-accent text-accent bg-accent/5'
                      : 'border-transparent text-muted hover:text-foreground hover:bg-card-hover'
                  )}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Hotel className="w-3.5 h-3.5" />
                    <span className="truncate">
                      {booking.hotel_contact?.hotel_name}
                    </span>
                  </div>
                  <p className="text-[10px] mt-0.5 opacity-60">
                    {formatDateRange(booking.check_in, booking.check_out)}
                  </p>
                </button>
              ))}
            </div>

            {currentBooking && (
              <div className="p-6">
                {/* Booking Details */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-foreground">
                      {currentBooking.hotel_contact?.hotel_name}
                    </h3>
                    <p className="text-sm text-muted">
                      {currentBooking.hotel_contact?.location} &middot;{' '}
                      {currentBooking.room_type} &middot;{' '}
                      {currentBooking.guests} guests
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'px-2.5 py-1 rounded-full text-[11px] font-medium',
                        statusColor(currentBooking.status)
                      )}
                    >
                      {statusLabel(currentBooking.status)}
                    </span>
                    {/* Status dropdown */}
                    <StatusDropdown
                      currentStatus={currentBooking.status}
                      onSelect={(s) =>
                        updateBookingStatus(currentBooking.id, s)
                      }
                    />
                  </div>
                </div>

                {currentBooking.special_requests && (
                  <div className="bg-background rounded-lg p-4 mb-6 border border-border/50">
                    <p className="text-xs text-accent uppercase tracking-wider mb-1.5">
                      Special Requests
                    </p>
                    <p className="text-sm text-muted">
                      {currentBooking.special_requests}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => generateBrief(currentBooking.id)}
                    disabled={generating !== null}
                    className="flex items-center gap-2 px-4 py-2.5 bg-accent/10 text-accent rounded-lg text-sm hover:bg-accent/20 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    {generating === 'brief-' + currentBooking.id
                      ? 'Generating...'
                      : 'Generate Brief'}
                  </button>
                  <button
                    onClick={() => generateEmail(currentBooking.id)}
                    disabled={generating !== null}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-900/20 text-blue-300 rounded-lg text-sm hover:bg-blue-900/30 transition-colors disabled:opacity-50"
                  >
                    <Mail className="w-4 h-4" />
                    {generating === 'email-' + currentBooking.id
                      ? 'Generating...'
                      : 'Generate Email Draft'}
                  </button>
                </div>

                {/* Booking Brief Panel */}
                {currentBriefs.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xs text-accent uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      Booking Brief
                    </h4>
                    <div className="bg-background border border-border/50 rounded-lg p-5">
                      <div className="prose prose-sm prose-invert max-w-none">
                        {currentBriefs[currentBriefs.length - 1].content
                          .split('\n')
                          .map((line, i) => {
                            if (line.startsWith('## '))
                              return (
                                <h2
                                  key={i}
                                  className="text-base font-medium text-foreground mt-0 mb-2"
                                >
                                  {line.replace('## ', '')}
                                </h2>
                              );
                            if (line.startsWith('### '))
                              return (
                                <h3
                                  key={i}
                                  className="text-sm font-medium text-accent mt-4 mb-1"
                                >
                                  {line.replace('### ', '')}
                                </h3>
                              );
                            if (line.startsWith('- '))
                              return (
                                <p
                                  key={i}
                                  className="text-sm text-muted ml-4 mb-0.5"
                                >
                                  {line}
                                </p>
                              );
                            if (line.startsWith('**'))
                              return (
                                <p
                                  key={i}
                                  className="text-sm text-foreground/80 mb-0.5"
                                >
                                  {line.replace(/\*\*/g, '')}
                                </p>
                              );
                            if (line.trim() === '') return <br key={i} />;
                            return (
                              <p
                                key={i}
                                className="text-sm text-muted mb-0.5"
                              >
                                {line}
                              </p>
                            );
                          })}
                      </div>
                      <p className="text-[10px] text-muted/50 mt-3">
                        Generated{' '}
                        {formatTimeAgo(
                          currentBriefs[currentBriefs.length - 1].generated_at
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* Email Drafts */}
                {currentEmails.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xs text-accent uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" />
                      Email History
                    </h4>
                    <div className="space-y-3">
                      {currentEmails.map((email) => (
                        <div
                          key={email.id}
                          className="bg-background border border-border/50 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {email.subject}
                              </p>
                              <p className="text-xs text-muted">
                                To: {email.to_email}
                              </p>
                            </div>
                            <span
                              className={cn(
                                'px-2 py-0.5 rounded-full text-[10px] font-medium',
                                email.status === 'draft'
                                  ? 'bg-zinc-700 text-zinc-300'
                                  : email.status === 'sent'
                                    ? 'bg-purple-900/50 text-purple-300'
                                    : 'bg-emerald-900/50 text-emerald-300'
                              )}
                            >
                              {email.status === 'reply_received'
                                ? 'Reply Received'
                                : email.status.charAt(0).toUpperCase() +
                                  email.status.slice(1)}
                            </span>
                          </div>

                          <pre className="text-xs text-muted/80 whitespace-pre-wrap font-sans leading-relaxed max-h-40 overflow-y-auto mb-3">
                            {email.body}
                          </pre>

                          {/* Reply */}
                          {email.reply_body && (
                            <div className="mt-3 pt-3 border-t border-border/50">
                              <p className="text-xs text-emerald-400 mb-1 flex items-center gap-1.5">
                                <MessageSquare className="w-3 h-3" />
                                Hotel Reply
                              </p>
                              <pre className="text-xs text-muted/80 whitespace-pre-wrap font-sans leading-relaxed max-h-32 overflow-y-auto">
                                {email.reply_body}
                              </pre>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 mt-3">
                            {email.status === 'draft' && (
                              <button
                                onClick={() => sendEmail(email.id)}
                                disabled={generating !== null}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-900/20 text-purple-300 rounded-md text-xs hover:bg-purple-900/30 transition-colors disabled:opacity-50"
                              >
                                <Send className="w-3 h-3" />
                                {generating === 'send-' + email.id
                                  ? 'Sending...'
                                  : 'Mark as Sent'}
                              </button>
                            )}
                            {email.status === 'sent' && (
                              <button
                                onClick={() => simulateReply(email.id)}
                                disabled={generating !== null}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/20 text-emerald-300 rounded-md text-xs hover:bg-emerald-900/30 transition-colors disabled:opacity-50"
                              >
                                <MessageSquare className="w-3 h-3" />
                                {generating === 'reply-' + email.id
                                  ? 'Simulating...'
                                  : 'Simulate Reply'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                {bookingEvents.length > 0 && (
                  <div>
                    <h4 className="text-xs text-accent uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      Status Timeline
                    </h4>
                    <div className="space-y-0">
                      {bookingEvents.map((event, i) => (
                        <div key={event.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div
                              className={cn(
                                'w-2 h-2 rounded-full mt-1.5',
                                i === 0 ? 'bg-accent' : 'bg-zinc-600'
                              )}
                            />
                            {i < bookingEvents.length - 1 && (
                              <div className="w-px flex-1 bg-zinc-700/50 my-1" />
                            )}
                          </div>
                          <div className="pb-4">
                            <p className="text-sm text-foreground">
                              {event.note}
                            </p>
                            <p className="text-[10px] text-muted">
                              {formatTimeAgo(event.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Travellers, Preferences, Documents */}
        <div className="col-span-4 space-y-6">
          {/* Travellers */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-xs text-accent uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              Travellers
            </h3>
            <div className="space-y-3">
              {trip.travellers.map((t) => (
                <div key={t.id} className="text-sm">
                  <p className="text-foreground font-medium">{t.full_name}</p>
                  <div className="text-xs text-muted space-y-0.5 mt-0.5">
                    {t.passport_nationality && (
                      <p>{t.passport_nationality}</p>
                    )}
                    {t.dietary_requirements && (
                      <p className="text-amber-400/80">
                        {t.dietary_requirements}
                      </p>
                    )}
                    {t.special_requests && (
                      <p className="text-muted/70">{t.special_requests}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          {trip.preferences.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-xs text-accent uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" />
                Preferences
              </h3>
              <div className="space-y-3">
                {trip.preferences.map((pref) => (
                  <div key={pref.id} className="text-sm">
                    <p className="text-foreground/80 font-medium text-xs">
                      {pref.preference_key}
                    </p>
                    <p className="text-muted text-xs mt-0.5">
                      {pref.preference_value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-xs text-accent uppercase tracking-wider mb-3 flex items-center gap-2">
              <File className="w-3.5 h-3.5" />
              Documents
            </h3>
            <div className="space-y-2">
              {trip.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-background border border-border/50"
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      doc.status === 'completed'
                        ? 'bg-emerald-900/30'
                        : doc.status === 'missing'
                          ? 'bg-red-900/30'
                          : 'bg-amber-900/30'
                    )}
                  >
                    {doc.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : doc.status === 'missing' ? (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate">
                      {doc.file_name}
                    </p>
                    <p className="text-[10px] text-muted capitalize">
                      {doc.category.replace(/_/g, ' ')} &middot;{' '}
                      {doc.status}
                    </p>
                  </div>
                </div>
              ))}
              {trip.documents.length === 0 && (
                <p className="text-xs text-muted text-center py-4">
                  No documents linked
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Status dropdown component
function StatusDropdown({
  currentStatus,
  onSelect,
}: {
  currentStatus: WorkflowStatus;
  onSelect: (status: WorkflowStatus) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const statuses: WorkflowStatus[] = [
    'not_started',
    'brief_ready',
    'draft_created',
    'sent',
    'awaiting_reply',
    'confirmed',
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-md hover:bg-card-hover transition-colors"
      >
        <ChevronDown className="w-3.5 h-3.5 text-muted" />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-xl z-50 min-w-[160px] overflow-hidden">
            <div className="px-3 py-1.5 border-b border-border">
              <p className="text-[10px] text-muted uppercase tracking-wider">
                Update Status
              </p>
            </div>
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onSelect(s);
                  setIsOpen(false);
                }}
                className={cn(
                  'block w-full text-left px-3 py-2 text-xs hover:bg-card-hover transition-colors',
                  s === currentStatus
                    ? 'text-accent'
                    : 'text-muted hover:text-foreground'
                )}
              >
                {statusLabel(s)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
