/**
 * Templates.gs — Template rendering engine
 */

/**
 * Render a template by replacing merge fields with data.
 *
 * Supported merge fields:
 *   {{name}}, {{first_name}}, {{email}}, {{subject}},
 *   {{company}}, {{reference}}, {{next_steps}},
 *   {{phone}}, {{preference_notes}}, {{signature}}
 *
 * @param {string} templateStr - The template string with {{field}} placeholders
 * @param {Object} data - Key-value pairs for substitution
 * @returns {string} Rendered string
 */
function renderTemplate(templateStr, data) {
  if (!templateStr) return '';

  let result = templateStr;
  for (const [key, value] of Object.entries(data)) {
    const placeholder = new RegExp('\\{\\{' + key + '\\}\\}', 'gi');
    result = result.replace(placeholder, value || '');
  }

  // Clean up any remaining unmatched placeholders
  result = result.replace(/\{\{[^}]+\}\}/g, '');

  return result;
}

/**
 * Build merge data from a tracker row + contacts map + settings.
 *
 * @param {Object} trackerRow - Row from INBOX_TRACKER
 * @param {Object} contactsMap - email→contact from CONTACTS tab
 * @param {Object} settings - from getSettings()
 * @returns {Object} merge data
 */
function buildMergeData(trackerRow, contactsMap, settings) {
  const email = String(trackerRow.fromEmail || '').toLowerCase();
  const contact = contactsMap[email] || {};

  const fullName = contact.name || trackerRow.fromName || '';
  const firstName = fullName.split(' ')[0] || '';

  return {
    name:             fullName,
    first_name:       firstName,
    email:            email,
    subject:          trackerRow.subject || '',
    company:          contact.company || '',
    reference:        trackerRow.threadKey || trackerRow.gmailThreadId || '',
    phone:            contact.phone || '',
    preference_notes: contact.preferenceNotes || '',
    next_steps:       '',  // can be overridden per-call
    signature:        settings.signatureBlock || '',
  };
}

/**
 * Render a full draft (subject + body) from a template key.
 *
 * @param {string} templateKey
 * @param {Object} trackerRow
 * @param {Object} contactsMap
 * @param {Object} settings
 * @returns {{ subject: string, body: string }} or null if template not found/disabled
 */
function renderDraft(templateKey, trackerRow, contactsMap, settings) {
  const templates = getTemplatesMap();
  const tmpl = templates[templateKey];

  if (!tmpl || !tmpl.enabled) {
    Logger.log('Template not found or disabled: ' + templateKey);
    return null;
  }

  const mergeData = buildMergeData(trackerRow, contactsMap, settings);

  const subject = renderTemplate(tmpl.subjectTemplate, mergeData);
  const bodyRaw = renderTemplate(tmpl.bodyTemplate, mergeData);

  // Convert newlines to HTML breaks for Gmail
  const body = bodyRaw.replace(/\n/g, '<br>');

  return { subject, body };
}
