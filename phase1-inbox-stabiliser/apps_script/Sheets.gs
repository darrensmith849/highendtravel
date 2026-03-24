/**
 * Sheets.gs — Google Sheets helper functions
 */

/**
 * Get all tracker rows as objects (skips header).
 * Returns array of { rowIndex (1-based sheet row), ...fields }.
 */
function getTrackerRows() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(TAB.INBOX);
  if (!sheet) throw new Error('INBOX_TRACKER tab not found');

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return []; // header only

  const headers = data[0];
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    const row = { _rowIndex: i + 1 }; // 1-based sheet row
    headers.forEach((h, j) => { row[h] = data[i][j]; });
    rows.push(row);
  }
  return rows;
}

/**
 * Find a tracker row by gmailThreadId.
 * Returns { _rowIndex, ...fields } or null.
 */
function findRowByThreadId(threadId) {
  const rows = getTrackerRows();
  return rows.find(r => r.gmailThreadId === threadId) || null;
}

/**
 * Append a new row to the INBOX_TRACKER tab.
 */
function appendTrackerRow(values) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(TAB.INBOX);
  sheet.appendRow(values);
}

/**
 * Update a specific cell in the INBOX_TRACKER.
 * @param {number} rowIndex - 1-based row number
 * @param {number} colIndex - 1-based column number (use COL.INBOX.*)
 * @param {*} value
 */
function updateTrackerCell(rowIndex, colIndex, value) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(TAB.INBOX);
  sheet.getRange(rowIndex, colIndex).setValue(value);
}

/**
 * Update multiple cells in a tracker row.
 * @param {number} rowIndex
 * @param {Object} updates - { colIndex: value, ... }
 */
function updateTrackerRow(rowIndex, updates) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(TAB.INBOX);
  for (const [col, val] of Object.entries(updates)) {
    sheet.getRange(rowIndex, parseInt(col, 10)).setValue(val);
  }
}

/**
 * Get contacts as a map: email → { name, phone, preferenceNotes, vipFlag }
 */
function getContactsMap() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(TAB.CONTACTS);
  if (!sheet) return {};

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return {};

  const map = {};
  for (let i = 1; i < data.length; i++) {
    const email = String(data[i][0]).trim().toLowerCase();
    if (email) {
      map[email] = {
        name:            data[i][1] || '',
        phone:           data[i][2] || '',
        preferenceNotes: data[i][3] || '',
        vipFlag:         data[i][4] || false,
      };
    }
  }
  return map;
}

/**
 * Get all templates as a map: templateKey → { templateName, subjectTemplate, bodyTemplate, category, enabled }
 */
function getTemplatesMap() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(TAB.TEMPLATES);
  if (!sheet) return {};

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return {};

  const map = {};
  for (let i = 1; i < data.length; i++) {
    const key = String(data[i][0]).trim();
    if (key) {
      map[key] = {
        templateName:    data[i][1] || '',
        subjectTemplate: data[i][2] || '',
        bodyTemplate:    data[i][3] || '',
        category:        data[i][4] || '',
        enabled:         String(data[i][5]).toLowerCase() !== 'false',
      };
    }
  }
  return map;
}

/**
 * Get keyword rules as array: [{ category, keyword, templateKey, priorityOverride }]
 */
function getKeywordRules() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(TAB.KEYWORDS);
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const rules = [];
  for (let i = 1; i < data.length; i++) {
    rules.push({
      category:         String(data[i][0]).trim(),
      keyword:          String(data[i][1]).trim().toLowerCase(),
      templateKey:      String(data[i][2]).trim(),
      priorityOverride: String(data[i][3]).trim() || null,
    });
  }
  return rules;
}
