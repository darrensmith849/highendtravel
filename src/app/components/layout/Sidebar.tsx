'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Map,
  Settings,
  RotateCcw,
  FlaskConical,
} from 'lucide-react';
import { cn } from '@/lib/utils/format';
import { UserSwitcher } from './UserSwitcher';

const navItems = [
  { href: '/workspace/trips', label: 'Trips', icon: Map },
  { href: '/workspace/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleReset = async () => {
    if (!confirm('Reset all demo data to its original state?')) return;
    await fetch('/api/seed', { method: 'POST' });
    window.location.reload();
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border flex flex-col z-50">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-border">
        <Link href="/workspace/trips" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Compass className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-foreground">
              AlexTravels
            </h1>
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted">
              Workflow Hub
            </p>
          </div>
        </Link>
      </div>

      {/* Environment badge */}
      <div className="px-4 py-2.5">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-900/15 border border-amber-800/20 rounded-lg">
          <FlaskConical className="w-3 h-3 text-amber-400" />
          <span className="text-[10px] text-amber-400 uppercase tracking-wider font-medium">
            Mock Mode — Demo
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === '/workspace/settings'
              ? pathname.startsWith('/workspace/settings')
              : pathname === '/workspace/trips' || pathname.startsWith('/workspace/trips/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted hover:text-foreground hover:bg-card-hover'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Switcher (demo mode) */}
      <div className="px-3 py-2 border-t border-border">
        <UserSwitcher />
      </div>

      {/* Reset */}
      <div className="px-3 py-3 border-t border-border">
        <button
          onClick={handleReset}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-card-hover transition-colors w-full"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Demo Data
        </button>
      </div>
    </aside>
  );
}
