'use client';

import { useEffect, useState } from 'react';
import {
  Sparkles,
  Save,
  Plus,
  X,
  AlertCircle,
} from 'lucide-react';
import type { PromptConfig } from '@/types/database';
import { formatTimeAgo } from '@/lib/utils/format';

const toneOptions = [
  { value: 'professional_warm', label: 'Professional & Warm' },
  { value: 'formal', label: 'Formal' },
  { value: 'casual_luxury', label: 'Casual Luxury' },
  { value: 'concise', label: 'Concise & Direct' },
];

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<PromptConfig[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editState, setEditState] = useState<PromptConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newPhrase, setNewPhrase] = useState('');
  const [newGuideline, setNewGuideline] = useState('');

  useEffect(() => {
    fetch('/api/settings/prompts')
      .then((r) => r.json())
      .then((data) => {
        setPrompts(data);
        if (data.length > 0) {
          setActiveId(data[0].id);
          setEditState({ ...data[0] });
        }
      });
  }, []);

  const switchPrompt = (p: PromptConfig) => {
    setActiveId(p.id);
    setEditState({ ...p, banned_phrases: [...p.banned_phrases], style_guidelines: [...p.style_guidelines] });
    setSaved(false);
  };

  const savePrompt = async () => {
    if (!editState) return;
    setSaving(true);
    const res = await fetch(`/api/settings/prompts/${editState.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_prompt: editState.system_prompt,
        tone_profile: editState.tone_profile,
        extra_detail_enabled: editState.extra_detail_enabled,
        banned_phrases: editState.banned_phrases,
        style_guidelines: editState.style_guidelines,
      }),
    });
    const updated = await res.json();
    setPrompts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditState({ ...updated, banned_phrases: [...updated.banned_phrases], style_guidelines: [...updated.style_guidelines] });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!editState) return <div className="animate-pulse text-muted">Loading prompts...</div>;

  return (
    <div className="max-w-4xl">
      {/* Prompt tabs */}
      <div className="flex gap-2 mb-6">
        {prompts.map((p) => (
          <button
            key={p.id}
            onClick={() => switchPrompt(p)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border transition-colors ${
              activeId === p.id
                ? 'border-accent/30 bg-accent/5 text-accent'
                : 'border-border text-muted hover:text-foreground hover:bg-card-hover'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {p.name}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* System Prompt */}
        <section className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              System Prompt
            </h3>
            <p className="text-[10px] text-muted">Updated {formatTimeAgo(editState.updated_at)}</p>
          </div>
          <textarea
            value={editState.system_prompt}
            onChange={(e) => setEditState({ ...editState, system_prompt: e.target.value })}
            rows={8}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground font-mono focus:outline-none focus:border-accent/50 resize-none leading-relaxed"
          />
        </section>

        {/* Tone & Controls */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider mb-4">
            Tone & Controls
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted mb-1.5">Tone Profile</label>
              <select
                value={editState.tone_profile}
                onChange={(e) => setEditState({ ...editState, tone_profile: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent/50"
              >
                {toneOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 pt-5">
              <button
                onClick={() => setEditState({ ...editState, extra_detail_enabled: !editState.extra_detail_enabled })}
                className={`relative w-10 h-5 rounded-full transition-colors ${editState.extra_detail_enabled ? 'bg-accent' : 'bg-zinc-700'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${editState.extra_detail_enabled ? 'translate-x-5' : ''}`} />
              </button>
              <span className="text-sm text-foreground">Enable extra detail</span>
            </div>
          </div>
        </section>

        {/* Banned Phrases */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-red-400" />
            Banned Phrases
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {editState.banned_phrases.map((phrase, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-900/20 text-red-300 rounded-md text-xs">
                {phrase}
                <button onClick={() => setEditState({
                  ...editState,
                  banned_phrases: editState.banned_phrases.filter((_, j) => j !== i),
                })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              placeholder="Add banned phrase..."
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent/50"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newPhrase.trim()) {
                  setEditState({ ...editState, banned_phrases: [...editState.banned_phrases, newPhrase.trim()] });
                  setNewPhrase('');
                }
              }}
            />
            <button
              onClick={() => {
                if (newPhrase.trim()) {
                  setEditState({ ...editState, banned_phrases: [...editState.banned_phrases, newPhrase.trim()] });
                  setNewPhrase('');
                }
              }}
              className="px-3 py-2 bg-card-hover border border-border rounded-lg text-sm text-muted hover:text-foreground"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Style Guidelines */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider mb-4">
            Style Guidelines
          </h3>
          <div className="space-y-2 mb-3">
            {editState.style_guidelines.map((g, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-background border border-border/50 rounded-lg">
                <span className="text-xs text-accent font-mono w-4">{i + 1}.</span>
                <span className="flex-1 text-sm text-foreground/80">{g}</span>
                <button onClick={() => setEditState({
                  ...editState,
                  style_guidelines: editState.style_guidelines.filter((_, j) => j !== i),
                })} className="text-muted hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newGuideline}
              onChange={(e) => setNewGuideline(e.target.value)}
              placeholder="Add style guideline..."
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent/50"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newGuideline.trim()) {
                  setEditState({ ...editState, style_guidelines: [...editState.style_guidelines, newGuideline.trim()] });
                  setNewGuideline('');
                }
              }}
            />
            <button
              onClick={() => {
                if (newGuideline.trim()) {
                  setEditState({ ...editState, style_guidelines: [...editState.style_guidelines, newGuideline.trim()] });
                  setNewGuideline('');
                }
              }}
              className="px-3 py-2 bg-card-hover border border-border rounded-lg text-sm text-muted hover:text-foreground"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={savePrompt}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent text-background rounded-lg text-sm font-medium hover:bg-accent-muted transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save Prompt Config'}
          </button>
        </div>
      </div>
    </div>
  );
}
