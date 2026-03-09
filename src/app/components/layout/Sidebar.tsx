'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Map,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils/format';
import { UserSwitcher } from './UserSwitcher';

const navItems = [
  { href: '/trips', label: 'Trips', icon: Map },
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
        <Link href="/trips" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Compass className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-foreground">
              Maison Atlas
            </h1>
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted">
              Workflow Hub
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
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
