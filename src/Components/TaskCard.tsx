import React, { useState } from 'react';
import { Calendar, MessageSquare, Paperclip, GripVertical, CheckCircle2, Circle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { Task, TeamMember } from '../Types';

interface TaskCardProps {
  task: Task;
  assignee: TeamMember | null;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDelete: (taskId: string) => void;
}

const PRIORITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Low' },
  medium: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Medium' },
  high: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'High' },
  urgent: { bg: 'bg-red-100', text: 'text-red-700', label: 'Urgent' },
};

const TAG_COLORS: Record<string, string> = {
  design: 'bg-purple-100 text-purple-700',
  ux: 'bg-pink-100 text-pink-700',
  backend: 'bg-emerald-100 text-emerald-700',
  frontend: 'bg-sky-100 text-sky-700',
  security: 'bg-red-100 text-red-700',
  devops: 'bg-amber-100 text-amber-700',
  docs: 'bg-gray-100 text-gray-600',
  performance: 'bg-orange-100 text-orange-700',
  bug: 'bg-rose-100 text-rose-700',
  research: 'bg-teal-100 text-teal-700',
  analytics: 'bg-indigo-100 text-indigo-700',
  'design-system': 'bg-violet-100 text-violet-700',
};

export function TaskCard({ task, assignee, onToggleSubtask, onDelete }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const priority = PRIORITY_STYLES[task.priority];
  const completedSubtasks = task.subtasks.filter(s => s.done).length;
  const totalSubtasks = task.subtasks.length;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => setIsDragging(false);

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`group relative rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-gray-200 ${isDragging ? 'opacity-50 rotate-2 scale-95' : ''}`}
    >
      {/* Drag Handle */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button onClick={() => onDelete(task.id)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
          <Trash2 size={14} />
        </button>
        <div className="p-1 text-gray-300">
          <GripVertical size={14} />
        </div>
      </div>

      {/* Priority & Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${priority.bg} ${priority.text}`}>
          {priority.label}
        </span>
        {task.tags.map(tag => (
          <span key={tag} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${TAG_COLORS[tag] || 'bg-gray-100 text-gray-600'}`}>
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 mb-1.5 pr-8 leading-snug">{task.title}</h3>

      {/* Description preview */}
      {task.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      {/* Subtask Progress */}
      {totalSubtasks > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500 font-medium">
              {completedSubtasks}/{totalSubtasks} subtasks
            </span>
            <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-600 transition-colors">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {expanded && (
            <div className="mt-2 space-y-1.5">
              {task.subtasks.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => onToggleSubtask(task.id, sub.id)}
                  className="flex items-center gap-2 w-full text-left group/sub"
                >
                  {sub.done ? (
                    <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle size={14} className="text-gray-300 group-hover/sub:text-indigo-400 flex-shrink-0 transition-colors" />
                  )}
                  <span className={`text-xs ${sub.done ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                    {sub.text}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <span className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
              <Calendar size={12} />
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
          {task.comments > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <MessageSquare size={12} />
              {task.comments}
            </span>
          )}
          {task.attachments > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Paperclip size={12} />
              {task.attachments}
            </span>
          )}
        </div>
        {assignee && (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ring-2 ring-white"
            style={{ backgroundColor: assignee.color }}
            title={assignee.name}
          >
            {assignee.avatar}
          </div>
        )}
      </div>
    </div>
  );
}