# Phase 1: Inbox Stabiliser

**Gmail + Google Sheets + Apps Script — Draft-Only Automation**

A lightweight system to triage ~700 client emails, generate draft replies, and clear backlog. **No emails are ever sent automatically.** All drafts require human review and manual send.

---

## What This Does

1. **Ingests** incoming Gmail threads into a Google Sheet tracker (every 15 min)
2. **Classifies** threads by keyword → category + suggested template
3. **Generates Gmail drafts** using personalised templates (merge fields from a contacts list)
4. **Batch-processes backlog** threads older than a configurable threshold
5. **Syncs** sent status — detects when a human has replied
6. **Reports** daily metrics: backlog count, oldest unreplied, drafts created, sent count

## What This Does NOT Do

- Send any email automatically (drafts only)
- Replace a CRM or full client database
- Handle complex workflows, approvals, or partner management
- Integrate with Notion, ShareFile, or external systems
- Provide audit trails beyond basic timestamps

These capabilities are planned for **Phase 2** (full platform build).

---

## Prerequisites

- Google Workspace account with Gmail and Google Sheets access
- Permission to create Apps Script projects
- ~30 minutes for initial setup

---

## Setup Guide

### Step 1: Create the Google Sheet

1. Create a new Google Sheet named **"Inbox Tracker"**
2. Create these tabs (exact names):

| Tab | Purpose |
|---|---|
| `INBOX_TRACKER` | Main thread tracking |
| `CONTACTS` | Client contact info for mail merge |
| `TEMPLATES` | Email template registry |
| `KEYWORDS` | Classification rules |
| `SETTINGS` | System configuration |
| `REPORTING` | Daily metrics (auto-populated) |

3. Set up headers for each tab as described below.

#### INBOX_TRACKER Headers (Row 1)
```
threadKey | gmailThreadId | gmailThreadLink | fromEmail | fromName | subject | lastMessageSnippet | receivedAt | lastUpdatedAt | status | priority | category | owner | suggestedTemplate | draftStatus | draftId | lastRepliedAt | notes
```

#### CONTACTS Headers (Row 1)
```
email | name | phone | preferenceNotes | vipFlag
```

#### TEMPLATES Headers (Row 1)
```
templateKey | templateName | subjectTemplate | bodyTemplate | category | enabled
```

Populate with the templates from `templates/email_templates.md`. Each template becomes one row. Set `enabled` to `TRUE`.

Example row:
| templateKey | templateName | subjectTemplate | bodyTemplate | category | enabled |
|---|---|---|---|---|---|
| ACK_GENERAL | General Acknowledgement | Re: {{subject}} | Dear {{first_name}},\n\nThank you for your message... | GENERAL | TRUE |

#### KEYWORDS Headers (Row 1)
```
category | keyword | templateKey | priorityOverride
```

Starter rules:
| category | keyword | templateKey | priorityOverride |
|---|---|---|---|
| BOOKINGS | booking | BOOKING_ACK | |
| BOOKINGS | reservation | BOOKING_ACK | |
| BOOKINGS | itinerary | ITINERARY_UPDATE | |
| BILLING | invoice | BILLING_ACK | |
| BILLING | payment | BILLING_ACK | |
| BILLING | charge | BILLING_ACK | |
| SUPPORT | help | SUPPORT_ACK | |
| SUPPORT | issue | SUPPORT_ACK | |
| SUPPORT | problem | SUPPORT_ACK | HIGH |
| COMPLAINT | complaint | COMPLAINT_ACK | URGENT |
| COMPLAINT | disappointed | COMPLAINT_ACK | HIGH |
| COMPLAINT | unhappy | COMPLAINT_ACK | HIGH |
| BOOKINGS | confirm | CONFIRMATION_RECEIVED | |
| GENERAL | follow up | FOLLOW_UP_NO_RESPONSE | |

#### SETTINGS Tab (Row 1: key | value)
| key | value |
|---|---|
| processedLabel | TRIAGE/Processed |
| needsReplyLabel | TRIAGE/1-Needs Reply |
| waitingClientLabel | TRIAGE/2-Waiting Client |
| waitingPartnerLabel | TRIAGE/3-Waiting Partner |
| closedLabel | TRIAGE/4-Closed |
| escalateLabel | TRIAGE/Escalate |
| autoLabel | TRIAGE/Auto |
| inboxLabel | TRIAGE/0-Inbox |
| excludeLabels | PROMOTIONS,SPAM |
| inboxQuery | in:inbox -label:TRIAGE/Processed |
| replyFromName | [Your Team Name] |
| replyFromEmail | |
| signatureBlock | [Your Team Name]\n[Phone]\n[Website] |
| maxThreadsPerRun | 50 |
| backlogDaysThreshold | 14 |
| dryRun | true |

**Start with `dryRun = true`** to verify behaviour before creating real drafts.

### Step 2: Set Up Gmail Labels and Filters

Follow the instructions in `rules/gmail_labels_filters.md` to create all TRIAGE labels and recommended filters.

### Step 3: Add the Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete the default `Code.gs` content
3. Create the following files and paste the contents from the `apps_script/` folder:
   - `Config.gs`
   - `Code.gs`
   - `Gmail.gs`
   - `Sheets.gs`
   - `Templates.gs`
   - `Classifier.gs`
   - `Backlog.gs`
4. In `Config.gs`, set your `SPREADSHEET_ID`:
   - Go to **Project Settings** (gear icon) → **Script Properties**
   - Add property: `SPREADSHEET_ID` = your sheet's ID (the long string in the URL between `/d/` and `/edit`)
