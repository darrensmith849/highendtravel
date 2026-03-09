'use client';

import { useEffect, useState } from 'react';
import { Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import type { WorkflowRule, UserRole } from '@/types/database';

const allRoles: UserRole[] = ['admin', 'consultant', 'operations', 'viewer'];

export default function WorkflowRulesPage() {
  const [rules, setRules] = useState<WorkflowRule[]>([]);

  useEffect(() => {
    fetch('/api/settings/workflow-rules')
      .then((r) => r.json())
      .then(setRules);
  }, []);

  const toggleRule = async (rule: WorkflowRule) => {
    const res = await fetch('/api/settings/workflow-rules', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruleId: rule.id, enabled: !rule.enabled }),
    });
    const updated = await res.json();
    setRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const toggleRoleOnRule = async (rule: WorkflowRule, role: UserRole) => {
    const newRoles = rule.allowed_roles.includes(role)
      ? rule.allowed_roles.filter((r) => r !== role)
      : [...rule.allowed_roles, role];
    const res = await fetch('/api/settings/workflow-rules', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruleId: rule.id, allowed_roles: newRoles }),
    });
    const updated = await res.json();
    setRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  if (!rules.length) return <div className="animate-pulse text-muted">Loading workflow rules...</div>;

  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-sm text-muted mb-6">
        Control who can perform key workflow actions. Changes take effect immediately.
      </p>

      {rules.map((rule) => (
        <div key={rule.id} className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-accent mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-foreground">{rule.name}</h3>
                <p className="text-xs text-muted mt-0.5">{rule.description}</p>
              </div>
            </div>
            <button onClick={() => toggleRule(rule)} className="shrink-0">
              {rule.enabled ? (
                <ToggleRight className="w-6 h-6 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-zinc-500" />
              )}
            </button>
          </div>

          {rule.enabled && (
            <div className="flex gap-2 ml-7">
              {allRoles.map((role) => {
                const active = rule.allowed_roles.includes(role);
                return (
                  <button
                    key={role}
                    onClick={() => toggleRoleOnRule(rule, role)}
                    className={`px-3 py-1.5 rounded-md text-xs border transition-colors capitalize ${
                      active
                        ? 'border-accent/30 bg-accent/10 text-accent'
                        : 'border-border text-muted hover:text-foreground hover:bg-card-hover'
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
