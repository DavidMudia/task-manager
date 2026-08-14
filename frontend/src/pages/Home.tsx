import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Flame,
  Megaphone,
  MessageCircle,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../hooks/useProjects';

interface PlatformEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  icon: typeof Trophy;
}

const platformEvents: PlatformEvent[] = [
  {
    id: 'taskflow-challenge',
    title: '30-Day Productivity Challenge',
    description:
      'Build better habits, complete your projects, and climb the community leaderboard.',
    date: 'August 10 – September 8',
    type: 'Community Challenge',
    icon: Trophy,
  },
  {
    id: 'product-update',
    title: 'TaskFlow Product Week',
    description:
      'New collaboration features, workspace improvements, and more are coming this month.',
    date: 'August 18',
    type: 'Product Update',
    icon: Sparkles,
  },
];

const announcements = [
  {
    title: 'Real-time collaboration is here',
    description:
      'Chat with your project team instantly and stay connected while work moves forward.',
    icon: MessageCircle,
  },
  {
    title: 'Build your workspace',
    description:
      'Create projects, invite your team, and turn ideas into organized workflows.',
    icon: Zap,
  },
  {
    title: 'Your feedback matters',
    description:
      'Help shape the next generation of TaskFlow by sharing how you use the platform.',
    icon: Megaphone,
  },
];

