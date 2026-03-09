'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Settings,
  Plug,
  ArrowRightLeft,
  RefreshCw,
  Mail,
  Sparkles,
  Shield,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils/format';

const settingsNav = [
  { href: '/settings', label: 'General', icon: Settings, exact: true },
  { href: '/settings/integrations', label: 'Integrations', icon: Plug },
  { href: '/settings/mappings', label: 'Field Mappings', icon: ArrowRightLeft },
  { href: '/settings/sync', label: 'Sync & Jobs', icon: RefreshCw },
  { href: '/settings/templates', label: 'Email Templates', icon: Mail },
  { href: '/settings/prompts', label: 'AI Prompts', icon: Sparkles },
  { href: '/settings/workflow', label: 'Workflow Rules', icon: Shield },
  { href: '/settings/audit', label: 'Audit Log', icon: ClipboardList },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="px-8 py-8 max-w-[1400px]">
      <div className="mb-6">
        <h1 className="text-2xl font-light tracking-wide text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted mt-1">
          Tenant administration and configuration
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 mb-8 border-b border-border pb-px overflow-x-auto">
        {settingsNav.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors',
                isActive
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted hover:text-foreground'
              )}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
