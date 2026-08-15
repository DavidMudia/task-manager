import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import {
  format,
  isToday,
  isPast,
  differenceInDays,
} from 'date-fns';

import {
  Plus,
  Calendar,
  Clock3,
  Activity,
  Bell,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  FolderKanban,
  Circle,
} from 'lucide-react';

import { CreateProjectModal } from '../components/CreateProjectModal';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const {
    data: projects = [],
    isLoading: projectsLoading,
  } = useProjects();

  const firstProjectId =
    projects.length > 0
      ? projects[0].id
      : undefined;

  const { data: tasks = [] } =
    useTasks(firstProjectId);

  const { data: activities = [] } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => [],
    enabled: false,
  });

  // ============================================================
  // CALCULATIONS
  // ============================================================

  const totalProjects = projects.length;

  const completedProjects = projects.filter(
    (project) => {
      const projectTasks = tasks.filter(
        (task) =>
          task.projectId === project.id
      );

      const total = projectTasks.length;

      const done = projectTasks.filter(
        (task) => task.status === 'done'
      ).length;

      return total > 0 && done === total;
    }
  ).length;

  const todayTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      isToday(new Date(task.dueDate)) &&
      task.status !== 'done'
  );

  const overdueTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      isPast(new Date(task.dueDate)) &&
      task.status !== 'done'
  );

  const upcomingTasks = tasks
    .filter(
      (task) =>
        task.dueDate &&
        !isPast(new Date(task.dueDate)) &&
        task.status !== 'done'
    )
    .sort(
      (a, b) =>
        new Date(a.dueDate!).getTime() -
        new Date(b.dueDate!).getTime()
    )
    .slice(0, 5);

  const getProjectProgress = (
    projectId: string
  ) => {
    const projectTasks = tasks.filter(
      (task) =>
        task.projectId === projectId
    );

    if (projectTasks.length === 0) {
      return 0;
    }

    const completed = projectTasks.filter(
      (task) =>
        task.status === 'done'
    ).length;

    return Math.round(
      (completed / projectTasks.length) *
        100
    );
  };

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

  // ============================================================
  // LOADING
  // ============================================================

  if (projectsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#09090F]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />

          <p className="text-sm text-[#8E8EA3]">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // DASHBOARD
  // ============================================================

  return (
    <div className="flex-1 min-h-full overflow-y-auto bg-[#09090F] text-[#F5F3FF]">
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />

              <span className="text-xs font-medium uppercase tracking-widest text-purple-400">
                Workspace
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              {getGreeting()},{' '}
              <span className="text-purple-400">
                {user?.name ||
                  user?.email ||
                  'User'}
              </span>
            </h1>

            <p className="mt-1.5 text-sm text-[#8E8EA3]">
              Here's what's happening across
              your projects.
            </p>
          </div>

          <button
            onClick={() =>
              setShowCreateModal(true)
            }
            className="
              group
              inline-flex
              items-center
              justify-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              bg-purple-600
              hover:bg-purple-500
              text-sm
              font-medium
              text-white
              shadow-lg
              shadow-purple-900/30
              border
              border-purple-400/20
              transition-all
              duration-200
              hover:-translate-y-0.5
            "
          >
            <Plus
              size={17}
              strokeWidth={2.5}
            />

            New Project
          </button>
        </div>

        {/* ======================================================
            STATS
        ====================================================== */}

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">

          {/* Projects */}

          <StatCard
            label="Total Projects"
            value={totalProjects}
            icon={
              <FolderKanban size={19} />
            }
            iconClass="text-purple-400 bg-purple-500/10 border-purple-500/10"
            accent="purple"
          />

          {/* Completed */}

          <StatCard
            label="Completed"
            value={completedProjects}
            icon={
              <CheckCircle2 size={19} />
            }
            iconClass="text-emerald-400 bg-emerald-500/10 border-emerald-500/10"
            accent="green"
          />

          {/* Today */}

          <StatCard
            label="Due Today"
            value={todayTasks.length}
            icon={
              <Clock3 size={19} />
            }
            iconClass="text-amber-400 bg-amber-500/10 border-amber-500/10"
            accent="yellow"
          />

          {/* Overdue */}

          <StatCard
            label="Overdue"
            value={overdueTasks.length}
            icon={
              <AlertCircle size={19} />
            }
            iconClass="text-red-400 bg-red-500/10 border-red-500/10"
            accent="red"
          />
        </div>

        {/* ======================================================
            MAIN GRID
        ====================================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* ====================================================
              LEFT / MAIN COLUMN
          ==================================================== */}

          <div className="xl:col-span-2 space-y-5">

            {/* ==================================================
                PROJECTS
            ================================================== */}

            <section className="rounded-2xl border border-[#242431] bg-[#11111A] overflow-hidden">

              <div className="flex items-center justify-between px-5 py-4 border-b border-[#242431]">

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Recent Projects
                  </h2>

                  <p className="text-xs text-[#717184] mt-1">
                    Your latest workspaces
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate('/projects')
                  }
                  className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View all
                  <ArrowUpRight size={13} />
                </button>
              </div>

              <div className="p-3 sm:p-4">

                {projects.length === 0 ? (
                  <EmptyState
                    icon={
                      <FolderKanban
                        size={20}
                      />
                    }
                    title="No projects yet"
                    description="Create your first project to get started."
                  />
                ) : (
                  <div className="space-y-2">

                    {projects
                      .slice(0, 5)
                      .map((project) => {

                        const progress =
                          getProjectProgress(
                            project.id
                          );

                        
                        return (
                          <div
                            key={project.id}
                            onClick={() =>
                              navigate(
                                `/project/${project.id}/overview`
                              )
                            }
                            className="
                              group
                              flex
                              items-center
                              gap-4
                              p-3.5
                              rounded-xl
                              border
                              border-transparent
                              hover:border-[#2B2B3B]
                              hover:bg-[#171720]
                              cursor-pointer
                              transition-all
                              duration-200
                            "
                          >

                            {/* Project icon */}

                            <div
  className="
    w-10
    h-10
    rounded-xl
    flex
    items-center
    justify-center
    shrink-0
    border
    border-purple-500/10
    bg-purple-500/10
    text-purple-400
  "
>
  <FolderKanban size={18} />
</div>

                            {/* Project details */}

                            <div className="flex-1 min-w-0">

                              <div className="flex items-center justify-between gap-3 mb-2">

                                <div className="flex items-center gap-2 min-w-0">

                                  <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-purple-500" />

                                  <span className="text-sm font-medium text-[#E9E7F2] truncate group-hover:text-white transition-colors">
                                    {project.name}
                                  </span>
                                </div>

                                <span className="text-xs text-[#77778A] shrink-0">
                                  {progress}%
                                </span>
                              </div>

                              <div className="h-1.5 rounded-full bg-[#252532] overflow-hidden">

                                <div
  className="h-full rounded-full bg-purple-500 transition-all duration-500"
  style={{
    width: `${progress}%`,
  }}
/>

                              </div>

                            </div>

                            <ArrowUpRight
                              size={16}
                              className="text-[#555568] group-hover:text-purple-400 transition-colors shrink-0"
                            />
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </section>

            {/* ==================================================
                UPCOMING DEADLINES
            ================================================== */}

            <section className="rounded-2xl border border-[#242431] bg-[#11111A] overflow-hidden">

              <div className="px-5 py-4 border-b border-[#242431]">

                <div className="flex items-center gap-3">

                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/10 flex items-center justify-center text-purple-400">
                    <Calendar size={16} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Upcoming Deadlines
                    </h2>

                    <p className="text-xs text-[#717184] mt-0.5">
                      Stay ahead of your schedule
                    </p>
                  </div>

                </div>
              </div>

              <div className="p-3 sm:p-4">

                {upcomingTasks.length === 0 ? (
                  <EmptyState
                    icon={
                      <CheckCircle2
                        size={20}
                      />
                    }
                    title="You're all caught up"
                    description="There are no upcoming deadlines."
                  />
                ) : (
                  <div className="space-y-2">

                    {upcomingTasks.map(
                      (task) => {

                        const daysUntil =
                          differenceInDays(
                            new Date(
                              task.dueDate!
                            ),
                            new Date()
                          );

                        return (
                          <div
                            key={task.id}
                            onClick={() =>
                              navigate(
                                `/project/${task.projectId}/task/${task.id}`
                              )
                            }
                            className="
                              group
                              flex
                              items-center
                              justify-between
                              gap-4
                              p-3.5
                              rounded-xl
                              border
                              border-transparent
                              hover:border-[#2B2B3B]
                              hover:bg-[#171720]
                              cursor-pointer
                              transition-all
                            "
                          >

                            <div className="flex items-center gap-3 min-w-0">

                              <div className="w-8 h-8 rounded-lg bg-[#1A1A25] flex items-center justify-center shrink-0 text-[#77778A] group-hover:text-purple-400 transition-colors">
                                <Calendar
                                  size={15}
                                />
                              </div>

                              <div className="min-w-0">

                                <p className="text-sm font-medium text-[#E9E7F2] truncate">
                                  {task.title}
                                </p>

                                <p className="text-xs text-[#717184] mt-1">
                                  {daysUntil === 0
                                    ? 'Due today'
                                    : daysUntil ===
                                        1
                                      ? 'Tomorrow'
                                      : `${daysUntil} days left`}
                                </p>

                              </div>

                            </div>

                            <span
                              className={`
                                shrink-0
                                text-[11px]
                                font-medium
                                px-2.5
                                py-1
                                rounded-full
                                border
                                ${
                                  daysUntil <=
                                  0
                                    ? 'bg-red-500/10 text-red-400 border-red-500/10'
                                    : daysUntil <=
                                        2
                                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/10'
                                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10'
                                }
                              `}
                            >
                              {daysUntil <= 0
                                ? 'Overdue'
                                : daysUntil ===
                                    1
                                  ? 'Tomorrow'
                                  : `${daysUntil}d`}
                            </span>

                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* ====================================================
              RIGHT COLUMN
          ==================================================== */}

          <div className="space-y-5">

            {/* ==================================================
                TODAY'S TASKS
            ================================================== */}

            <section className="rounded-2xl border border-[#242431] bg-[#11111A] overflow-hidden">

              <div className="px-5 py-4 border-b border-[#242431]">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/10 flex items-center justify-center text-amber-400">
                      <Clock3 size={16} />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-white">
                        Today's Tasks
                      </h2>

                      <p className="text-xs text-[#717184] mt-0.5">
                        {todayTasks.length}{' '}
                        remaining
                      </p>
                    </div>

                  </div>

                  {todayTasks.length >
                    0 && (
                    <span className="text-xs font-medium text-amber-400">
                      {todayTasks.length}
                    </span>
                  )}

                </div>
              </div>

              <div className="p-4">

                {todayTasks.length ===
                0 ? (
                  <EmptyState
                    icon={
                      <CheckCircle2
                        size={20}
                      />
                    }
                    title="Nothing due today"
                    description="Enjoy the clear schedule."
                  />
                ) : (
                  <div className="space-y-1">

                    {todayTasks.map(
                      (task) => (
                        <div
                          key={task.id}
                          onClick={() =>
                            navigate(
                              `/project/${task.projectId}/task/${task.id}`
                            )
                          }
                          className="
                            group
                            flex
                            items-center
                            gap-3
                            p-2.5
                            rounded-lg
                            hover:bg-[#191923]
                            cursor-pointer
                            transition-colors
                          "
                        >

                          <Circle
                            size={15}
                            className="text-purple-500 group-hover:fill-purple-500 transition-all shrink-0"
                          />

                          <span className="text-sm text-[#C7C5D1] group-hover:text-white truncate transition-colors">
                            {task.title}
                          </span>

                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* ==================================================
                ACTIVITY
            ================================================== */}

            <section className="rounded-2xl border border-[#242431] bg-[#11111A] overflow-hidden">

              <div className="px-5 py-4 border-b border-[#242431]">

                <div className="flex items-center gap-3">

                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/10 flex items-center justify-center text-purple-400">
                    <Activity size={16} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Recent Activity
                    </h2>

                    <p className="text-xs text-[#717184] mt-0.5">
                      Latest workspace updates
                    </p>
                  </div>

                </div>
              </div>

              <div className="p-4">

                {activities.length ===
                0 ? (
                  <EmptyState
                    icon={
                      <Activity
                        size={20}
                      />
                    }
                    title="No recent activity"
                    description="Updates will appear here."
                  />
                ) : (
                  <div className="space-y-3">

                    {activities
                      .slice(0, 5)
                      .map(
                        (act: any) => (
                          <div
                            key={act.id}
                            className="flex gap-3"
                          >

                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />

                            <div className="min-w-0">

                              <p className="text-sm text-[#C7C5D1]">
                                {act.message}
                              </p>

                              <p className="text-[11px] text-[#626276] mt-1">
                                {format(
                                  new Date(
                                    act.createdAt
                                  ),
                                  'h:mm a'
                                )}
                              </p>

                            </div>

                          </div>
                        )
                      )}
                  </div>
                )}
              </div>
            </section>

            {/* ==================================================
                NOTIFICATIONS
            ================================================== */}

            <section className="rounded-2xl border border-purple-500/10 bg-gradient-to-br from-[#15121F] to-[#11111A] overflow-hidden">

              <div className="px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/10 flex items-center justify-center text-purple-400">
                    <Bell size={16} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Notifications
                    </h2>

                    <p className="text-xs text-[#717184] mt-0.5">
                      You're all caught up
                    </p>
                  </div>

                </div>

                <div className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#0D0D14] border border-[#252532]">

                  <CheckCircle2
                    size={14}
                    className="text-emerald-400"
                  />

                  <span className="text-xs text-[#8E8EA3]">
                    No new notifications
                  </span>

                </div>

              </div>
            </section>

            {/* ==================================================
                INVITATIONS
            ================================================== */}

            <section className="rounded-2xl border border-[#242431] bg-[#11111A] overflow-hidden">

              <div className="px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <UserPlus size={16} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Team Invitations
                    </h2>

                    <p className="text-xs text-[#717184] mt-0.5">
                      Collaboration requests
                    </p>
                  </div>

                </div>

                <div className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#0D0D14] border border-[#252532]">

                  <CheckCircle2
                    size={14}
                    className="text-emerald-400"
                  />

                  <span className="text-xs text-[#8E8EA3]">
                    No pending invitations
                  </span>

                </div>

              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ========================================================
          CREATE PROJECT MODAL
      ======================================================== */}

      {showCreateModal && (
        <CreateProjectModal
          onClose={() =>
            setShowCreateModal(false)
          }
          onSuccess={() =>
            setShowCreateModal(false)
          }
        />
      )}
    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  label,
  value,
  icon,
  iconClass,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
  accent: string;
}) {
  const accentMap: Record<
    string,
    string
  > = {
    purple:
      'from-purple-500/10',
    green:
      'from-emerald-500/10',
    yellow:
      'from-amber-500/10',
    red:
      'from-red-500/10',
  };

  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-2xl
        border
        border-[#242431]
        bg-gradient-to-br
        ${accentMap[accent] || 'from-transparent'}
        to-[#11111A]
        p-4
        sm:p-5
        transition-all
        duration-200
        hover:border-[#303041]
      `}
    >

      <div className="flex items-center justify-between gap-3">

        <div>

          <p className="text-xs sm:text-sm text-[#77778A]">
            {label}
          </p>

          <p className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>

        </div>

        <div
          className={`
            w-9
            h-9
            sm:w-10
            sm:h-10
            rounded-xl
            border
            flex
            items-center
            justify-center
            ${iconClass}
          `}
        >
          {icon}
        </div>

      </div>

      <div className="absolute -bottom-5 -right-5 w-20 h-20 rounded-full bg-purple-500/5 blur-2xl pointer-events-none" />
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 px-4">

      <div className="w-10 h-10 rounded-xl bg-[#191923] border border-[#292936] flex items-center justify-center text-[#68687A] mb-3">
        {icon}
      </div>

      <p className="text-sm font-medium text-[#B7B5C4]">
        {title}
      </p>

      <p className="text-xs text-[#626276] mt-1 max-w-[220px]">
        {description}
      </p>

    </div>
  );
}