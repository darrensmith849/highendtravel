-- ============================================
-- Phase 2: Admin Controls + Integration Layer
-- ============================================

-- TENANT SETTINGS
CREATE TABLE tenant_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  support_email TEXT NOT NULL,
  default_timezone TEXT NOT NULL DEFAULT 'Europe/London',
  operational_notes TEXT,
  default_draft_status TEXT NOT NULL DEFAULT 'draft' CHECK (default_draft_status IN ('draft', 'review_required')),
  reply_followup_days INTEGER NOT NULL DEFAULT 3,
  internal_review_required BOOLEAN NOT NULL DEFAULT false,
  email_generation_mode TEXT NOT NULL DEFAULT 'draft_only' CHECK (email_generation_mode IN ('draft_only', 'auto_send')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tenant_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_settings_tenant ON tenant_settings FOR ALL USING (tenant_id = auth.tenant_id());
CREATE TRIGGER set_updated_at BEFORE UPDATE ON tenant_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- INTEGRATION PROVIDERS
CREATE TABLE integration_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('gmail', 'notion', 'sharefile')),
  mode TEXT NOT NULL DEFAULT 'mock' CHECK (mode IN ('mock', 'live', 'not_configured')),
  enabled BOOLEAN NOT NULL DEFAULT true,
  display_name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  config_checklist JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, provider_type)
);

CREATE INDEX idx_integration_providers_tenant ON integration_providers(tenant_id);
ALTER TABLE integration_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY integration_providers_tenant ON integration_providers FOR ALL USING (tenant_id = auth.tenant_id());
CREATE TRIGGER set_updated_at BEFORE UPDATE ON integration_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- PROVIDER CONNECTIONS
CREATE TABLE provider_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES integration_providers(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error')),
  last_connected_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_provider_connections_tenant ON provider_connections(tenant_id);
ALTER TABLE provider_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY provider_connections_tenant ON provider_connections FOR ALL USING (tenant_id = auth.tenant_id());
CREATE TRIGGER set_updated_at BEFORE UPDATE ON provider_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- PROVIDER SYNC RUNS
CREATE TABLE provider_sync_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES integration_providers(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('success', 'warning', 'failed', 'running', 'idle')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  records_processed INTEGER NOT NULL DEFAULT 0,
  records_created INTEGER NOT NULL DEFAULT 0,
  records_updated INTEGER NOT NULL DEFAULT 0,
  records_failed INTEGER NOT NULL DEFAULT 0,
  error_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_provider_sync_runs_tenant ON provider_sync_runs(tenant_id);
CREATE INDEX idx_provider_sync_runs_provider ON provider_sync_runs(provider_id);
ALTER TABLE provider_sync_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY provider_sync_runs_tenant ON provider_sync_runs FOR ALL USING (tenant_id = auth.tenant_id());

-- PROVIDER FIELD MAPPINGS
CREATE TABLE provider_field_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES integration_providers(id) ON DELETE CASCADE,
  source_field TEXT NOT NULL,
  source_label TEXT NOT NULL,
  target_table TEXT NOT NULL,
  target_field TEXT NOT NULL,
  target_label TEXT NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'unmapped' CHECK (status IN ('valid', 'invalid', 'unmapped')),
  sample_value TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_provider_field_mappings_tenant ON provider_field_mappings(tenant_id);
CREATE INDEX idx_provider_field_mappings_provider ON provider_field_mappings(provider_id);
ALTER TABLE provider_field_mappings ENABLE ROW LEVEL SECURITY;
CREATE POLICY provider_field_mappings_tenant ON provider_field_mappings FOR ALL USING (tenant_id = auth.tenant_id());
CREATE TRIGGER set_updated_at BEFORE UPDATE ON provider_field_mappings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- EMAIL TEMPLATES
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  template_key TEXT NOT NULL,
  name TEXT NOT NULL,
  subject_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  version INTEGER NOT NULL DEFAULT 1,
  last_edited_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, template_key)
);

CREATE INDEX idx_email_templates_tenant ON email_templates(tenant_id);
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY email_templates_tenant ON email_templates FOR ALL USING (tenant_id = auth.tenant_id());
CREATE TRIGGER set_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- PROMPT CONFIGS
CREATE TABLE prompt_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  prompt_key TEXT NOT NULL,
  name TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  tone_profile TEXT NOT NULL DEFAULT 'professional_warm',
  extra_detail_enabled BOOLEAN NOT NULL DEFAULT true,
  banned_phrases JSONB NOT NULL DEFAULT '[]',
  style_guidelines JSONB NOT NULL DEFAULT '[]',
  last_edited_by UUID NOT NULL REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, prompt_key)
);

CREATE INDEX idx_prompt_configs_tenant ON prompt_configs(tenant_id);
ALTER TABLE prompt_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY prompt_configs_tenant ON prompt_configs FOR ALL USING (tenant_id = auth.tenant_id());
CREATE TRIGGER set_updated_at BEFORE UPDATE ON prompt_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- WORKFLOW RULES
CREATE TABLE workflow_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  rule_key TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  enabled BOOLEAN NOT NULL DEFAULT true,
  allowed_roles JSONB NOT NULL DEFAULT '["admin"]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, rule_key)
);

CREATE INDEX idx_workflow_rules_tenant ON workflow_rules(tenant_id);
ALTER TABLE workflow_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY workflow_rules_tenant ON workflow_rules FOR ALL USING (tenant_id = auth.tenant_id());
CREATE TRIGGER set_updated_at BEFORE UPDATE ON workflow_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Extend audit_logs action check
ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS audit_logs_action_check;
ALTER TABLE audit_logs ADD CONSTRAINT audit_logs_action_check CHECK (
  action IN ('viewed_trip', 'generated_brief', 'generated_email', 'changed_status', 'viewed_document',
             'updated_settings', 'updated_template', 'updated_mapping', 'updated_prompt', 'triggered_sync')
);
