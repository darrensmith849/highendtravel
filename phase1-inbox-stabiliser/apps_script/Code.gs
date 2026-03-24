/**
 * Code.gs — Main entry points for Inbox Stabiliser
 *
 * SAFETY: This system NEVER sends emails automatically.
 * It creates Gmail DRAFTS only. A human must review and click Send.
 */

// ═════════════════════════════════════════════════════════════════
// A) INGEST THREADS
// ═════════════════════════════════════════════════════════════════

/**
 * Query Gmail for new threads and add them to the INBOX_TRACKER.
 * Respects maxThreadsPerRun and excludes processed threads.
 */
function ingestThreads() {
  const settings = getSettings();
  const query = settings.inboxQuery;
  const maxThreads = settings.maxThreadsPerRun;

  Logger.log('Ingesting threads. Query: ' + query + ', Max: ' + maxThreads);

  const threads = searchThreads(query, maxThreads);
  let added = 0;
  let skipped = 0;

  for (const thread of threads) {
    const meta = getThreadMetadata(thread);

    // Skip excluded senders (bounces, noreply, newsletters)
    if (isExcludedSender(meta.fromEmail)) {
      Logger.log('Skipping excluded sender: ' + meta.fromEmail);
      applyLabel(thread, settings.processedLabel);
      skipped++;
      continue;
    }

    // Check if already in tracker
    const existing = findRowByThreadId(meta.threadId);
    if (existing) {
      // Update snippet and timestamp only
      updateTrackerRow(existing._rowIndex, {
        [COL.INBOX.lastMessageSnippet]: meta.snippet,
        [COL.INBOX.lastUpdatedAt]:      new Date(),
      });
      skipped++;
      continue;
    }

    // Generate threadKey
    const threadKey = 'T-' + meta.threadId.substring(0, 8).toUpperCase();

    if (settings.dryRun) {
      Logger.log('[DRY RUN] Would add thread: ' + meta.subject);
      added++;
      continue;
    }

    // Append new row
    appendTrackerRow([
      threadKey,                    // threadKey
      meta.threadId,                // gmailThreadId
      meta.threadLink,              // gmailThreadLink
      meta.fromEmail,               // fromEmail
      meta.fromName,                // fromName
      meta.subject,                 // subject
      meta.snippet,                 // lastMessageSnippet
      meta.receivedAt,              // receivedAt
      new Date(),                   // lastUpdatedAt
      STATUS.NEW,                   // status
      PRIORITY.MEDIUM,              // priority (default)
      '',                           // category (set by classifier)
      '',                           // owner
      '',                           // suggestedTemplate
      DRAFT_STATUS.NONE,            // draftStatus
      '',                           // draftId
      '',                           // lastRepliedAt
      '',                           // notes
    ]);

    // Label as processed in Gmail
    applyLabel(thread, settings.processedLabel);
    applyLabel(thread, settings.inboxLabel);

    added++;
    Logger.log('Added: ' + meta.subject + ' from ' + meta.fromEmail);
  }

  Logger.log('Ingest complete. Added: ' + added + ', Skipped: ' + skipped);

  // Auto-classify newly added rows
  if (added > 0) {
    classifyNewRows();
  }
}

/**
 * Classify any rows that have no category yet.
 */
function classifyNewRows() {
  const rows = getTrackerRows();
  let classified = 0;

  for (const row of rows) {
    if (!row.category || row.category === '') {
      classifyAndUpdateRow(row);
      classified++;
    }
  }
  Logger.log('Classified ' + classified + ' new rows.');
}


// ═════════════════════════════════════════════════════════════════
// C) CREATE DRAFT REPLY (single thread)
// ═════════════════════════════════════════════════════════════════

/**
 * Create a draft reply for a single tracker row.
 * Can be called from the Sheet via custom menu or by batch functions.
 *
 * @param {number} sheetRowIndex - 1-based row index in INBOX_TRACKER
 */
