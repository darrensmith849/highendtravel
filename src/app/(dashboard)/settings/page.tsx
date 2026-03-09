'use client';

import { useEffect, useState } from 'react';
import { Save, Building2, Clock, FlaskConical } from 'lucide-react';
import type { Tenant, TenantSettings } from '@/types/database';

export default function SettingsGeneralPage() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [settings, setSettings] = useState<TenantSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        setTenant(data.tenant);
        setSettings(data.settings);
      });
  }, []);

  const save = async () => {
    if (!settings || !tenant) return;
    setSaving(true);
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenant_name: tenant.name,
        brand_name: settings.brand_name,
        support_email: settings.support_email,
        default_timezone: settings.default_timezone,
        operational_notes: settings.operational_notes,
        default_draft_status: settings.default_draft_status,
        reply_followup_days: settings.reply_followup_days,
        internal_review_required: settings.internal_review_required,
        email_generation_mode: settings.email_generation_mode,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!settings || !tenant) {
    return <div className="animate-pulse text-muted">Loading settings...</div>;
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Tenant Profile */}
      <section className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Building2 className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider">
            Tenant Profile
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Company Name" value={tenant.name} onChange={(v) => setTenant({ ...tenant, name: v })} />
          <Field label="Brand Name" value={settings.brand_name} onChange={(v) => setSettings({ ...settings, brand_name: v })} />
          <Field label="Support Email" value={settings.support_email} onChange={(v) => setSettings({ ...settings, support_email: v })} />
          <Field label="Default Timezone" value={settings.default_timezone} onChange={(v) => setSettings({ ...settings, default_timezone: v })} />
        </div>
        <div className="mt-4">
          <label className="block text-xs text-muted mb-1.5">Operational Notes</label>
          <textarea
            value={settings.operational_notes || ''}
            onChange={(e) => setSettings({ ...settings, operational_notes: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent/50 resize-none"
          />
        </div>
      </section>

      {/* Environment */}
      <section className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <FlaskConical className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider">
            Environment
          </h2>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 p-4 bg-background border border-border rounded-lg">
            <p className="text-xs text-muted mb-1">Environment</p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-900/20 text-amber-300 rounded-md text-xs font-medium">
              <FlaskConical className="w-3 h-3" />
              Demo
            </span>
          </div>
          <div className="flex-1 p-4 bg-background border border-border rounded-lg">
            <p className="text-xs text-muted mb-1">Integration Mode</p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-900/20 text-amber-300 rounded-md text-xs font-medium">
              Mock
            </span>
          </div>
          <div className="flex-1 p-4 bg-background border border-border rounded-lg">
            <p className="text-xs text-muted mb-1">Tenant Slug</p>
            <p className="text-sm text-foreground font-mono">{tenant.slug}</p>
          </div>
        </div>
      </section>

      {/* Workflow Settings */}
      <section className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Clock className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider">
            Workflow Defaults
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1.5">Default Draft Status</label>
            <select
              value={settings.default_draft_status}
              onChange={(e) => setSettings({ ...settings, default_draft_status: e.target.value as TenantSettings['default_draft_status'] })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent/50"
            >
              <option value="draft">Draft</option>
              <option value="review_required">Review Required</option>
            </select>
          </div>
          <Field
            label="Reply Follow-Up Days"
            value={String(settings.reply_followup_days)}
            onChange={(v) => setSettings({ ...settings, reply_followup_days: parseInt(v) || 3 })}
            type="number"
          />
          <div>
            <label className="block text-xs text-muted mb-1.5">Email Generation Mode</label>
            <select
              value={settings.email_generation_mode}
              onChange={(e) => setSettings({ ...settings, email_generation_mode: e.target.value as TenantSettings['email_generation_mode'] })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent/50"
            >
              <option value="draft_only">Draft Only</option>
              <option value="auto_send">Auto Send</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-5">
            <button
              onClick={() => setSettings({ ...settings, internal_review_required: !settings.internal_review_required })}
              className={`relative w-10 h-5 rounded-full transition-colors ${settings.internal_review_required ? 'bg-accent' : 'bg-zinc-700'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings.internal_review_required ? 'translate-x-5' : ''}`} />
            </button>
            <span className="text-sm text-foreground">Internal review required</span>
          </div>
        </div>
      </section>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent text-background rounded-lg text-sm font-medium hover:bg-accent-muted transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent/50"
      />
    </div>
  );
}
