import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  FolderKanban,
  Plus,
  Search,
  Users,
  CheckSquare,
  ArrowUpRight,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { api } from '../services/api';

type Project = {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  color?: string | null;
  coverImage?: string | null;
  visibility?: string | null;
  updatedAt?: string;
  createdAt?: string;

  owner?: {
    id: string;
    username: string;
    name?: string | null;
    email: string;
  };

  tasks?: Array<{
    id: string;
    status?: string;
  }>;

  members?: Array<{
    user: {
      id: string;
      username: string;
      name?: string | null;
      email: string;
    };
  }>;
};

export function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [searchQuery, setSearchQuery] =
    useState('');

  // ============================================================
  // LOAD PROJECTS
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await api.get('/projects');

        if (mounted) {
          setProjects(
            Array.isArray(response.data)
              ? response.data
              : []
          );
        }
      } catch (error) {
        console.error(
          'Failed to load projects:',
          error
        );

        if (mounted) {
          setError(
            'Unable to load your projects. Please try again.'
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  // ============================================================
  // FILTER PROJECTS
  // ============================================================

  const filteredProjects =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      if (!query) {
        return projects;
      }

      return projects.filter(
        project =>
          project.name
            .toLowerCase()
            .includes(query) ||
          project.description
            ?.toLowerCase()
            .includes(query) ||
          project.category
            ?.toLowerCase()
            .includes(query)
      );
    }, [
      projects,
      searchQuery,
    ]);

  // ============================================================
  // PROJECT STATS
  // ============================================================

  const getTaskCount = (
    project: Project
  ) => {
    return project.tasks?.length || 0;
  };

  const getMemberCount = (
    project: Project
  ) => {
    return project.members?.length || 0;
  };

  const getCompletedTaskCount = (
    project: Project
  ) => {
    return (
      project.tasks?.filter(
        task =>
          task.status === 'done' ||
          task.status === 'completed'
      ).length || 0
    );
  };

  const getProgress = (
    project: Project
  ) => {
    const total =
      getTaskCount(project);

    if (total === 0) {
      return 0;
    }

    return Math.round(
      (getCompletedTaskCount(
        project
      ) /
        total) *
        100
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-full bg-[#09090F] p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-2">
              <FolderKanban
                size={22}
                className="text-purple-400"
              />

              <h1 className="text-2xl font-bold tracking-tight text-white">
                Projects
              </h1>
            </div>

            <p className="mt-1 text-sm text-[#717184]">
              All your projects and workspaces
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate('/dashboard')
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
          >
            <Plus size={17} />
            New Project
          </button>

        </div>

        {/* =====================================================
            SEARCH
        ====================================================== */}

        <div className="mb-6">

          <div className="relative max-w-md">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#626276]"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={event =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search projects..."
              className="w-full rounded-xl border border-[#242431] bg-[#11111A] py-2.5 pl-10 pr-4 text-sm text-[#E9E7F2] outline-none transition placeholder:text-[#626276] focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/10"
            />

          </div>

        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="h-52 animate-pulse rounded-2xl border border-[#242431] bg-[#11111A]"
              />
            ))}

          </div>
        )}

        {/* =====================================================
            EMPTY
        ====================================================== */}

        {!loading &&
          !error &&
          filteredProjects.length === 0 && (
            <div className="rounded-2xl border border-[#242431] bg-[#11111A] px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                <FolderKanban
                  size={25}
                />
              </div>

              <h2 className="mt-4 text-base font-semibold text-white">
                {projects.length === 0
                  ? 'No projects yet'
                  : 'No projects found'}
              </h2>

              <p className="mx-auto mt-1 max-w-sm text-sm text-[#717184]">
                {projects.length === 0
                  ? 'Create your first project to get started.'
                  : 'Try changing your search query.'}
              </p>

              {projects.length === 0 && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/dashboard'
                    )
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
                >
                  <Plus size={16} />
                  Create Project
                </button>
              )}

            </div>
          )}

        {/* =====================================================
            PROJECT GRID
        ====================================================== */}

        {!loading &&
          filteredProjects.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {filteredProjects.map(
                project => {
                  const projectColor =
                    project.color ||
                    '#7C3AED';

                  const taskCount =
                    getTaskCount(
                      project
                    );

                  const memberCount =
                    getMemberCount(
                      project
                    );

                  const progress =
                    getProgress(
                      project
                    );

                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() =>
                        navigate(
                          `/project/${project.id}/overview`
                        )
                      }
                      className="group overflow-hidden rounded-2xl border border-[#242431] bg-[#11111A] text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#36364A] hover:bg-[#14141E] hover:shadow-xl hover:shadow-black/20"
                    >

                      {/* Project color */}

                      <div
                        className="h-1.5 w-full"
                        style={{
                          backgroundColor:
                            projectColor,
                        }}
                      />

                      <div className="p-5">

                        {/* Top */}

                        <div className="flex items-start justify-between gap-3">

                          <div className="flex min-w-0 items-center gap-3">

                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                              style={{
                                backgroundColor: `${projectColor}22`,
                                color:
                                  projectColor,
                              }}
                            >
                              <FolderKanban
                                size={19}
                              />
                            </div>

                            <div className="min-w-0">

                              <h2 className="truncate text-sm font-semibold text-white">
                                {
                                  project.name
                                }
                              </h2>

                              <p className="mt-0.5 truncate text-xs text-[#626276]">
                                {
                                  project.category ||
                                  'General'
                                }
                              </p>

                            </div>

                          </div>

                          <ArrowUpRight
                            size={17}
                            className="shrink-0 text-[#626276] transition group-hover:text-purple-400"
                          />

                        </div>

                        {/* Description */}

                        <p className="mt-4 line-clamp-2 min-h-[40px] text-sm leading-relaxed text-[#858497]">
                          {project.description ||
                            'No description provided.'}
                        </p>

                        {/* Progress */}

                        <div className="mt-5">

                          <div className="mb-2 flex items-center justify-between">

                            <span className="text-xs text-[#717184]">
                              Progress
                            </span>

                            <span className="text-xs font-medium text-[#B7B5C6]">
                              {progress}%
                            </span>

                          </div>

                          <div className="h-1.5 overflow-hidden rounded-full bg-[#242431]">

                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${progress}%`,
                                backgroundColor:
                                  projectColor,
                              }}
                            />

                          </div>

                        </div>

                        {/* Stats */}

                        <div className="mt-5 flex items-center gap-4 border-t border-[#242431] pt-4">

                          <div className="flex items-center gap-1.5 text-xs text-[#717184]">
                            <CheckSquare
                              size={14}
                            />
                            {taskCount}{' '}
                            {taskCount === 1
                              ? 'task'
                              : 'tasks'}
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-[#717184]">
                            <Users
                              size={14}
                            />
                            {memberCount}{' '}
                            {memberCount === 1
                              ? 'member'
                              : 'members'}
                          </div>

                        </div>

                      </div>

                    </button>
                  );
                }
              )}

            </div>
          )}

      </div>

    </div>
  );
}