export function Home() {
  const { user } = useAuth();
  const { data: projects = [], isLoading } = useProjects();

  const firstName =
    user?.name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'there';

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good morning';
    }

    if (hour < 17) {
      return 'Good afternoon';
    }

    return 'Good evening';
  };

  return (
    <div className="min-h-full bg-[#09090F] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8">

        {/* =====================================================
            WELCOME
        ====================================================== */}

        <section className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-purple-300">
                <Sparkles size={16} />
                <span>TaskFlow Home</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                {getGreeting()}, {firstName}.
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#85859A] md:text-base">
                Stay in the loop with what is happening across TaskFlow,
                discover new challenges, and jump back into your work.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#29293A] bg-[#15151F] px-4 py-2.5 text-sm font-medium text-[#E8E6F0] transition hover:border-purple-500/40 hover:bg-[#1A1A27]"
            >
              My Dashboard
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* =====================================================
            PLATFORM PULSE
        ====================================================== */}

        <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-[#29293A] bg-[#11111A] p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
              <Zap size={18} />
            </div>

            <p className="text-2xl font-bold text-white">24/7</p>
            <p className="mt-1 text-xs text-[#74748A]">Platform activity</p>
          </div>

          <div className="rounded-2xl border border-[#29293A] bg-[#11111A] p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
              <Users size={18} />
            </div>

            <p className="text-2xl font-bold text-white">Growing</p>
            <p className="mt-1 text-xs text-[#74748A]">Community</p>
          </div>

          <div className="rounded-2xl border border-[#29293A] bg-[#11111A] p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
              <CheckCircle2 size={18} />
            </div>

            <p className="text-2xl font-bold text-white">
              {projects.length}
            </p>

            <p className="mt-1 text-xs text-[#74748A]">Your projects</p>
          </div>

          <div className="rounded-2xl border border-[#29293A] bg-[#11111A] p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-300">
              <Flame size={18} />
            </div>

            <p className="text-2xl font-bold text-white">Active</p>
            <p className="mt-1 text-xs text-[#74748A]">Community pulse</p>
          </div>
        </section>

        {/* =====================================================
            FEATURED EVENT
        ====================================================== */}

        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-400">
                Featured
              </p>

              <h2 className="mt-1 text-xl font-semibold text-white">
                Happening on TaskFlow
              </h2>
            </div>

            <span className="hidden items-center gap-1 text-xs text-[#66667A] sm:flex">
              <Bell size={14} />
              Platform updates
            </span>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#191328] via-[#15121F] to-[#101018] p-6 md:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-indigo-600/10 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300">
                  <Trophy size={14} />
                  Community Challenge
                </div>

                <h3 className="max-w-2xl text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Turn your productivity into a competition.
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#9894A8] md:text-base">
                  Join the 30-Day Productivity Challenge. Complete tasks,
                  keep your projects moving, and see how consistently you can
                  show up.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition hover:bg-purple-500"
                  >
                    Join Challenge
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#343348] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-[#D8D5E4] transition hover:bg-white/[0.06]"
                  >
                    View Leaderboard
                    <Trophy size={16} />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-[#77768A]">Challenge period</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      August 10 – September 8
                    </p>
                  </div>
                </div>

                <div className="my-5 h-px bg-white/10" />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#77768A]">
                    Participants
                  </span>

                  <span className="text-sm font-semibold text-purple-300">
                    Open
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-purple-600 to-indigo-500" />
                </div>

                <p className="mt-2 text-xs text-[#66667A]">
                  Registration is currently open
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            MAIN GRID
        ====================================================== */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* ===================================================
              ANNOUNCEMENTS
          ==================================================== */}

          <section className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#68677C]">
                  Platform
                </p>

                <h2 className="mt-1 text-xl font-semibold text-white">
                  What's happening
                </h2>
              </div>

              <span className="text-xs text-[#5F5E72]">
                Latest updates
              </span>
            </div>

            <div className="space-y-3">
              {announcements.map((announcement) => {
                const Icon = announcement.icon;

                return (
                  <div
                    key={announcement.title}
                    className="group rounded-2xl border border-[#29293A] bg-[#11111A] p-5 transition hover:border-purple-500/20 hover:bg-[#13131D]"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300 transition group-hover:bg-purple-500/15">
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="text-sm font-semibold text-white">
                            {announcement.title}
                          </h3>

                          <span className="text-[11px] text-[#5F5E72]">
                            Just now
                          </span>
                        </div>

                        <p className="mt-1.5 text-sm leading-5 text-[#77768A]">
                          {announcement.description}
                        </p>
                      </div>

                      <ChevronRight
                        size={17}
                        className="mt-1 hidden text-[#4D4C60] transition group-hover:translate-x-0.5 group-hover:text-purple-400 sm:block"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ===================================================
              EVENTS
          ==================================================== */}

          <section>
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#68677C]">
                Calendar
              </p>

              <h2 className="mt-1 text-xl font-semibold text-white">
                Upcoming
              </h2>
            </div>

            <div className="space-y-3">
              {platformEvents.map((event) => {
                const Icon = event.icon;

                return (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-[#29293A] bg-[#11111A] p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
                        <Icon size={18} />
                      </div>

                      <span className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-[#77768A]">
                        {event.type}
                      </span>
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-white">
                      {event.title}
                    </h3>

                    <p className="mt-1.5 text-xs leading-5 text-[#77768A]">
                      {event.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3 text-xs text-[#67667A]">
                      <Clock3 size={13} />
                      {event.date}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* =====================================================
            YOUR WORK
        ====================================================== */}

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#68677C]">
                Your workspace
              </p>

              <h2 className="mt-1 text-xl font-semibold text-white">
                Jump back into your work
              </h2>
            </div>

            <Link
  to="/projects"
  className="hidden items-center gap-1 text-xs font-medium text-purple-400 transition hover:text-purple-300 sm:flex"
>
  View all projects
  <ArrowRight size={14} />
</Link>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-[#29293A] bg-[#11111A] p-6 text-sm text-[#6F6E82]">
              Loading your projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#303043] bg-[#11111A] p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
                <Zap size={20} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-white">
                Your workspace is waiting
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#6F6E82]">
                Create your first project and start turning your ideas into
                something real.
              </p>

              <Link
                to="/dashboard"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-purple-500"
              >
                Create a Project
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 6).map((project) => (
                <Link
                  key={project.id}
                  to={`/project/${project.id}/overview`}
                  className="group rounded-2xl border border-[#29293A] bg-[#11111A] p-5 transition hover:-translate-y-0.5 hover:border-purple-500/25 hover:bg-[#14141E]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: project.color || '#8B5CF6',
                      }}
                    />

                    <ArrowRight
                      size={16}
                      className="text-[#4E4D60] transition group-hover:translate-x-0.5 group-hover:text-purple-400"
                    />
                  </div>

                  <h3 className="mt-5 truncate text-sm font-semibold text-white">
                    {project.name}
                  </h3>

                  <p className="mt-1 text-xs text-[#68677B]">
                    Open project workspace
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* =====================================================
            FINAL PLATFORM CTA
        ====================================================== */}

        <section className="mt-8 overflow-hidden rounded-3xl border border-purple-500/15 bg-gradient-to-r from-[#161122] to-[#11111A] p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-purple-300">
                <Sparkles size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Keep building
                </span>
              </div>

              <h2 className="mt-2 text-xl font-bold text-white md:text-2xl">
                Your next great project starts here.
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-5 text-[#77768A]">
                Stay consistent, collaborate with your team, and make progress
                visible.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex w-fit flex-shrink-0 items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-950/30 transition hover:bg-purple-500"
            >
              Open Dashboard
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}