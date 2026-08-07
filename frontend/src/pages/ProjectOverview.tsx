import { useParams } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import { Calendar, CheckCircle, Clock, FolderKanban } from 'lucide-react';

export function ProjectOverview() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: projects } = useProjects();
  const { data: tasks = [] } = useTasks(projectId);
  const project = projects?.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#8E8EA3]">
        Loading project...
      </div>
    );
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;

  return (
    <div className="flex-1 overflow-y-auto bg-[#09090F] text-[#F5F3FF] p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />
            <span className="text-xs font-medium uppercase tracking-widest text-purple-400">
              Project Overview
            </span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#F5F3FF]">
            {project.name}
          </h2>
          <p className="text-sm text-[#8E8EA3] mt-1">
            {project.category || 'General'} · {project.members?.length || 0} members
          </p>
        </div>

        {/* Stats Cards – Dark */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-2xl border border-[#242431] bg-[#11111A] p-4 shadow-lg hover:border-[#303041] transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/10">
                <FolderKanban size={18} className="text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-[#8E8EA3]">Total Tasks</div>
                <div className="text-xl font-bold text-[#F5F3FF]">{totalTasks}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#242431] bg-[#11111A] p-4 shadow-lg hover:border-[#303041] transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/10">
                <CheckCircle size={18} className="text-emerald-400" />
              </div>
              <div>
                <div className="text-sm text-[#8E8EA3]">Completed</div>
                <div className="text-xl font-bold text-[#F5F3FF]">{completedTasks}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#242431] bg-[#11111A] p-4 shadow-lg hover:border-[#303041] transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/10">
                <Clock size={18} className="text-amber-400" />
              </div>
              <div>
                <div className="text-sm text-[#8E8EA3]">Progress</div>
                <div className="text-xl font-bold text-[#F5F3FF]">{progress}%</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#242431] bg-[#11111A] p-4 shadow-lg hover:border-[#303041] transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/10">
                <Calendar size={18} className="text-red-400" />
              </div>
              <div>
                <div className="text-sm text-[#8E8EA3]">Overdue</div>
                <div className="text-xl font-bold text-[#F5F3FF]">{overdueTasks}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar – Dark */}
        <div className="rounded-2xl border border-[#242431] bg-[#11111A] p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#8E8EA3]">Project completion</span>
            <span className="text-sm font-medium text-[#F5F3FF]">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-[#242431] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Project Details – Dark */}
        <div className="rounded-2xl border border-[#242431] bg-[#11111A] p-6 shadow-lg">
          <h3 className="text-sm font-semibold text-[#8E8EA3] uppercase tracking-wider mb-4">
            Project Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[#717184]">Name</span>
              <p className="text-[#F5F3FF] font-medium">{project.name}</p>
            </div>
            {project.description && (
              <div>
                <span className="text-[#717184]">Description</span>
                <p className="text-[#E9E7F2]">{project.description}</p>
              </div>
            )}
            {project.category && (
              <div>
                <span className="text-[#717184]">Category</span>
                <p className="text-[#E9E7F2]">{project.category}</p>
              </div>
            )}
            <div>
              <span className="text-[#717184]">Visibility</span>
              <p className="text-[#E9E7F2] capitalize">{project.visibility || 'private'}</p>
            </div>
            <div>
              <span className="text-[#717184]">Members</span>
              <p className="text-[#E9E7F2]">{project.members?.length || 0} members</p>
            </div>
            <div>
              <span className="text-[#717184]">Created</span>
              <p className="text-[#E9E7F2]">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}