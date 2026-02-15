import React, { useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import type { Task, ColumnId, TeamMember } from '../Types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  id: ColumnId;
  title: string;
  color: string;
  icon: string;
  tasks: Task[];
  getMember: (id: string | null) => TeamMember | null;
  onMoveTask: (taskId: string, targetColumn: ColumnId) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (columnId: ColumnId) => void;
}

export function Column({ id, title, color, icon, tasks, getMember, onMoveTask, onToggleSubtask, onDeleteTask, onAddTask }: ColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onMoveTask(taskId, id);
    }
  };

  return (
    <div
      className={`flex flex-col min-w-[300px] max-w-[340px] w-full rounded-2xl transition-all duration-200 ${isDragOver ? 'bg-indigo-50/70 ring-2 ring-indigo-300 ring-inset' : 'bg-gray-50/80'
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{icon}</span>
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{title}</h2>
          <span
            className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddTask(id)}
            className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-gray-400 hover:text-indigo-600 transition-all"
          >
            <Plus size={16} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-gray-400 hover:text-gray-600 transition-all">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 px-3 pb-3 space-y-2.5 overflow-y-auto max-h-[calc(100vh-240px)] scrollbar-thin">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            assignee={getMember(task.assigneeId)}
            onToggleSubtask={onToggleSubtask}
            onDelete={onDeleteTask}
          />
        ))}
        {tasks.length === 0 && (
          <div className={`flex flex-col items-center justify-center py-12 rounded-xl border-2 border-dashed transition-colors ${isDragOver ? 'border-indigo-300 bg-indigo-50/50' : 'border-gray-200'}`}>
            <p className="text-sm text-gray-400 font-medium">Drop tasks here</p>
            <button
              onClick={() => onAddTask(id)}
              className="mt-2 text-xs text-indigo-500 hover:text-indigo-700 font-semibold transition-colors"
            >
              + Add a task
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