function createDraftForRow(sheetRowIndex) {
  const settings = getSettings();
  const contactsMap = getContactsMap();
  const rows = getTrackerRows();

  const row = rows.find(r => r._rowIndex === sheetRowIndex);
  if (!row) {
    Logger.log('Row not found: ' + sheetRowIndex);
    return;
  }

  const status = String(row.status || '').toUpperCase();
  if (status !== STATUS.NEW && status !== STATUS.NEEDS_REPLY) {
    Logger.log('Row ' + sheetRowIndex + ' status is ' + status + ', skipping draft.');
    return;
  }

  const draftStatus = String(row.draftStatus || '').toUpperCase();
  if (draftStatus === DRAFT_STATUS.CREATED) {
    Logger.log('Row ' + sheetRowIndex + ' already has a draft.');
    return;
  }

  const templateKey = row.suggestedTemplate || 'ACK_GENERAL';

  if (settings.dryRun) {
    Logger.log('[DRY RUN] Would create draft for row ' + sheetRowIndex +
      ' using template ' + templateKey);
    return;
  }

  const rendered = renderDraft(templateKey, row, contactsMap, settings);
  if (!rendered) {
    Logger.log('Failed to render template ' + templateKey + ' for row ' + sheetRowIndex);
    return;
  }

  const draftId = createDraftReply(row.gmailThreadId, rendered.body, rendered.subject);

  updateTrackerRow(sheetRowIndex, {
    [COL.INBOX.draftStatus]:   DRAFT_STATUS.CREATED,
    [COL.INBOX.draftId]:       draftId,
    [COL.INBOX.lastUpdatedAt]: new Date(),
  });

  // Apply auto label
  try {
    const thread = GmailApp.getThreadById(row.gmailThreadId);
    if (thread) applyLabel(thread, settings.autoLabel);
  } catch (e) {
    Logger.log('Warning: could not apply auto label');
  }

  Logger.log('Draft created for row ' + sheetRowIndex + ', draftId: ' + draftId);
}

/**
 * Create drafts for all eligible rows (NEW/NEEDS_REPLY + no draft).
 */
function createDraftsForAll() {
  const settings = getSettings();
  const rows = getTrackerRows();
  let count = 0;

  for (const row of rows) {
    if (count >= settings.maxThreadsPerRun) break;

    const status = String(row.status || '').toUpperCase();
    const draftStatus = String(row.draftStatus || '').toUpperCase();

    if ((status === STATUS.NEW || status === STATUS.NEEDS_REPLY) &&
        (draftStatus === DRAFT_STATUS.NONE || draftStatus === '')) {
      createDraftForRow(row._rowIndex);
      count++;
    }
  }

  Logger.log('Batch draft creation complete. Created: ' + count);
}


// ═════════════════════════════════════════════════════════════════
// E) SYNC SENT STATUS
// ═════════════════════════════════════════════════════════════════

/**
 * Detect if a human sent a reply in Gmail and update the tracker.
 */
function syncSentStatus() {
  const settings = getSettings();
  const rows = getTrackerRows();
  let updated = 0;

  for (const row of rows) {
    const status = String(row.status || '').toUpperCase();

    // Only check rows that might have pending replies
    if (status === STATUS.CLOSED || status === STATUS.WAITING_CLIENT) continue;

    const threadId = row.gmailThreadId;
    if (!threadId) continue;

    try {
      const thread = GmailApp.getThreadById(threadId);
      if (!thread) continue;

      const receivedAt = row.receivedAt instanceof Date ?
        row.receivedAt : new Date(row.receivedAt);
      if (isNaN(receivedAt.getTime())) continue;

      const reply = hasOurReplyAfter(thread, receivedAt);

      if (reply.replied) {
        const newStatus = STATUS.WAITING_CLIENT;

        if (settings.dryRun) {
          Logger.log('[DRY RUN] Would mark row ' + row._rowIndex + ' as ' + newStatus);
          continue;
        }

        updateTrackerRow(row._rowIndex, {
          [COL.INBOX.status]:        newStatus,
          [COL.INBOX.lastRepliedAt]: reply.replyDate,
          [COL.INBOX.lastUpdatedAt]: new Date(),
        });

        // Update Gmail labels
        removeLabel(thread, settings.needsReplyLabel);
        applyLabel(thread, settings.waitingClientLabel);

        updated++;
        Logger.log('Synced sent status for thread ' + threadId);
      }
    } catch (e) {
      Logger.log('Error syncing thread ' + threadId + ': ' + e.message);
    }
  }

  Logger.log('Sent sync complete. Updated: ' + updated);
}


