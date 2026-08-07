import type { Activity } from '../Types';

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center text-[#8E8EA3] text-sm py-8">
        No activity yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const user = activity.user;
        return (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-[10px] flex-shrink-0">
              {user?.name?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm">
                <span className="font-medium text-[#E9E7F2]">
                  {user?.name || user?.email || 'Unknown'}
                </span>
                <span className="text-[#8E8EA3]"> {activity.message}</span>
                {activity.task && (
                  <span className="font-medium text-[#E9E7F2]"> {activity.task.title}</span>
                )}
              </div>
              <div className="text-xs text-[#626276]">
                {new Date(activity.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}