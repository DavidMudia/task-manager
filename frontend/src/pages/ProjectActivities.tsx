import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Activity } from 'lucide-react';

interface Activity {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
  task?: {
    id: string;
    title: string;
  };
}

// Simple relative time formatter
function timeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function ProjectActivities() {
  const { projectId } = useParams<{ projectId: string }>();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activities', projectId],
    queryFn: async () => {
      const { data } = await api.get<Activity[]>(`/projects/${projectId}/activities`);
      return data;
    },
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#8E8EA3]">
        Loading activities...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#09090F] p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />
            <span className="text-xs font-medium uppercase tracking-widest text-purple-400">
              Activity
            </span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#F5F3FF]">Activity Feed</h2>
          <p className="text-sm text-[#8E8EA3] mt-1">
            Recent actions in this project
          </p>
        </div>

        {activities.length === 0 ? (
          <div className="rounded-2xl border border-[#242431] bg-[#11111A] p-8 text-center shadow-lg">
            <Activity size={32} className="text-[#2B2B3B] mx-auto mb-3" />
            <p className="text-[#B7B5C4] font-medium">No activity yet</p>
            <p className="text-[#717184] text-sm mt-1">
              Actions will appear here when they happen.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-2xl border border-[#242431] bg-[#11111A] p-4 shadow-lg flex items-start gap-3 transition hover:border-[#303041]"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                  {activity.user.name?.[0] || activity.user.email[0] || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">
                    <span className="font-medium text-[#E9E7F2]">
                      {activity.user.name || activity.user.email}
                    </span>
                    <span className="text-[#8E8EA3]"> {activity.message}</span>
                  </div>
                  <div className="text-xs text-[#626276] mt-1">
                    {timeAgo(new Date(activity.createdAt))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}