// ═════════════════════════════════════════════════════════════════
// F) DAILY SUMMARY REPORT
// ═════════════════════════════════════════════════════════════════

/**
 * Write summary metrics to the REPORTING tab.
 */
function dailySummaryReport() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(TAB.REPORTING);
  if (!sheet) {
    sheet = ss.insertSheet(TAB.REPORTING);
  }

  const rows = getTrackerRows();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Count by status
  const statusCounts = {};
  Object.values(STATUS).forEach(s => { statusCounts[s] = 0; });
  let oldestNeedsReply = null;
  let draftsTodayCount = 0;
  let sentTodayCount = 0;
  const ownerCounts = {};

  for (const row of rows) {
    const status = String(row.status || '').toUpperCase();
    if (statusCounts[status] !== undefined) statusCounts[status]++;

    // Oldest NEEDS_REPLY
    if (status === STATUS.NEW || status === STATUS.NEEDS_REPLY) {
      const received = row.receivedAt instanceof Date ?
        row.receivedAt : new Date(row.receivedAt);
      if (!isNaN(received.getTime())) {
        if (!oldestNeedsReply || received < oldestNeedsReply) {
          oldestNeedsReply = received;
        }
      }
    }

    // Drafts created today (approximate: check lastUpdatedAt + draftStatus)
    if (row.draftStatus === DRAFT_STATUS.CREATED) {
      const updated = row.lastUpdatedAt instanceof Date ?
        row.lastUpdatedAt : new Date(row.lastUpdatedAt);
      if (!isNaN(updated.getTime()) && updated >= todayStart) {
        draftsTodayCount++;
      }
    }

    // Sent today
    if (row.lastRepliedAt) {
      const replied = row.lastRepliedAt instanceof Date ?
        row.lastRepliedAt : new Date(row.lastRepliedAt);
      if (!isNaN(replied.getTime()) && replied >= todayStart) {
        sentTodayCount++;
      }
    }

    // Per-owner
    const owner = String(row.owner || 'Unassigned');
    ownerCounts[owner] = (ownerCounts[owner] || 0) + 1;
  }

  const oldestAge = oldestNeedsReply ?
    Math.round((now - oldestNeedsReply) / (24 * 60 * 60 * 1000)) + ' days' :
    'N/A';

  // Write report
  sheet.clear();
  const reportData = [
    ['DAILY SUMMARY REPORT', Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm')],
    [''],
    ['BACKLOG BY STATUS'],
    ['NEW', statusCounts.NEW || 0],
    ['NEEDS_REPLY', statusCounts.NEEDS_REPLY || 0],
    ['WAITING_CLIENT', statusCounts.WAITING_CLIENT || 0],
    ['WAITING_PARTNER', statusCounts.WAITING_PARTNER || 0],
    ['CLOSED', statusCounts.CLOSED || 0],
    ['ESCALATE', statusCounts.ESCALATE || 0],
    [''],
    ['Total Open (excl. Closed)', rows.length - (statusCounts.CLOSED || 0)],
    ['Oldest Unreplied', oldestAge],
    ['Drafts Created Today', draftsTodayCount],
    ['Sent Today', sentTodayCount],
    [''],
    ['PER-AGENT WORKLOAD'],
  ];

  for (const [owner, count] of Object.entries(ownerCounts)) {
    reportData.push([owner, count]);
  }

  sheet.getRange(1, 1, reportData.length, 2).setValues(
    reportData.map(r => [r[0] || '', r[1] !== undefined ? r[1] : ''])
  );

  Logger.log('Daily summary report written.');
}


// ═════════════════════════════════════════════════════════════════
// G) TRIGGERS + MENU
// ═════════════════════════════════════════════════════════════════

/**
 * Install time-driven triggers.
 * Run this ONCE from the script editor.
 */
