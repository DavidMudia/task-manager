import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Check, Trash2, MessageSquare, Paperclip, Calendar } from 'lucide-react';
import type { Task } from '../Types';

interface TaskCardProps {
  task: Task;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskCard({ task, onToggleSubtask, onDeleteTask }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    low: 'bg-[#1A1A25] text-[#8E8EA3]',
    medium: 'bg-[#1A1A25] text-[#B7B5C4]',
    high: 'bg-orange-500/20 text-orange-400',
    urgent: 'bg-red-500/20 text-red-400',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[#1A1A25] rounded-xl p-3 shadow-sm border border-[#242431] hover:border-[#303041] transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-2">
        <div {...attributes} {...listeners} className="mt-0.5 text-[#626276] hover:text-[#8E8EA3] cursor-grab">
          <GripVertical size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium text-[#E9E7F2] line-clamp-1">{task.title}</h4>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="text-[#626276] hover:text-red-400 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {task.description && (
            <p className="text-xs text-[#8E8EA3] line-clamp-2 mt-0.5">{task.description}</p>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>

            {task.tags?.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-[#1A1A25] text-[#8E8EA3] text-xs border border-[#242431]">
                {tag}
              </span>
            ))}

            {task.assignees.length > 0 && (
              <div className="flex -space-x-1">
                {task.assignees.slice(0, 3).map(assignee => (
                  <div
                    key={assignee.id}
                    className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-[8px] font-bold ring-1 ring-[#11111A]"
                    title={assignee.name || assignee.email}
                  >
                    {assignee.name?.[0] || assignee.email[0] || 'U'}
                  </div>
                ))}
                {task.assignees.length > 3 && (
                  <div className="w-5 h-5 rounded-full bg-[#2B2B3B] flex items-center justify-center text-[8px] font-bold text-[#8E8EA3] ring-1 ring-[#11111A]">
                    +{task.assignees.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>

          {task.subtasks && task.subtasks.length > 0 && (
            <div className="mt-2 space-y-1">
              {task.subtasks.map(sub => (
                <div key={sub.id} className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => onToggleSubtask(task.id, sub.id)}
                    className={`w-3 h-3 rounded border flex items-center justify-center transition-all ${
                      sub.done ? 'bg-green-500 border-green-500' : 'border-[#242431] hover:border-green-500'
                    }`}
                  >
                    {sub.done && <Check size={8} className="text-white" />}
                  </button>
                  <span className={sub.done ? 'line-through text-[#626276]' : 'text-[#B7B5C4]'}>
                    {sub.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 mt-2 text-xs text-[#626276]">
            {task.dueDate && (
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {task.comments !== undefined && task.comments > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare size={12} />
                {task.comments}
              </span>
            )}
            {task.attachments !== undefined && task.attachments > 0 && (
              <span className="flex items-center gap-1">
                <Paperclip size={12} />
                {task.attachments}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}