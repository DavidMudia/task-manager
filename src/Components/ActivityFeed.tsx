import { Clock, MessageSquare, ArrowRight, UserPlus, CheckCircle, PlusCircle } from 'lucide-react';
import type { Activity, TeamMember } from '../Types';

interface ActivityFeedProps {
  activities: Activity[];
  getMember: (id: string | null) => TeamMember | null;
}

const TYPE_ICONS = {
  create: PlusCircle,
  move: ArrowRight,
  assign: UserPlus,
  comment: MessageSquare,
  complete: CheckCircle,
};

const TYPE_COLORS = {
  create: 'text-green-500 bg-green-50',
  move: 'text-blue-500 bg-blue-50',
  assign: 'text-purple-500 bg-purple-50',
  comment: 'text-amber-500 bg-amber-50',
  complete: 'text-emerald-500 bg-emerald-50',
};

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function ActivityFeed({ activities, getMember }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock className="text-gray-300 mb-3" size={32} />
        <p className="text-sm text-gray-400 font-medium">No activity yet</p>
        <p className="text-xs text-gray-300 mt-1">Actions will appear here in real-time</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.slice(0, 20).map((activity, index) => {
        const member = getMember(activity.userId);
        const Icon = TYPE_ICONS[activity.type];
        const colorClass = TYPE_COLORS[activity.type];

        return (
          <div
            key={activity.id}
            className={`flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 ${index === 0 ? 'animate-slide-in' : ''
              }`}
          >
            <div className={`p-1.5 rounded-lg flex-shrink-0 ${colorClass}`}>
              <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-700 leading-relaxed">
                <span className="font-semibold" style={{ color: member?.color }}>
                  {member?.name || 'Unknown'}
                </span>{' '}
                {activity.action}{' '}
                <span className="font-semibold text-gray-800">"{activity.taskTitle}"</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{timeAgo(activity.timestamp)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}