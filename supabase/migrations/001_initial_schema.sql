-- ============================================
-- Phase 1: Concierge Workflow Hub Schema
-- Multi-tenant with RLS
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TENANTS
-- ============================================
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- USER PROFILES
-- ============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'consultant', 'operations', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_user_profiles_tenant ON user_profiles(tenant_id);

-- ============================================
-- CLIENTS
-- ============================================
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_clients_tenant ON clients(tenant_id);

-- ============================================
-- TRAVELLERS
-- ============================================
CREATE TABLE travellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  passport_nationality TEXT,
  dietary_requirements TEXT,
  special_requests TEXT,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_travellers_tenant ON travellers(tenant_id);
CREATE INDEX idx_travellers_client ON travellers(client_id);

-- ============================================
-- HOTEL CONTACTS
-- ============================================
CREATE TABLE hotel_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  hotel_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  phone TEXT,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_hotel_contacts_tenant ON hotel_contacts(tenant_id);

-- ============================================
-- TRIPS
-- ============================================
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'brief_ready', 'draft_created', 'sent', 'awaiting_reply', 'confirmed')),
  internal_notes TEXT,
  consultant_id UUID NOT NULL REFERENCES user_profiles(id),
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_trips_tenant ON trips(tenant_id);
CREATE INDEX idx_trips_client ON trips(client_id);
CREATE INDEX idx_trips_consultant ON trips(consultant_id);
CREATE INDEX idx_trips_status ON trips(status);

-- ============================================
-- HOTEL BOOKINGS
-- ============================================
CREATE TABLE hotel_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  hotel_contact_id UUID NOT NULL REFERENCES hotel_contacts(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  room_type TEXT,
  guests INTEGER NOT NULL DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'brief_ready', 'draft_created', 'sent', 'awaiting_reply', 'confirmed')),
  special_requests TEXT,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_hotel_bookings_tenant ON hotel_bookings(tenant_id);
CREATE INDEX idx_hotel_bookings_trip ON hotel_bookings(trip_id);

-- ============================================
-- EMAIL DRAFTS
-- ============================================
CREATE TABLE email_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  hotel_booking_id UUID NOT NULL REFERENCES hotel_bookings(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  to_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'reply_received')),
  gmail_draft_id TEXT,
  sent_at TIMESTAMPTZ,
  reply_received_at TIMESTAMPTZ,
  reply_body TEXT,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_email_drafts_tenant ON email_drafts(tenant_id);
CREATE INDEX idx_email_drafts_booking ON email_drafts(hotel_booking_id);

-- ============================================
-- DOCUMENTS
-- ============================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  sharefile_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('completed', 'missing', 'pending')),
  category TEXT NOT NULL,
  url TEXT,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_documents_tenant ON documents(tenant_id);
CREATE INDEX idx_documents_trip ON documents(trip_id);

-- ============================================
-- TRAVEL PREFERENCES
-- ============================================
CREATE TABLE travel_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  preference_key TEXT NOT NULL,
  preference_value TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_travel_preferences_tenant ON travel_preferences(tenant_id);
CREATE INDEX idx_travel_preferences_trip ON travel_preferences(trip_id);

-- ============================================
-- BOOKING BRIEFS
-- ============================================
CREATE TABLE booking_briefs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  hotel_booking_id UUID NOT NULL REFERENCES hotel_bookings(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_booking_briefs_tenant ON booking_briefs(tenant_id);

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  action TEXT NOT NULL CHECK (action IN ('viewed_trip', 'generated_brief', 'generated_email', 'changed_status', 'viewed_document')),
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- ============================================
-- WORKFLOW EVENTS
-- ============================================
CREATE TABLE workflow_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  hotel_booking_id UUID REFERENCES hotel_bookings(id) ON DELETE SET NULL,
  from_status TEXT,
  to_status TEXT NOT NULL,
  changed_by UUID NOT NULL REFERENCES user_profiles(id),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_workflow_events_tenant ON workflow_events(tenant_id);
CREATE INDEX idx_workflow_events_trip ON workflow_events(trip_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE travellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_events ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's tenant
CREATE OR REPLACE FUNCTION auth.tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM user_profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Tenant: users can only see their own tenant
CREATE POLICY tenant_isolation ON tenants
  FOR ALL USING (id = auth.tenant_id());

-- User profiles: users can only see profiles in their tenant
CREATE POLICY user_profiles_tenant ON user_profiles
  FOR ALL USING (tenant_id = auth.tenant_id());

-- Clients: tenant-scoped
CREATE POLICY clients_tenant ON clients
  FOR ALL USING (tenant_id = auth.tenant_id());

-- Travellers: tenant-scoped
CREATE POLICY travellers_tenant ON travellers
  FOR ALL USING (tenant_id = auth.tenant_id());

-- Hotel contacts: tenant-scoped
CREATE POLICY hotel_contacts_tenant ON hotel_contacts
  FOR ALL USING (tenant_id = auth.tenant_id());

-- Trips: tenant-scoped
CREATE POLICY trips_tenant ON trips
  FOR ALL USING (tenant_id = auth.tenant_id());

-- Hotel bookings: tenant-scoped
CREATE POLICY hotel_bookings_tenant ON hotel_bookings
  FOR ALL USING (tenant_id = auth.tenant_id());

-- Email drafts: tenant-scoped
CREATE POLICY email_drafts_tenant ON email_drafts
  FOR ALL USING (tenant_id = auth.tenant_id());

-- Documents: tenant-scoped
CREATE POLICY documents_tenant ON documents
  FOR ALL USING (tenant_id = auth.tenant_id());

-- Travel preferences: tenant-scoped
CREATE POLICY travel_preferences_tenant ON travel_preferences
  FOR ALL USING (tenant_id = auth.tenant_id());

-- Booking briefs: tenant-scoped
CREATE POLICY booking_briefs_tenant ON booking_briefs
  FOR ALL USING (tenant_id = auth.tenant_id());

-- Audit logs: tenant-scoped, read-only for non-admins
CREATE POLICY audit_logs_tenant ON audit_logs
  FOR ALL USING (tenant_id = auth.tenant_id());

-- Workflow events: tenant-scoped
CREATE POLICY workflow_events_tenant ON workflow_events
  FOR ALL USING (tenant_id = auth.tenant_id());

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON travellers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON hotel_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON hotel_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON email_drafts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON travel_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON booking_briefs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
