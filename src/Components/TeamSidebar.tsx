import { Users, Mail, Video } from 'lucide-react';
import type { TeamMember, Task } from '../Types';

interface TeamSidebarProps {
  teamMembers: TeamMember[];
  tasks: Task[];
}

export function TeamSidebar({ teamMembers, tasks }: TeamSidebarProps) {
  const getAssignedCount = (memberId: string) => tasks.filter(t => t.assigneeId === memberId).length;
  const getCompletedCount = (memberId: string) => tasks.filter(t => t.assigneeId === memberId && t.columnId === 'done').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Users size={18} className="text-indigo-600" />
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Team Members</h3>
      </div>
      <div className="space-y-2">
        {teamMembers.map(member => {
          const assigned = getAssignedCount(member.id);
          const completed = getCompletedCount(member.id);
          return (
            <div key={member.id} className="p-3 rounded-xl bg-white border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.avatar}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${member.online ? 'bg-green-400' : 'bg-gray-300'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{member.name}</p>
                  <p className="text-xs text-gray-400">{member.role}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    <span className="font-semibold text-gray-600">{assigned}</span> tasks
                  </span>
                  <span className="text-xs text-gray-400">
                    <span className="font-semibold text-green-600">{completed}</span> done
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors">
                    <Mail size={14} />
                  </button>
                  <button className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors">
                    <Video size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Stats */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
        <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3">Team Overview</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{tasks.length}</p>
            <p className="text-xs text-gray-500">Total Tasks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{tasks.filter(t => t.columnId === 'done').length}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-500">{tasks.filter(t => t.priority === 'urgent' || t.priority === 'high').length}</p>
            <p className="text-xs text-gray-500">High Priority</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{teamMembers.filter(m => m.online).length}</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}