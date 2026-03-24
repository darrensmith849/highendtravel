# Email Templates — Phase 1 Inbox Stabiliser

All templates use `{{merge_field}}` syntax. Fields are populated from the CONTACTS tab and thread metadata.

**Available merge fields:**
- `{{name}}` — Full name
- `{{first_name}}` — First name only
- `{{email}}` — Sender's email
- `{{subject}}` — Original subject line
- `{{reference}}` — Thread reference ID
- `{{company}}` — Company name (from contacts)
- `{{phone}}` — Phone (from contacts)
- `{{next_steps}}` — Dynamic next steps
- `{{preference_notes}}` — Preference notes (from contacts)
- `{{signature}}` — Signature block (from settings)

---

## 1. ACK_GENERAL
**Category:** GENERAL
**Subject:** Re: {{subject}}

Dear {{first_name}},

Thank you for your message. We have received your enquiry and a member of our team will be in touch shortly.

Your reference: {{reference}}

If you need anything in the meantime, please don't hesitate to reply to this email.

Kind regards,
{{signature}}

---

## 2. REQUEST_MISSING_INFO
**Category:** GENERAL
**Subject:** Re: {{subject}} — Additional Information Needed

Dear {{first_name}},

Thank you for reaching out. To assist you further, we need a few additional details:

- [Please specify what information is needed]

Once we have this, we'll be able to move things forward promptly.

Your reference: {{reference}}

Kind regards,
{{signature}}

---

## 3. UPDATE_IN_PROGRESS
**Category:** GENERAL
**Subject:** Re: {{subject}} — Update

Dear {{first_name}},

Just a quick update — we're actively working on your request and will have more information for you soon.

Your reference: {{reference}}

Thank you for your patience.

Kind regards,
{{signature}}

---

## 4. CONFIRMATION_RECEIVED
**Category:** GENERAL
**Subject:** Re: {{subject}} — Confirmed

Dear {{first_name}},

We've received your confirmation — thank you. We'll proceed accordingly and keep you updated on next steps.

Your reference: {{reference}}

Kind regards,
{{signature}}

---

## 5. CLOSE_RESOLVED
**Category:** GENERAL
**Subject:** Re: {{subject}} — Resolved

Dear {{first_name}},

We're pleased to confirm that your request has been resolved. If you have any further questions, please don't hesitate to reach out.

Your reference: {{reference}}

It was a pleasure assisting you.

Kind regards,
{{signature}}

---

## 6. FOLLOW_UP_NO_RESPONSE
**Category:** GENERAL
**Subject:** Re: {{subject}} — Following Up

Dear {{first_name}},

We wanted to follow up on our previous message regarding your enquiry. We're still happy to help — please let us know if you'd like to proceed or if anything has changed.

Your reference: {{reference}}

Kind regards,
{{signature}}

---

## 7. BILLING_ACK
**Category:** BILLING
**Subject:** Re: {{subject}} — Billing Enquiry Received

Dear {{first_name}},

Thank you for your billing enquiry. Our team is reviewing the details and will respond with a full update within one business day.

Your reference: {{reference}}

Kind regards,
{{signature}}

---

## 8. SUPPORT_ACK
**Category:** SUPPORT
**Subject:** Re: {{subject}} — Support Request Received

Dear {{first_name}},

We've received your support request and are looking into it now. You can expect a detailed response shortly.

Your reference: {{reference}}

Kind regards,
{{signature}}

---

## 9. ESCALATE_ACK
**Category:** GENERAL
**Subject:** Re: {{subject}} — Escalated

Dear {{first_name}},

Thank you for bringing this to our attention. Your matter has been escalated to a senior member of our team who will be in contact with you directly.

Your reference: {{reference}}

Kind regards,
{{signature}}

---

## 10. BOOKING_ACK
**Category:** BOOKINGS
**Subject:** Re: {{subject}} — Booking Enquiry Received

Dear {{first_name}},

Thank you for your booking enquiry. We're reviewing availability and options, and will come back to you with a tailored proposal.

Your reference: {{reference}}

Kind regards,
{{signature}}

---

## 11. BOOKING_CONFIRMED
**Category:** BOOKINGS
**Subject:** Re: {{subject}} — Booking Confirmed

Dear {{first_name}},

Wonderful news — your booking has been confirmed. Full details and documentation will follow shortly.

Your reference: {{reference}}

We look forward to making this a memorable experience.

Kind regards,
{{signature}}

---

## 12. COMPLAINT_ACK
**Category:** COMPLAINT
**Subject:** Re: {{subject}} — Your Feedback

Dear {{first_name}},

Thank you for taking the time to share your feedback. We take all concerns seriously and a senior team member will follow up with you personally.

Your reference: {{reference}}

Kind regards,
{{signature}}

---

## 13. PARTNER_AWAITING
**Category:** BOOKINGS
**Subject:** Re: {{subject}} — Awaiting Partner Confirmation

Dear {{first_name}},

We're currently awaiting confirmation from our partner on the details of your request. We'll update you as soon as we hear back.

Your reference: {{reference}}

Kind regards,
{{signature}}

---

## 14. WELCOME_NEW_CLIENT
**Category:** GENERAL
**Subject:** Re: {{subject}} — Welcome

Dear {{first_name}},

Welcome, and thank you for choosing us. We're delighted to have you and are here to make every experience exceptional.

A member of our team will be in touch shortly to learn more about your preferences and how we can best serve you.

Kind regards,
{{signature}}

---

## 15. ITINERARY_UPDATE
**Category:** BOOKINGS
**Subject:** Re: {{subject}} — Itinerary Update

Dear {{first_name}},

We've made updates to your itinerary as discussed. Please review the attached details and let us know if everything looks good or if you'd like any adjustments.

Your reference: {{reference}}

Kind regards,
{{signature}}

---

## 16. PAYMENT_REMINDER
**Category:** BILLING
**Subject:** Re: {{subject}} — Friendly Payment Reminder

Dear {{first_name}},

This is a friendly reminder regarding an outstanding balance on your account. Please let us know if you have any questions or if payment has already been arranged.

Your reference: {{reference}}

Kind regards,
{{signature}}
