/**
 * Classifier.gs — Keyword-based thread classification
 */

/**
 * Classify a tracker row using the KEYWORDS rules table.
 *
 * Scans subject + snippet against keyword rules.
 * Returns { category, suggestedTemplate, priority } or defaults.
 *
 * @param {Object} trackerRow - row from INBOX_TRACKER
 * @returns {{ category: string, suggestedTemplate: string, priority: string|null }}
 */
function classifyThread(trackerRow) {
  const rules = getKeywordRules();
  const searchText = (
    (trackerRow.subject || '') + ' ' +
    (trackerRow.lastMessageSnippet || '')
  ).toLowerCase();

  // Score each rule — first match wins (rules should be ordered by priority)
  for (const rule of rules) {
    if (rule.keyword && searchText.includes(rule.keyword)) {
      return {
        category:          rule.category || CATEGORY.GENERAL,
        suggestedTemplate: rule.templateKey || 'ACK_GENERAL',
        priority:          rule.priorityOverride || null,
      };
    }
  }

  // Default classification
  return {
    category:          CATEGORY.GENERAL,
    suggestedTemplate: 'ACK_GENERAL',
    priority:          null,
  };
}

/**
 * Apply classification to a tracker row and update the sheet.
 *
 * @param {Object} trackerRow - must include _rowIndex
 */
function classifyAndUpdateRow(trackerRow) {
  const result = classifyThread(trackerRow);

  const updates = {
    [COL.INBOX.category]:          result.category,
    [COL.INBOX.suggestedTemplate]: result.suggestedTemplate,
  };

  if (result.priority) {
    updates[COL.INBOX.priority] = result.priority;
  }

  updateTrackerRow(trackerRow._rowIndex, updates);
  Logger.log('Classified row ' + trackerRow._rowIndex + ': ' +
    result.category + ' → ' + result.suggestedTemplate);
}
