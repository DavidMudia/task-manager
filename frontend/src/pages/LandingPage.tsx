import { Link } from 'react-router-dom';
import {
  Zap,
  LayoutDashboard,
  MessageSquare,
  CheckSquare,
  Users,
  BarChart3,
  Pencil,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const features = [
  {
    icon: LayoutDashboard,
    title: 'Workspaces',
    description:
      'Create focused workspaces for software, events, personal goals, or everyday tasks.',
  },
  {
    icon: CheckSquare,
    title: 'Kanban Board',
    description:
      'Visualize your workflow with intuitive columns and keep every task moving forward.',
  },
  {
    icon: MessageSquare,
    title: 'Real-time Chat',
    description:
      'Communicate with your team instantly through project-specific conversations.',
  },
  {
    icon: Pencil,
    title: 'Rich Task Details',
    description:
      'Break work down with subtasks, comments, attachments, and detailed descriptions.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description:
      'Understand project progress, workload, velocity, and overall team performance.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Invite teammates, assign responsibilities, and keep everyone aligned.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Create an Account',
    description:
      'Sign up and create your workspace in just a few seconds.',
  },
  {
    number: '02',
    title: 'Create a Project',
    description:
      'Set up your project, organize your workflow, and define what needs to get done.',
  },
  {
    number: '03',
    title: 'Invite Your Team',
    description:
      'Bring your team in, assign tasks, communicate, and start shipping.',
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#08070D] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[650px] w-[850px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[150px]" />

        <div className="absolute left-[-250px] top-[35%] h-[500px] w-[500px] rounded-full bg-purple-700/5 blur-[140px]" />

        <div className="absolute right-[-250px] top-[65%] h-[500px] w-[500px] rounded-full bg-indigo-700/5 blur-[140px]" />
      </div>

      {/* Navigation */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-[#08070D]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 transition-all group-hover:border-violet-400/40 group-hover:bg-violet-500/15">
              <Zap className="h-5 w-5 text-violet-400" />
            </div>

            <span className="text-lg font-semibold tracking-tight text-white">
              TaskFlow
            </span>
          </Link>

          {/* Authentication buttons */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              to="/login"
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-950/30 transition-all hover:bg-violet-500"
            >
              Sign up
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-5 pb-24 pt-36 text-center sm:px-8 sm:pt-44">
          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-500/[0.07] px-4 py-2 text-xs font-medium text-violet-200/80 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />

            <span>Simple project management, built beautifully</span>
          </div>

          <h1 className="mx-auto max-w-5xl text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Plan better.
            <br />

            <span className="bg-gradient-to-r from-violet-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Build together.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/45 sm:text-lg sm:leading-8">
            TaskFlow brings projects, tasks, conversations, and your team
            together in one focused workspace.
          </p>

          {/* Hero buttons */}
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-950/30 transition-all hover:-translate-y-0.5 hover:bg-violet-500 sm:w-auto"
            >
              Get started for free

              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              to="/login"
              className="flex w-full items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-white/70 transition-all hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-white sm:w-auto"
            >
              Log in
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs text-white/30">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-violet-400/70" />
              Secure & private
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />

            <span className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-violet-400/70" />
              Built for teams
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />

            <span className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-violet-400/70" />
              Fast & focused
            </span>
          </div>
        </section>

        {/* Product Preview */}
        <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E0C15] shadow-2xl shadow-black/40">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

            <div className="flex h-12 items-center gap-2 border-b border-white/[0.06] px-5">
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />

              <div className="ml-4 h-6 w-48 rounded-md bg-white/[0.03]" />
            </div>

            <div className="grid min-h-[320px] grid-cols-12">
              {/* Fake sidebar */}
              <div className="col-span-3 hidden border-r border-white/[0.06] p-5 sm:block">
                <div className="mb-6 h-7 w-24 rounded-lg bg-violet-500/15" />

                <div className="space-y-3">
                  <div className="h-8 rounded-lg bg-violet-500/10" />
                  <div className="h-8 rounded-lg bg-white/[0.03]" />
                  <div className="h-8 rounded-lg bg-white/[0.03]" />
                  <div className="h-8 rounded-lg bg-white/[0.03]" />
                </div>
              </div>

              {/* Fake dashboard */}
              <div className="col-span-12 p-5 sm:col-span-9 sm:p-7">
                <div className="mb-7 flex items-center justify-between">
                  <div>
                    <div className="h-5 w-36 rounded-md bg-white/10" />

                    <div className="mt-2 h-3 w-52 rounded-md bg-white/[0.04]" />
                  </div>

                  <div className="h-9 w-24 rounded-lg bg-violet-500/15" />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {[1, 2, 3].map((column) => (
                    <div
                      key={column}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
                    >
                      <div className="mb-3 h-3 w-20 rounded bg-white/10" />

                      <div className="space-y-2">
                        {[1, 2, 3].map((card) => (
                          <div
                            key={card}
                            className="rounded-lg border border-white/[0.05] bg-[#12101A] p-3"
                          >
                            <div className="h-2.5 w-3/4 rounded bg-white/10" />

                            <div className="mt-2 h-2 w-1/2 rounded bg-white/[0.04]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8"
        >
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
              Everything in one place
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need to move work forward.
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/40 sm:text-base">
              Powerful enough for serious projects, simple enough to stay out
              of your way.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.04]"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/10 text-violet-400 transition-all group-hover:border-violet-400/20 group-hover:bg-violet-500/15">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-base font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/40">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
              Getting started
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              From idea to execution.
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/40 sm:text-base">
              Set up your workspace and start collaborating in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-white/[0.07] bg-[#0E0C15] p-7"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-4xl font-bold tracking-tight text-violet-400/25">
                    {step.number}
                  </span>

                  <ArrowRight className="h-5 w-5 text-white/15" />
                </div>

                <h3 className="text-lg font-semibold text-white">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0E0C15] md:grid-cols-4">
            <div className="border-b border-white/[0.06] p-6 text-center md:border-b-0 md:border-r">
              <div className="text-2xl font-bold text-white">10K+</div>

              <div className="mt-1 text-xs text-white/30">
                Projects Created
              </div>
            </div>

            <div className="border-b border-white/[0.06] p-6 text-center md:border-b-0 md:border-r">
              <div className="text-2xl font-bold text-white">50K+</div>

              <div className="mt-1 text-xs text-white/30">
                Tasks Completed
              </div>
            </div>

            <div className="border-r-0 border-white/[0.06] p-6 text-center md:border-r">
              <div className="text-2xl font-bold text-white">5K+</div>

              <div className="mt-1 text-xs text-white/30">
                Active Teams
              </div>
            </div>

            <div className="p-6 text-center">
              <div className="text-2xl font-bold text-white">98%</div>

              <div className="mt-1 text-xs text-white/30">
                Satisfaction
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-violet-400/10 bg-gradient-to-br from-violet-500/[0.10] via-[#0E0C15] to-indigo-500/[0.06] px-6 py-14 sm:px-12">
            <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[80px]" />

            <div className="relative">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-500/10">
                <Zap className="h-5 w-5 text-violet-400" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to work smarter?
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/40 sm:text-base">
                Bring your projects, tasks, and team into one clean, focused
                workspace.
              </p>

              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-950/30 transition-all hover:bg-violet-500"
              >
                Create Free Account

                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 sm:px-8 md:flex-row">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
              <Zap className="h-4 w-4 text-violet-400" />
            </div>

            <span className="text-sm font-semibold text-white">
              TaskFlow
            </span>

            <span className="ml-1 text-xs text-white/20">
              © 2026
            </span>
          </Link>

          <div className="flex items-center gap-6 text-xs text-white/30">
            <a
              href="#"
              className="transition-colors hover:text-white/60"
            >
              Privacy
            </a>

            <a
              href="#"
              className="transition-colors hover:text-white/60"
            >
              Terms
            </a>

            <a
              href="#"
              className="transition-colors hover:text-white/60"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}