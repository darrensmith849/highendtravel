'use client';

import { useEffect, useState } from 'react';
import {
  Mail,
  Eye,
  Edit3,
  Check,
  X,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import type { EmailTemplate } from '@/types/database';
import { formatTimeAgo } from '@/lib/utils/format';

// Token preview data
const previewTokens: Record<string, string> = {
  '{{client_name}}': 'Victoria & Edward Ashworth',
  '{{client_plural}}': 's',
  '{{trip_name}}': 'Tuscany Anniversary Escape',
  '{{hotel_name}}': 'Castello di Velona Resort',
  '{{hotel_contact_name}}': 'Marco Bellini',
  '{{travel_dates}}': 'June 15–20, 2026',
  '{{room_type}}': 'Grand Suite with vineyard view',
  '{{guest_count}}': '2',
  '{{traveller_summary}}': 'Victoria Ashworth, Edward Ashworth',
  '{{special_requests_section}}': 'Special Requests:\n- Anniversary cake on arrival\n- Private wine tasting\n- Late checkout',
  '{{dietary_section}}': 'Dietary Requirements:\n- Victoria: No shellfish',
  '{{consultant_name}}': 'Sarah Jordaan',
  '{{brand_name}}': 'AlexTravels',
};

function renderPreview(template: string): string {
  let result = template;
  for (const [token, value] of Object.entries(previewTokens)) {
    result = result.replaceAll(token, value);
  }
  return result;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ subject: string; body: string }>({ subject: '', body: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings/templates')
      .then((r) => r.json())
      .then(setTemplates);
  }, []);

  const startEdit = (t: EmailTemplate) => {
    setEditing(t.id);
    setEditData({ subject: t.subject_template, body: t.body_template });
    setPreview(null);
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    const res = await fetch(`/api/settings/templates/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject_template: editData.subject,
        body_template: editData.body,
      }),
    });
    const updated = await res.json();
    setTemplates((prev) => prev.map((t) => (t.id === id ? updated : t)));
    setEditing(null);
    setSaving(false);
  };

  const toggleActive = async (t: EmailTemplate) => {
    const res = await fetch(`/api/settings/templates/${t.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !t.is_active }),
    });
    const updated = await res.json();
    setTemplates((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
  };

  if (!templates.length) return <div className="animate-pulse text-muted">Loading templates...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Token reference */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Available Tokens</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(previewTokens).map((token) => (
            <code key={token} className="px-2 py-0.5 bg-background border border-border/50 rounded text-[10px] text-accent font-mono">
              {token}
            </code>
          ))}
        </div>
      </div>

      {/* Templates */}
      {templates.map((t) => (
        <div key={t.id} className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-accent" />
              <div>
                <h3 className="text-sm font-medium text-foreground">{t.name}</h3>
                <p className="text-[10px] text-muted">
                  v{t.version} &middot; Updated {formatTimeAgo(t.updated_at)} &middot; Key: {t.template_key}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleActive(t)} className="text-muted hover:text-foreground transition-colors">
                {t.is_active ? (
                  <ToggleRight className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-5 h-5" />
                )}
              </button>
              {editing === t.id ? (
                <>
                  <button onClick={() => setEditing(null)} className="p-1.5 text-muted hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => saveEdit(t.id)}
                    disabled={saving}
                    className="flex items-center gap-1 px-3 py-1.5 bg-accent/10 text-accent rounded-md text-xs hover:bg-accent/20 disabled:opacity-50"
                  >
                    <Check className="w-3 h-3" />
                    Save
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setPreview(preview === t.id ? null : t.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-muted hover:text-foreground rounded-md text-xs hover:bg-card-hover"
                  >
                    <Eye className="w-3 h-3" />
                    Preview
                  </button>
                  <button
                    onClick={() => startEdit(t)}
                    className="flex items-center gap-1 px-3 py-1.5 text-muted hover:text-foreground rounded-md text-xs hover:bg-card-hover"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="p-5">
            {editing === t.id ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-muted mb-1">Subject Template</label>
                  <input
                    value={editData.subject}
                    onChange={(e) => setEditData({ ...editData, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground font-mono focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Body Template</label>
                  <textarea
                    value={editData.body}
                    onChange={(e) => setEditData({ ...editData, body: e.target.value })}
                    rows={12}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground font-mono focus:outline-none focus:border-accent/50 resize-none"
                  />
                </div>
              </div>
            ) : preview === t.id ? (
              <div>
                <p className="text-xs text-accent mb-1">Preview with mock data:</p>
                <div className="bg-background border border-border/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-foreground mb-2">
                    {renderPreview(t.subject_template)}
                  </p>
                  <pre className="text-xs text-muted/80 whitespace-pre-wrap font-sans leading-relaxed">
                    {renderPreview(t.body_template)}
                  </pre>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted mb-1">Subject:</p>
                <p className="text-sm text-foreground/80 font-mono mb-3">{t.subject_template}</p>
                <p className="text-xs text-muted mb-1">Body:</p>
                <pre className="text-xs text-muted/60 whitespace-pre-wrap font-mono leading-relaxed max-h-24 overflow-hidden">
                  {t.body_template}
                </pre>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
