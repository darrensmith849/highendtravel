import Link from 'next/link';
import {
  Compass,
  Users,
  Mail,
  Eye,
  Shield,
  ArrowRight,
  ClipboardList,
  Lock,
  FileText,
  ChevronRight,
} from 'lucide-react';

const valueProps = [
  {
    icon: Users,
    title: 'Guest preferences in one place',
    body: 'Bring traveller preferences, documents, and booking context into one structured workspace.',
  },
  {
    icon: Mail,
    title: 'Faster hotel outreach',
    body: 'Generate polished reservation emails and follow-ups without rebuilding the same message every time.',
  },
  {
    icon: Eye,
    title: 'Clear trip-by-trip visibility',
    body: 'Track requests, drafts, responses, and booking progress across each stay.',
  },
  {
    icon: Shield,
    title: 'Secure internal operations',
    body: 'Protect sensitive traveller information with role-based access and audit visibility.',
  },
];

const steps = [
  {
    num: '01',
    title: 'Capture trip data',
    body: 'Import guest details, travel dates, and preferences into a structured trip record.',
  },
  {
    num: '02',
    title: 'Generate booking brief',
    body: 'Produce a concise brief summarising guest needs, room requirements, and special requests.',
  },
  {
    num: '03',
    title: 'Draft hotel outreach',
    body: 'Create tailored reservation emails ready to send to hotel partners.',
  },
  {
    num: '04',
    title: 'Track progress and responses',
    body: 'Monitor booking status, hotel replies, and follow-up actions in one view.',
  },
];

