/**
 * Config.gs — Central configuration for Inbox Stabiliser
 * All settings are read from the SETTINGS tab of the spreadsheet.
 * This file provides defaults and accessors.
 */

// ── Spreadsheet ID ──────────────────────────────────────────────
// Set this to the ID of your Inbox Tracker spreadsheet.
// (The long string in the Sheet URL between /d/ and /edit)
const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || '';

// ── Tab names ───────────────────────────────────────────────────
const TAB = {
  INBOX:     'INBOX_TRACKER',
  CONTACTS:  'CONTACTS',
  TEMPLATES: 'TEMPLATES',
  KEYWORDS:  'KEYWORDS',
  SETTINGS:  'SETTINGS',
  REPORTING: 'REPORTING',
};

// ── Column maps (1-indexed) ─────────────────────────────────────
const COL = {
  INBOX: {
    threadKey:          1,
    gmailThreadId:      2,
    gmailThreadLink:    3,
    fromEmail:          4,
    fromName:           5,
    subject:            6,
    lastMessageSnippet: 7,
    receivedAt:         8,
    lastUpdatedAt:      9,
    status:            10,
    priority:          11,
    category:          12,
    owner:             13,
    suggestedTemplate: 14,
    draftStatus:       15,
    draftId:           16,
    lastRepliedAt:     17,
    notes:             18,
  },
};

// ── Status enums ────────────────────────────────────────────────
const STATUS = {
  NEW:              'NEW',
  NEEDS_REPLY:      'NEEDS_REPLY',
  WAITING_CLIENT:   'WAITING_CLIENT',
  WAITING_PARTNER:  'WAITING_PARTNER',
  CLOSED:           'CLOSED',
  ESCALATE:         'ESCALATE',
};

const PRIORITY = {
  LOW:    'LOW',
  MEDIUM: 'MEDIUM',
  HIGH:   'HIGH',
  URGENT: 'URGENT',
};

const CATEGORY = {
  GENERAL:   'GENERAL',
  BOOKINGS:  'BOOKINGS',
  BILLING:   'BILLING',
  SUPPORT:   'SUPPORT',
  COMPLAINT: 'COMPLAINT',
  OTHER:     'OTHER',
};

const DRAFT_STATUS = {
  NONE:         'NONE',
  CREATED:      'CREATED',
  NEEDS_REVIEW: 'NEEDS_REVIEW',
};

// ── Settings accessor ───────────────────────────────────────────

/**
 * Read all settings from the SETTINGS tab into a key→value object.
 * SETTINGS tab layout: Column A = key, Column B = value
 */
function getSettings() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(TAB.SETTINGS);
  if (!sheet) throw new Error('SETTINGS tab not found');

  const data = sheet.getDataRange().getValues();
  const settings = {};
  for (let i = 1; i < data.length; i++) { // skip header row
    const key = String(data[i][0]).trim();
    const val = String(data[i][1]).trim();
    if (key) settings[key] = val;
  }

  // Apply defaults
  return {
    processedLabel:       settings.processedLabel       || 'TRIAGE/Processed',
    needsReplyLabel:      settings.needsReplyLabel      || 'TRIAGE/1-Needs Reply',
    waitingClientLabel:   settings.waitingClientLabel    || 'TRIAGE/2-Waiting Client',
    waitingPartnerLabel:  settings.waitingPartnerLabel   || 'TRIAGE/3-Waiting Partner',
    closedLabel:          settings.closedLabel           || 'TRIAGE/4-Closed',
    escalateLabel:        settings.escalateLabel         || 'TRIAGE/Escalate',
    autoLabel:            settings.autoLabel             || 'TRIAGE/Auto',
    inboxLabel:           settings.inboxLabel            || 'TRIAGE/0-Inbox',
    excludeLabels:        settings.excludeLabels         || 'PROMOTIONS,SPAM',
    inboxQuery:           settings.inboxQuery            || 'in:inbox -label:TRIAGE/Processed',
    replyFromName:        settings.replyFromName         || '',
    replyFromEmail:       settings.replyFromEmail        || '',
    signatureBlock:       settings.signatureBlock        || '',
    maxThreadsPerRun:     parseInt(settings.maxThreadsPerRun, 10) || 50,
    backlogDaysThreshold: parseInt(settings.backlogDaysThreshold, 10) || 14,
    dryRun:               (settings.dryRun || 'false').toLowerCase() === 'true',
  };
}

/**
 * Get the main spreadsheet instance.
 */
function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}
