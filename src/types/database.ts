export type UserRole = 'admin' | 'consultant' | 'operations' | 'viewer';

export type WorkflowStatus =
  | 'not_started'
  | 'brief_ready'
  | 'draft_created'
  | 'sent'
  | 'awaiting_reply'
  | 'confirmed';

export type AuditAction =
  | 'viewed_trip'
  | 'generated_brief'
  | 'generated_email'
  | 'changed_status'
  | 'viewed_document'
  | 'updated_settings'
  | 'updated_template'
  | 'updated_mapping'
  | 'updated_prompt'
  | 'triggered_sync';

export type DocumentStatus = 'completed' | 'missing' | 'pending';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface TenantSettings {
  id: string;
  tenant_id: string;
  brand_name: string;
  support_email: string;
  default_timezone: string;
  operational_notes: string | null;
  default_draft_status: 'draft' | 'review_required';
  reply_followup_days: number;
  internal_review_required: boolean;
  email_generation_mode: 'draft_only' | 'auto_send';
  created_at: string;
  updated_at: string;
}

export type ProviderType = 'gmail' | 'notion' | 'sharefile';
export type ProviderMode = 'mock' | 'live' | 'not_configured';
export type SyncStatus = 'success' | 'warning' | 'failed' | 'running' | 'idle';
export type MappingStatus = 'valid' | 'invalid' | 'unmapped';

export interface IntegrationProvider {
  id: string;
  tenant_id: string;
  provider_type: ProviderType;
  mode: ProviderMode;
  enabled: boolean;
  display_name: string;
  description: string;
  config_checklist: { label: string; done: boolean }[];
  created_at: string;
  updated_at: string;
}

export interface ProviderConnection {
  id: string;
  tenant_id: string;
  provider_id: string;
  status: 'connected' | 'disconnected' | 'error';
  last_connected_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProviderSyncRun {
  id: string;
  tenant_id: string;
  provider_id: string;
  status: SyncStatus;
  started_at: string;
  ended_at: string | null;
  records_processed: number;
  records_created: number;
  records_updated: number;
  records_failed: number;
  error_summary: string | null;
  created_at: string;
}

export interface ProviderFieldMapping {
  id: string;
  tenant_id: string;
  provider_id: string;
  source_field: string;
  source_label: string;
  target_table: string;
  target_field: string;
  target_label: string;
  is_required: boolean;
  status: MappingStatus;
  sample_value: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  tenant_id: string;
  template_key: string;
  name: string;
  subject_template: string;
  body_template: string;
  is_active: boolean;
  version: number;
  last_edited_by: string;
  created_at: string;
  updated_at: string;
}

export interface PromptConfig {
  id: string;
  tenant_id: string;
  prompt_key: string;
  name: string;
  system_prompt: string;
  tone_profile: string;
  extra_detail_enabled: boolean;
  banned_phrases: string[];
  style_guidelines: string[];
  last_edited_by: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowRule {
  id: string;
  tenant_id: string;
  rule_key: string;
  name: string;
  description: string;
  enabled: boolean;
  allowed_roles: UserRole[];
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  tenant_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  tenant_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Traveller {
  id: string;
  tenant_id: string;
  client_id: string;
  full_name: string;
  date_of_birth: string | null;
  passport_nationality: string | null;
  dietary_requirements: string | null;
  special_requests: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: string;
  tenant_id: string;
  client_id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  status: WorkflowStatus;
  internal_notes: string | null;
  consultant_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  client?: Client;
  consultant?: UserProfile;
  travellers?: Traveller[];
  hotel_bookings?: HotelBooking[];
  documents?: Document[];
  preferences?: TravelPreference[];
}

export interface HotelContact {
  id: string;
  tenant_id: string;
  hotel_name: string;
  contact_name: string;
  contact_email: string;
  phone: string | null;
  location: string;
  category: string;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface HotelBooking {
  id: string;
  tenant_id: string;
  trip_id: string;
  hotel_contact_id: string;
  check_in: string;
  check_out: string;
  room_type: string | null;
  guests: number;
  status: WorkflowStatus;
  special_requests: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Joined
  hotel_contact?: HotelContact;
  email_drafts?: EmailDraft[];
}

export interface EmailDraft {
  id: string;
  tenant_id: string;
  hotel_booking_id: string;
  subject: string;
  body: string;
  to_email: string;
  status: 'draft' | 'sent' | 'reply_received';
  gmail_draft_id: string | null;
  sent_at: string | null;
  reply_received_at: string | null;
  reply_body: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  tenant_id: string;
  trip_id: string;
  file_name: string;
  file_type: string;
  sharefile_id: string | null;
  status: DocumentStatus;
  category: string;
  url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TravelPreference {
  id: string;
  tenant_id: string;
  trip_id: string;
  category: string;
  preference_key: string;
  preference_value: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface BookingBrief {
  id: string;
  tenant_id: string;
  trip_id: string;
  hotel_booking_id: string;
  content: string;
  generated_at: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  tenant_id: string;
  user_id: string;
  action: AuditAction;
  resource_type: string;
  resource_id: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface WorkflowEvent {
  id: string;
  tenant_id: string;
  trip_id: string;
  hotel_booking_id: string | null;
  from_status: WorkflowStatus | null;
  to_status: WorkflowStatus;
  changed_by: string;
  note: string | null;
  created_at: string;
}