function installTriggers() {
  // Clear existing triggers from this project
  const existing = ScriptApp.getProjectTriggers();
  for (const trigger of existing) {
    ScriptApp.deleteTrigger(trigger);
  }

  // Ingest every 15 minutes
  ScriptApp.newTrigger('ingestThreads')
    .timeBased()
    .everyMinutes(15)
    .create();

  // Backlog batch 3x per day (every 8 hours)
  ScriptApp.newTrigger('backlogBatchDrafts')
    .timeBased()
    .everyHours(8)
    .create();

  // Sync sent status every hour
  ScriptApp.newTrigger('syncSentStatus')
    .timeBased()
    .everyHours(1)
    .create();

  // Daily summary at 5pm
  ScriptApp.newTrigger('dailySummaryReport')
    .timeBased()
    .atHour(17)
    .everyDays(1)
    .create();

  Logger.log('Triggers installed successfully.');
}

/**
 * Custom menu for the spreadsheet.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Inbox Stabiliser')
    .addItem('Ingest New Threads', 'ingestThreads')
    .addItem('Classify Unclassified', 'classifyNewRows')
    .addItem('Create Drafts (All Eligible)', 'createDraftsForAll')
    .addItem('Create Draft (Selected Row)', 'createDraftForSelectedRow')
    .addSeparator()
    .addItem('Backlog Batch Drafts', 'backlogBatchDrafts')
    .addItem('Sync Sent Status', 'syncSentStatus')
    .addItem('Daily Summary Report', 'dailySummaryReport')
    .addSeparator()
    .addItem('Install Triggers', 'installTriggers')
    .addToUi();
}

/**
 * Create draft for the currently selected row in the spreadsheet.
 */
function createDraftForSelectedRow() {
  const sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getName() !== TAB.INBOX) {
    SpreadsheetApp.getUi().alert('Please select a row in the INBOX_TRACKER tab.');
    return;
  }

  const rowIndex = sheet.getActiveRange().getRow();
  if (rowIndex <= 1) {
    SpreadsheetApp.getUi().alert('Please select a data row (not the header).');
    return;
  }

  createDraftForRow(rowIndex);
  SpreadsheetApp.getUi().alert('Draft created for row ' + rowIndex + '. Check your Gmail Drafts.');
}


// ═════════════════════════════════════════════════════════════════
// CONTACTS IMPORT
// ═════════════════════════════════════════════════════════════════

/**
 * Import a CSV file from Google Drive into the CONTACTS tab.
 * The CSV should have headers: email, name, phone, preferenceNotes, vipFlag
 *
 * @param {string} fileId - Google Drive file ID of the CSV
 */
function importContactsCsvFromDrive(fileId) {
  const file = DriveApp.getFileById(fileId);
  const csv = file.getBlob().getDataAsString();
  const rows = Utilities.parseCsv(csv);

  if (rows.length === 0) {
    Logger.log('CSV is empty.');
    return;
  }

  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(TAB.CONTACTS);
  if (!sheet) {
    sheet = ss.insertSheet(TAB.CONTACTS);
  }

  // Clear existing data (keep headers if importing fresh)
  sheet.clear();

  // Write headers
  sheet.getRange(1, 1, 1, 5).setValues([['email', 'name', 'phone', 'preferenceNotes', 'vipFlag']]);

  // Map CSV headers to our columns
  const csvHeaders = rows[0].map(h => h.trim().toLowerCase());
  const emailIdx = csvHeaders.indexOf('email');
  const nameIdx = csvHeaders.indexOf('name');
  const phoneIdx = csvHeaders.indexOf('phone');
  const notesIdx = csvHeaders.findIndex(h => h.includes('preference') || h.includes('notes'));
  const vipIdx = csvHeaders.findIndex(h => h.includes('vip'));

  if (emailIdx === -1) {
    Logger.log('CSV must have an "email" column.');
    return;
  }

  const outputRows = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const email = (r[emailIdx] || '').trim().toLowerCase();
    if (!email) continue;

    outputRows.push([
      email,
      nameIdx >= 0 ? (r[nameIdx] || '').trim() : '',
      phoneIdx >= 0 ? (r[phoneIdx] || '').trim() : '',
      notesIdx >= 0 ? (r[notesIdx] || '').trim() : '',
      vipIdx >= 0 ? (r[vipIdx] || '').trim() : '',
    ]);
  }

  if (outputRows.length > 0) {
    sheet.getRange(2, 1, outputRows.length, 5).setValues(outputRows);
  }

  Logger.log('Imported ' + outputRows.length + ' contacts from CSV.');
}
