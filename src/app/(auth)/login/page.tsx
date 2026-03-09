'use client';

import { useRouter } from 'next/navigation';
import { Compass } from 'lucide-react';
import { demoUsers } from '@/lib/demo-data';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (userId: string) => {
    await fetch('/api/auth/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    router.push('/workspace/trips');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Compass className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-2xl font-light tracking-wide text-foreground">
            Maison Atlas Journeys
          </h1>
          <p className="text-sm text-muted mt-1">Concierge Workflow Hub</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-xs text-muted uppercase tracking-wider mb-4">
            Demo — Select a user
          </p>
          <div className="space-y-2">
            {demoUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleLogin(user.id)}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-background border border-border/50 hover:border-accent/30 hover:bg-card-hover transition-all text-left"
              >
                <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-medium">
                  {user.full_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{user.full_name}</p>
                  <p className="text-xs text-muted">{user.email}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-400 capitalize">
                  {user.role}
                </span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted/50 mt-6">
          Phase 1 — Synthetic Demo Environment
        </p>
      </div>
    </div>
  );
}
