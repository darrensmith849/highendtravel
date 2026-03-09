import { v4 as uuid } from 'uuid';
import { getDemoStore } from '@/lib/demo-data';
import type { GmailAdapter, GmailDraft } from './types';

export class MockGmailAdapter implements GmailAdapter {
  async createDraft(tenantId: string, params: {
    subject: string;
    body: string;
    toEmail: string;
    bookingId: string;
    userId: string;
  }): Promise<GmailDraft> {
    const store = getDemoStore();
    const now = new Date().toISOString();
    const draftId = `mock-draft-${uuid().slice(0, 8)}`;

    const emailDraft = {
      id: uuid(),
      tenant_id: tenantId,
      hotel_booking_id: params.bookingId,
      subject: params.subject,
      body: params.body,
      to_email: params.toEmail,
      status: 'draft' as const,
      gmail_draft_id: draftId,
      sent_at: null,
      reply_received_at: null,
      reply_body: null,
      created_by: params.userId,
      created_at: now,
      updated_at: now,
    };

    store.emailDrafts.push(emailDraft);

    return {
      id: emailDraft.id,
      draftId,
      subject: params.subject,
      body: params.body,
      toEmail: params.toEmail,
      status: 'draft',
      sentAt: null,
      replyReceivedAt: null,
      replyBody: null,
      createdAt: now,
    };
  }

  async listDrafts(tenantId: string, bookingId: string): Promise<GmailDraft[]> {
    const store = getDemoStore();
    if (store.tenant.id !== tenantId) return [];

    return store.emailDrafts
      .filter((d) => d.hotel_booking_id === bookingId)
      .map((d) => ({
        id: d.id,
        draftId: d.gmail_draft_id || '',
        subject: d.subject,
        body: d.body,
        toEmail: d.to_email,
        status: d.status,
        sentAt: d.sent_at,
        replyReceivedAt: d.reply_received_at,
        replyBody: d.reply_body,
        createdAt: d.created_at,
      }));
  }

  async markAsSent(tenantId: string, draftId: string): Promise<GmailDraft | null> {
    const store = getDemoStore();
    const draft = store.emailDrafts.find(
      (d) => d.tenant_id === tenantId && d.id === draftId
    );
    if (!draft) return null;

    const now = new Date().toISOString();
    draft.status = 'sent';
    draft.sent_at = now;
    draft.updated_at = now;

    return {
      id: draft.id,
      draftId: draft.gmail_draft_id || '',
      subject: draft.subject,
      body: draft.body,
      toEmail: draft.to_email,
      status: 'sent',
      sentAt: now,
      replyReceivedAt: null,
      replyBody: null,
      createdAt: draft.created_at,
    };
  }

  async simulateReply(tenantId: string, draftId: string, replyBody: string): Promise<GmailDraft | null> {
    const store = getDemoStore();
    const draft = store.emailDrafts.find(
      (d) => d.tenant_id === tenantId && d.id === draftId
    );
    if (!draft) return null;

    const now = new Date().toISOString();
    draft.status = 'reply_received';
    draft.reply_received_at = now;
    draft.reply_body = replyBody;
    draft.updated_at = now;

    return {
      id: draft.id,
      draftId: draft.gmail_draft_id || '',
      subject: draft.subject,
      body: draft.body,
      toEmail: draft.to_email,
      status: 'reply_received',
      sentAt: draft.sent_at,
      replyReceivedAt: now,
      replyBody: replyBody,
      createdAt: draft.created_at,
    };
  }
}
