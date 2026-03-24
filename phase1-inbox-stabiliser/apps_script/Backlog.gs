/**
 * Backlog.gs — Batch draft generation for older threads
 */

/**
 * Generate drafts for backlog threads (older than threshold, no draft yet).
 *
 * Finds tracker rows that are:
 *   - status: NEW or NEEDS_REPLY
 *   - draftStatus: NONE
 *   - receivedAt older than backlogDaysThreshold
 *
 * Creates draft replies up to maxThreadsPerRun.
 */
function backlogBatchDrafts() {
  const settings = getSettings();
  const contactsMap = getContactsMap();
  const rows = getTrackerRows();
  const now = new Date();
  const thresholdMs = settings.backlogDaysThreshold * 24 * 60 * 60 * 1000;

  let processed = 0;

  for (const row of rows) {
    if (processed >= settings.maxThreadsPerRun) break;

    // Filter: only NEW or NEEDS_REPLY with no draft
    const status = String(row.status || '').toUpperCase();
    const draftStatus = String(row.draftStatus || '').toUpperCase();

    if (status !== STATUS.NEW && status !== STATUS.NEEDS_REPLY) continue;
    if (draftStatus !== DRAFT_STATUS.NONE && draftStatus !== '') continue;

    // Filter: must be older than threshold
    const receivedAt = row.receivedAt instanceof Date ? row.receivedAt : new Date(row.receivedAt);
    if (isNaN(receivedAt.getTime())) continue;
    if ((now - receivedAt) < thresholdMs) continue;

    // Skip excluded senders
    if (isExcludedSender(String(row.fromEmail || ''))) continue;

    // Determine template
    const templateKey = row.suggestedTemplate || 'ACK_GENERAL';

    if (settings.dryRun) {
      Logger.log('[DRY RUN] Would create draft for thread ' + row.gmailThreadId +
        ' using template ' + templateKey);
      processed++;
      continue;
    }

    try {
      const rendered = renderDraft(templateKey, row, contactsMap, settings);
      if (!rendered) {
        Logger.log('Skipping thread ' + row.gmailThreadId + ': template render failed');
        continue;
      }

      const draftId = createDraftReply(row.gmailThreadId, rendered.body, rendered.subject);

      // Update tracker
      updateTrackerRow(row._rowIndex, {
        [COL.INBOX.draftStatus]:   DRAFT_STATUS.CREATED,
        [COL.INBOX.draftId]:       draftId,
        [COL.INBOX.lastUpdatedAt]: new Date(),
        [COL.INBOX.status]:        STATUS.NEEDS_REPLY,
      });

      // Apply auto label
      try {
        const thread = GmailApp.getThreadById(row.gmailThreadId);
        if (thread) applyLabel(thread, settings.autoLabel);
      } catch (e) {
        Logger.log('Warning: could not apply label to thread ' + row.gmailThreadId);
      }

      Logger.log('Backlog draft created for thread ' + row.gmailThreadId);
      processed++;

    } catch (e) {
      Logger.log('Error creating backlog draft for ' + row.gmailThreadId + ': ' + e.message);
    }
  }

  Logger.log('Backlog batch complete. Processed: ' + processed);
}
