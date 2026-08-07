import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';
import type { Task, ColumnId } from '../Types';

interface ColumnProps {
  id: ColumnId;
  title: string;
  color: string;
  icon: string;
  tasks: Task[];
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (columnId: ColumnId) => void;
}

export function Column({
  id,
  title,
  icon,
  tasks,
  onToggleSubtask,
  onDeleteTask,
  onAddTask,
}: ColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="w-full sm:w-auto lg:w-72 flex-shrink-0 bg-[#11111A] rounded-2xl p-3 flex flex-col max-h-full shadow-lg border border-[#242431]"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm flex-shrink-0">{icon}</span>
          <h3 className="font-semibold text-[#E9E7F2] truncate text-sm">{title}</h3>
          <span className="text-xs font-medium text-[#626276] flex-shrink-0">{tasks.length}</span>
        </div>
        <button
          onClick={() => onAddTask(id)}
          className="p-1 rounded-lg text-[#8E8EA3] hover:bg-white/10 hover:text-purple-400 transition-all flex-shrink-0"
        >
          <Plus size={16} />
        </button>
      </div>

      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-2 overflow-y-auto">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleSubtask={onToggleSubtask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}