const securityPoints = [
  { icon: Lock, title: 'Role-based access' },
  { icon: Shield, title: 'Tenant-isolated records' },
  { icon: ClipboardList, title: 'Audit history' },
  { icon: FileText, title: 'Secure document handling' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Compass className="w-4 h-4 text-accent" />
            </div>
            <span className="text-sm font-semibold tracking-wide">Concierge Workflow Hub</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="#how-it-works"
              className="text-sm text-muted hover:text-foreground transition-colors hidden sm:block"
            >
              How It Works
            </Link>
            <Link
              href="/workspace"
              className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg text-sm hover:bg-accent/15 transition-colors"
            >
              View Demo
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-accent text-xs uppercase tracking-[0.25em] font-medium mb-6">
              Concierge Workflow Hub
            </p>
            <h1 className="text-4xl sm:text-5xl font-light tracking-tight leading-[1.15] mb-6">
              Luxury travel operations,{' '}
              <span className="text-accent">streamlined.</span>
            </h1>
            <p className="text-lg text-muted leading-relaxed mb-10 max-w-lg">
              A premium internal system designed to bring guest preferences, trip context, hotel outreach, and workflow visibility into one clear operating layer.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/workspace"
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-accent text-background rounded-lg text-sm font-medium hover:bg-accent-muted transition-colors"
              >
                View Interactive Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border text-muted rounded-lg text-sm hover:text-foreground hover:border-zinc-600 transition-colors"
              >
                See How It Works
              </Link>
            </div>
          </div>

          {/* Hero visual — mock product card */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-4 bg-accent/5 rounded-3xl blur-2xl" />
              {/* Card */}
              <div className="relative bg-card border border-border rounded-2xl overflow-hidden">
                {/* Card header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-sm font-medium">Tuscany Anniversary Escape</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-900/30 text-amber-300 text-[10px] font-medium uppercase tracking-wider">
                    In Progress
                  </span>
                </div>
                {/* Card body */}
                <div className="p-6 space-y-4">
                  {/* Guest row */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-medium">
                      VA
                    </div>
                    <div>
                      <p className="text-sm text-foreground">Victoria & Edward Ashworth</p>
                      <p className="text-[11px] text-muted">June 15–20, 2026 &middot; 2 guests</p>
                    </div>
                  </div>
                  {/* Mini sections */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background rounded-lg p-3 border border-border/50">
                      <p className="text-[10px] text-muted uppercase tracking-wider mb-1.5">Guest Preferences</p>
                      <p className="text-xs text-foreground/70">High floor, vineyard view, no shellfish</p>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border/50">
                      <p className="text-[10px] text-muted uppercase tracking-wider mb-1.5">Booking Brief</p>
                      <p className="text-xs text-foreground/70">Suite with anniversary setup and late checkout</p>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-border/50">
                    <p className="text-[10px] text-muted uppercase tracking-wider mb-1.5">Hotel Outreach</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-foreground/70">Castello di Velona Resort — Draft ready</p>
                      <span className="px-2 py-0.5 rounded bg-accent/10 text-accent text-[10px]">1 draft</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex -space-x-1.5">
                      <div className="w-5 h-5 rounded-full bg-zinc-700 border-2 border-card" />
                      <div className="w-5 h-5 rounded-full bg-zinc-600 border-2 border-card" />
                    </div>
                    <p className="text-[10px] text-muted">2 team members active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <p className="text-accent text-xs uppercase tracking-[0.25em] font-medium mb-4">
            Purpose-built
          </p>
          <h2 className="text-3xl font-light tracking-tight mb-16">
            Built for high-touch travel teams
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((item) => (
              <div
                key={item.title}
                className="bg-card border border-border rounded-xl p-6 hover:border-border/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/8 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-sm font-medium text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="text-accent text-xs uppercase tracking-[0.25em] font-medium mb-4">
              One workspace
            </p>
            <h2 className="text-3xl font-light tracking-tight mb-6">
              From fragmented admin to one clear workflow
            </h2>
            <p className="text-muted leading-relaxed">
              Instead of pulling details from email, documents, and notes across multiple systems, consultants work from one clean trip workspace built for fast, accurate execution.
            </p>
          </div>

          {/* Preview frame */}
          <div className="relative">
            <div className="absolute -inset-3 bg-accent/3 rounded-3xl blur-xl" />
            <div className="relative bg-card border border-border rounded-2xl overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-card">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-background rounded-md text-[11px] text-muted font-mono">
                    workspace / trips / tuscany-escape
                  </div>
                </div>
              </div>
              {/* Content mock */}
              <div className="p-8 bg-background/50">
                <div className="grid grid-cols-3 gap-6">
                  {/* Left panel mock */}
                  <div className="col-span-2 space-y-4">
                    <div className="bg-card rounded-lg p-5 border border-border/50">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-xs font-medium text-foreground">Hotel Booking — Castello di Velona</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-zinc-800 rounded w-full" />
                        <div className="h-3 bg-zinc-800 rounded w-4/5" />
                        <div className="h-3 bg-zinc-800 rounded w-3/5" />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <span className="px-2.5 py-1 rounded bg-accent/10 text-accent text-[10px]">Brief Generated</span>
                        <span className="px-2.5 py-1 rounded bg-emerald-900/30 text-emerald-300 text-[10px]">Email Sent</span>
                      </div>
                    </div>
                    <div className="bg-card rounded-lg p-5 border border-border/50">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-zinc-500" />
                        <span className="text-xs font-medium text-foreground">Hotel Booking — Hotel Excelsior Venice</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-zinc-800 rounded w-full" />
                        <div className="h-3 bg-zinc-800 rounded w-2/3" />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <span className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-400 text-[10px]">Awaiting Brief</span>
                      </div>
                    </div>
                  </div>
                  {/* Right panel mock */}
                  <div className="space-y-4">
                    <div className="bg-card rounded-lg p-4 border border-border/50">
                      <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Travellers</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-accent/10" />
                          <div className="h-2.5 bg-zinc-800 rounded w-24" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-accent/10" />
                          <div className="h-2.5 bg-zinc-800 rounded w-20" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-card rounded-lg p-4 border border-border/50">
                      <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Status Timeline</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <div className="h-2.5 bg-zinc-800 rounded w-16" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <div className="h-2.5 bg-zinc-800 rounded w-20" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                          <div className="h-2.5 bg-zinc-800 rounded w-14" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-card rounded-lg p-4 border border-border/50">
                      <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Documents</p>
                      <div className="space-y-2">
                        <div className="h-2.5 bg-zinc-800 rounded w-full" />
                        <div className="h-2.5 bg-zinc-800 rounded w-4/5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background rounded-lg text-sm font-medium hover:bg-accent-muted transition-colors"
            >
              Open Demo Workspace
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <p className="text-accent text-xs uppercase tracking-[0.25em] font-medium mb-4">
            Workflow
          </p>
          <h2 className="text-3xl font-light tracking-tight mb-16">
            How the workflow moves
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full">
                    <ChevronRight className="w-4 h-4 text-border absolute left-1/2 -translate-x-1/2" />
                  </div>
                )}
                <p className="text-accent text-2xl font-light mb-4 font-mono">{step.num}</p>
                <h3 className="text-sm font-medium text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="text-accent text-xs uppercase tracking-[0.25em] font-medium mb-4">
              Security
            </p>
            <h2 className="text-3xl font-light tracking-tight mb-6">
              Designed for private client data
            </h2>
            <p className="text-muted leading-relaxed">
              Built to protect sensitive traveller and booking information while giving teams the visibility they need to operate efficiently.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {securityPoints.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 bg-card border border-border rounded-xl px-5 py-4"
              >
                <item.icon className="w-4 h-4 text-accent shrink-0" />
                <span className="text-sm text-foreground">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-light tracking-tight mb-6">
            See how this could work for your team
          </h2>
          <p className="text-muted leading-relaxed mb-10">
            Explore the demo workspace and experience the flow from trip context to hotel communication.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-accent text-background rounded-lg text-sm font-medium hover:bg-accent-muted transition-colors"
            >
              Open Demo Workspace
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:hello@2kosystems.com?subject=Concierge%20Workflow%20Hub%20—%20Systems%20Review"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-muted rounded-lg text-sm hover:text-foreground hover:border-zinc-600 transition-colors"
            >
              Book a Systems Review
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center">
              <Compass className="w-3 h-3 text-accent" />
            </div>
            <span className="text-sm text-muted">
              Concierge Workflow Hub
            </span>
            <span className="text-zinc-700">&middot;</span>
            <span className="text-xs text-muted/60">2KO Systems</span>
          </div>
          <p className="text-[11px] text-muted/40">
            Demo environment — All data shown is synthetic and for presentation purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
