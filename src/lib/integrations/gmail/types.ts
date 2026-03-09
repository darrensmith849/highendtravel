export interface GmailDraft {
  id: string;
  draftId: string;
  subject: string;
  body: string;
  toEmail: string;
  status: 'draft' | 'sent' | 'reply_received';
  sentAt: string | null;
  replyReceivedAt: string | null;
  replyBody: string | null;
  createdAt: string;
}

export interface GmailAdapter {
  createDraft(tenantId: string, params: {
    subject: string;
    body: string;
    toEmail: string;
    bookingId: string;
    userId: string;
  }): Promise<GmailDraft>;

  listDrafts(tenantId: string, bookingId: string): Promise<GmailDraft[]>;

  markAsSent(tenantId: string, draftId: string): Promise<GmailDraft | null>;

  simulateReply(tenantId: string, draftId: string, replyBody: string): Promise<GmailDraft | null>;
}
