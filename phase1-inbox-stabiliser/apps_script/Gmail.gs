/**
 * Gmail.gs — Gmail helper functions
 */

/**
 * Search Gmail threads matching a query.
 * @param {string} query - Gmail search query
 * @param {number} maxResults
 * @returns {GmailThread[]}
 */
function searchThreads(query, maxResults) {
  return GmailApp.search(query, 0, maxResults);
}

/**
 * Extract metadata from the latest message in a thread.
 */
function getThreadMetadata(thread) {
  const messages = thread.getMessages();
  const latest = messages[messages.length - 1];
  const first = messages[0];

  return {
    threadId:    thread.getId(),
    threadLink:  'https://mail.google.com/mail/u/0/#inbox/' + thread.getId(),
    fromEmail:   extractEmail(latest.getFrom()),
    fromName:    extractName(latest.getFrom()),
    subject:     thread.getFirstMessageSubject(),
    snippet:     latest.getPlainBody().substring(0, 200),
    receivedAt:  first.getDate(),
    lastUpdated: latest.getDate(),
  };
}

/**
 * Check if the thread has any message sent from our account after a given date.
 * Used to detect if a human has replied.
 */
function hasOurReplyAfter(thread, afterDate) {
  const myEmail = Session.getActiveUser().getEmail().toLowerCase();
  const messages = thread.getMessages();
  for (const msg of messages) {
    const sender = extractEmail(msg.getFrom()).toLowerCase();
    if (sender === myEmail && msg.getDate() > afterDate) {
      return { replied: true, replyDate: msg.getDate() };
    }
  }
  return { replied: false };
}

/**
 * Create a draft reply to a thread.
 * @param {string} threadId - Gmail thread ID
 * @param {string} body - HTML body
 * @param {string} subject - subject line (optional override)
 * @returns {string} draft ID
 */
function createDraftReply(threadId, body, subject) {
  const thread = GmailApp.getThreadById(threadId);
  if (!thread) throw new Error('Thread not found: ' + threadId);

  const messages = thread.getMessages();
  const lastMsg = messages[messages.length - 1];

  const draft = lastMsg.createDraftReply(body, {
    htmlBody: body,
  });

  return draft.getId();
}

/**
 * Apply a Gmail label to a thread (creates label if missing).
 */
function applyLabel(thread, labelName) {
  let label = GmailApp.getUserLabelByName(labelName);
  if (!label) {
    label = GmailApp.createLabel(labelName);
  }
  thread.addLabel(label);
}

/**
 * Remove a Gmail label from a thread.
 */
function removeLabel(thread, labelName) {
  const label = GmailApp.getUserLabelByName(labelName);
  if (label) {
    thread.removeLabel(label);
  }
}

/**
 * Check if a thread has a specific label.
 */
function threadHasLabel(thread, labelName) {
  const labels = thread.getLabels();
  return labels.some(l => l.getName() === labelName);
}

// ── Utility ─────────────────────────────────────────────────────

/**
 * Extract email address from a "Name <email>" string.
 */
function extractEmail(fromStr) {
  const match = String(fromStr).match(/<([^>]+)>/);
  return match ? match[1].trim() : String(fromStr).trim();
}

/**
 * Extract display name from a "Name <email>" string.
 */
function extractName(fromStr) {
  const match = String(fromStr).match(/^([^<]+)</);
  return match ? match[1].trim().replace(/"/g, '') : '';
}

/**
 * Check if an email address matches patterns that should be excluded
 * (bounces, auto-replies, newsletters, noreply, etc.)
 */
function isExcludedSender(email) {
  const lower = email.toLowerCase();
  const patterns = [
    'noreply@', 'no-reply@', 'donotreply@', 'do-not-reply@',
    'mailer-daemon@', 'postmaster@',
    'notifications@', 'notification@',
    'newsletter@', 'news@',
    'unsubscribe', 'bounce',
  ];
  return patterns.some(p => lower.includes(p));
}
