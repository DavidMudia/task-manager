import { Users, CheckCircle } from 'lucide-react';
import type { User, Task } from '../Types';

interface TeamSidebarProps {
  teamMembers: User[];
  tasks: Task[];
}

export function TeamSidebar({ teamMembers, tasks }: TeamSidebarProps) {
  const getAssignedCount = (memberId: string) =>
    tasks.filter(t => t.assignees.some(a => a.id === memberId)).length;

  const getCompletedCount = (memberId: string) =>
    tasks.filter(t => t.assignees.some(a => a.id === memberId) && t.status === 'done').length;

  return (
    <div className="space-y-6">
      {/* Team Members */}
      <div>
        <h3 className="text-sm font-semibold text-[#E9E7F2] flex items-center gap-2">
          <Users size={16} className="text-purple-400" />
          Team Members
          <span className="ml-auto text-xs text-[#626276]">{teamMembers.length}</span>
        </h3>
        <div className="mt-3 space-y-2">
          {teamMembers.map(member => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-2 rounded-xl bg-[#1A1A25] border border-[#242431] hover:border-[#303041] transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                {member.name?.[0] || member.email[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[#F5F3FF] truncate">
                  {member.name || member.email}
                </div>
                <div className="text-xs text-[#8E8EA3]">
                  {getAssignedCount(member.id)} assigned · {getCompletedCount(member.id)} done
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Task Summary */}
      <div className="border-t border-[#242431] pt-4">
        <h3 className="text-sm font-semibold text-[#E9E7F2] flex items-center gap-2">
          <CheckCircle size={16} className="text-purple-400" />
          Task Summary
        </h3>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div className="bg-[#1A1A25] rounded-xl p-3 text-center border border-[#242431]">
            <p className="text-2xl font-bold text-purple-400">
              {tasks.filter(t => t.status !== 'done').length}
            </p>
            <p className="text-xs text-[#8E8EA3]">Active</p>
          </div>
          <div className="bg-[#1A1A25] rounded-xl p-3 text-center border border-[#242431]">
            <p className="text-2xl font-bold text-emerald-400">
              {tasks.filter(t => t.status === 'done').length}
            </p>
            <p className="text-xs text-[#8E8EA3]">Done</p>
          </div>
        </div>
      </div>
    </div>
  );
}