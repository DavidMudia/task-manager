import {
  Outlet,
  Link,
  useParams,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { useProjects } from '../hooks/useProjects';

import {
  LayoutDashboard,
  Kanban,
  Users,
  Activity,
  MessageSquare,
  ArrowLeft,
} from 'lucide-react';

const TABS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    path: 'overview',
  },
  {
    id: 'board',
    label: 'Board',
    icon: Kanban,
    path: 'board',
  },
  {
    id: 'members',
    label: 'Members',
    icon: Users,
    path: 'members',
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: Activity,
    path: 'activity',
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: MessageSquare,
    path: 'chat',
  },
];

export function ProjectWorkspace() {
  const { projectId } =
    useParams<{ projectId: string }>();

  const location = useLocation();
  const navigate = useNavigate();

  const { data: projects } = useProjects();

  const project = projects?.find(
    (p) => p.id === projectId
  );

  /*
   * ---------------------------------------------------------
   * PROJECT NOT FOUND
   * ---------------------------------------------------------
   */

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center bg-[#09090F] text-[#8E8EA3]">
        Project not found
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * NAVIGATION
   * ---------------------------------------------------------
   */

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  /*
   * Determine active tab.
   *
   * Using pathname.endsWith() prevents things such as
   * "activity" accidentally matching another route.
   */

  const isTabActive = (path: string) => {
    return (
      location.pathname ===
        `/project/${projectId}/${path}` ||
      location.pathname.startsWith(
        `/project/${projectId}/${path}/`
      )
    );
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#09090F] text-white">

      {/* =====================================================
          PROJECT HEADER
      ====================================================== */}

      <header className="z-30 flex h-16 flex-shrink-0 items-center justify-between border-b border-[#242431] bg-[#11111A] px-3 sm:px-4 md:px-6">

        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

          {/* Back */}

          <button
            type="button"
            onClick={goToDashboard}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[#8E8EA3] transition hover:bg-[#242431] hover:text-[#F5F3FF]"
            aria-label="Go to dashboard"
          >
            <ArrowLeft size={19} />
          </button>

          {/* Project color */}

          <div
            className="h-8 w-8 flex-shrink-0 rounded-full border border-[#242431]"
            style={{
              backgroundColor:
                project.color || '#7C3AED',
            }}
          />

          {/* Project information */}

          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-[#F5F3FF] sm:text-base md:text-lg">
              {project.name}
            </h1>

            <p className="hidden truncate text-xs text-[#8E8EA3] sm:block">
              {project.category || 'General'}
              {' · '}
              {project.members?.length || 0}
              {' members'}
            </p>
          </div>
        </div>

        {/* Desktop category */}

        <span className="hidden flex-shrink-0 text-xs text-[#626276] sm:text-sm md:block">
          {project.category || 'General'}
        </span>
      </header>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      {/*
        On mobile we leave enough space at the bottom for the
        fixed navigation bar.

        md:pb-0 removes that padding on desktop.
      */}

      <div className="min-h-0 flex-1 pb-[76px] md:pb-0">

        <div className="h-full overflow-y-auto overscroll-contain">

          <Outlet />

          {/* Extra mobile scroll space */}

          <div className="h-2 md:hidden" />

        </div>
      </div>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ====================================================== */}

      <nav
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-[100]
          flex
          h-16
          items-center
          justify-around
          border-t
          border-[#242431]
          bg-[#11111A]/95
          px-1
          shadow-[0_-8px_30px_rgba(0,0,0,0.35)]
          backdrop-blur-xl
          md:hidden
        "
        style={{
          paddingBottom:
            'env(safe-area-inset-bottom)',
        }}
        aria-label="Project navigation"
      >

        {TABS.map((tab) => {
          const isActive =
            isTabActive(tab.path);

          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              to={`/project/${projectId}/${tab.path}`}
              className={`
                relative
                flex
                h-full
                min-w-0
                flex-1
                flex-col
                items-center
                justify-center
                gap-1
                px-1
                text-[10px]
                font-medium
                transition-all
                active:scale-95
                ${
                  isActive
                    ? 'text-purple-400'
                    : 'text-[#77768A] hover:text-[#E9E7F2]'
                }
              `}
              aria-current={
                isActive
                  ? 'page'
                  : undefined
              }
            >
              {/* Active indicator */}

              {isActive && (
                <span
                  className="
                    absolute
                    top-0
                    h-0.5
                    w-8
                    rounded-full
                    bg-purple-400
                    shadow-[0_0_10px_rgba(168,85,247,0.7)]
                  "
                />
              )}

              <Icon
                size={19}
                strokeWidth={
                  isActive ? 2.3 : 1.8
                }
              />

              <span className="max-w-full truncate">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* =====================================================
          DESKTOP TAB NAVIGATION
      ====================================================== */}

      <nav
        className="
          hidden
          flex-shrink-0
          items-center
          gap-2
          overflow-x-auto
          border-t
          border-[#242431]
          bg-[#11111A]
          px-4
          md:flex
        "
        aria-label="Project navigation"
      >

        {TABS.map((tab) => {
          const isActive =
            isTabActive(tab.path);

          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              to={`/project/${projectId}/${tab.path}`}
              className={`
                flex
                items-center
                gap-2
                whitespace-nowrap
                border-b-2
                px-3
                py-3
                text-sm
                font-medium
                transition-all
                ${
                  isActive
                    ? 'border-purple-400 text-[#F5F3FF]'
                    : 'border-transparent text-[#8E8EA3] hover:border-[#3A3A4A] hover:text-[#E9E7F2]'
                }
              `}
              aria-current={
                isActive
                  ? 'page'
                  : undefined
              }
            >
              <Icon size={16} />

              <span>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}