5. Save all files

### Step 4: Authorise the Script

1. From the Apps Script editor, select `onOpen` from the function dropdown
2. Click **Run**
3. Follow the authorisation prompts (review permissions for Gmail + Sheets + Drive)
4. Reload your spreadsheet — you should see the **"Inbox Stabiliser"** menu

### Step 5: Import Contacts (Optional)

If you have a Notion export or client contact CSV:

1. Upload the CSV to Google Drive
2. Get the file ID (from the sharing URL)
3. In Apps Script, run `importContactsCsvFromDrive('YOUR_FILE_ID')`
4. Or manually paste contacts into the CONTACTS tab

The CSV should have columns: `email`, `name`, `phone`, `preferenceNotes`, `vipFlag`

### Step 6: Test (Dry Run)

1. Ensure `dryRun` is `true` in SETTINGS
2. From the sheet menu: **Inbox Stabiliser → Ingest New Threads**
3. Check the Apps Script execution log (View → Executions) to see what would happen
4. Verify threads would be added correctly

### Step 7: Go Live

1. Set `dryRun` to `false` in SETTINGS
2. Run **Ingest New Threads** — threads should appear in the tracker
3. Run **Create Drafts (All Eligible)** — check Gmail Drafts folder
4. **Review each draft and manually click Send**
5. Run **Install Triggers** from the menu to enable automatic polling

### Step 8: Initial Backlog

For the first run against ~700 threads:

1. Adjust `maxThreadsPerRun` to `100` temporarily
2. Run **Ingest New Threads** several times (or wait for triggers)
3. Run **Backlog Batch Drafts** to generate drafts for older threads
4. Reset `maxThreadsPerRun` to `50` for ongoing use

---

## Daily Operating Procedure

### Morning
1. Open the Inbox Tracker spreadsheet
2. Check the **REPORTING** tab for overnight metrics
3. Review any `ESCALATE` or `URGENT` rows first

### Ongoing
1. The system ingests new threads every 15 minutes automatically
2. Check Gmail Drafts folder for auto-generated drafts
3. **Review each draft** → edit if needed → click Send
4. Update the `owner` column in the tracker to claim threads
5. Use the `notes` column for context

### Status Management
- System sets `NEW` on ingest
- System classifies and suggests templates
- System creates drafts (status stays `NEEDS_REPLY`)
- When you send a reply, `syncSentStatus` (hourly) detects it and moves to `WAITING_CLIENT`
- Manually set `WAITING_PARTNER`, `CLOSED`, or `ESCALATE` as needed

### End of Day
- Run **Daily Summary Report** (or wait for the 5pm auto-trigger)
- Review metrics and flag anything concerning

---

## What to Ask the Client For

Before deployment, gather:

1. **Gmail account access** — which mailbox(es) to monitor
2. **Internal email domain** — for the staff exclusion filter
3. **Signature block** — text to use in templates
4. **Notion export** — CSV of client contacts (email, name, phone at minimum)
5. **Priority clients** — any VIP list for the contacts tab
6. **Template customisation** — review and approve the 16 templates
7. **Team member list** — names/emails for the `owner` field

---

## Risks & Limitations

| Risk | Mitigation |
|---|---|
| Gmail API quotas (read limits) | maxThreadsPerRun caps batch size |
| Template mismatch (wrong reply) | Human review required before send |
| Duplicate drafts | System checks draftStatus before creating |
| Contacts not found | Falls back to email/name from thread |
| Thread re-processing | TRIAGE/Processed label prevents re-ingest |
| Script errors | Execution logs available in Apps Script |

**Limitations:**
- No thread merging or deduplication beyond Gmail's native threading
- No attachment handling in templates
- No multi-language support
- Classification is keyword-based only (no AI/NLP)
- No mobile app — operates via Gmail + Sheets on desktop

---

## Phase 2 Preview

Phase 2 (~3 months) will replace this with a full platform:

- **Relational database**: Client → Request → Stay → Partner model
- **Proper audit trail**: Full history, permissions, role-based access
- **Deeper Notion migration**: Complete data import with relationship mapping
- **ShareFile integration**: Document management pipeline
- **Reporting dashboard**: Real-time metrics, SLA tracking, workload analytics
- **Workflow engine**: Multi-step approval flows, partner coordination
- **AI classification**: ML-powered categorisation replacing keyword rules

Phase 1 data (tracker rows, contacts) will be migrated into Phase 2.

---

## File Reference

```
phase1-inbox-stabiliser/
├── README.md                          ← This file
├── apps_script/
│   ├── Code.gs                        ← Main entry points + triggers + menu
│   ├── Config.gs                      ← Settings, constants, enums
│   ├── Gmail.gs                       ← Gmail API helpers
│   ├── Sheets.gs                      ← Spreadsheet read/write helpers
│   ├── Templates.gs                   ← Template rendering engine
│   ├── Classifier.gs                  ← Keyword-based classification
│   └── Backlog.gs                     ← Batch draft generation
├── templates/
│   └── email_templates.md             ← 16 email templates with merge fields
└── rules/
    └── gmail_labels_filters.md        ← Gmail label + filter setup guide
```

---

## Safety Confirmation

**This system creates Gmail DRAFTS only. No email is ever sent automatically. A human must review and click Send for every outgoing message.**

All actions are logged with timestamps in the tracker sheet and Apps Script execution logs.
