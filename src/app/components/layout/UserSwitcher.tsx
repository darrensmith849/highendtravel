'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, Shield, Eye, Briefcase, Headphones } from 'lucide-react';
import type { UserProfile } from '@/types/database';
import { demoUsers } from '@/lib/demo-data';

const roleIcons: Record<string, typeof Shield> = {
  admin: Shield,
  consultant: Briefcase,
  operations: Headphones,
  viewer: Eye,
};

export function UserSwitcher() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/user')
      .then((r) => r.json())
      .then(setCurrentUser);
  }, []);

  const switchUser = async (userId: string) => {
    const res = await fetch('/api/auth/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const user = await res.json();
    setCurrentUser(user);
    setIsOpen(false);
    window.location.reload();
  };

  if (!currentUser) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full hover:bg-card-hover transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-medium">
          {currentUser.full_name.charAt(0)}
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm text-foreground truncate">
            {currentUser.full_name}
          </p>
          <p className="text-[10px] text-muted uppercase tracking-wider">
            {currentUser.role}
          </p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-muted" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-[10px] text-muted uppercase tracking-wider">
                Switch User (Demo)
              </p>
            </div>
            {demoUsers.map((user) => {
              const Icon = roleIcons[user.role] || Eye;
              return (
                <button
                  key={user.id}
                  onClick={() => switchUser(user.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 w-full text-left hover:bg-card-hover transition-colors ${
                    user.id === currentUser.id ? 'bg-accent/5' : ''
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                    <Icon className="w-3 h-3 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">
                      {user.full_name}
                    </p>
                    <p className="text-[10px] text-muted capitalize">
                      {user.role}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
