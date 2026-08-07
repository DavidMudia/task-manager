import { useParams } from 'react-router-dom';
import {
  useMemo,
  useState,
} from 'react';

import {
  useTasks,
  useDeleteTask,
  useCreateTask,
  useMoveTask,
} from '../hooks/useTasks';

import { useProjectMembers } from '../hooks/useProjectMembers';

import { Column } from '../components/Column';
import { TaskModal } from '../components/TaskModal';

import type {
  ColumnId,
  Column as ColumnType,
} from '../Types';

import {
  Plus,
  Loader2,
} from 'lucide-react';

import {
  DndContext,
  closestCorners,
  type DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';

const COLUMNS: ColumnType[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: '#94a3b8',
    icon: '📋',
  },
  {
    id: 'todo',
    title: 'To Do',
    color: '#6366f1',
    icon: '📌',
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: '#f59e0b',
    icon: '🔨',
  },
  {
    id: 'review',
    title: 'Review',
    color: '#8b5cf6',
    icon: '🔍',
  },
  {
    id: 'done',
    title: 'Done',
    color: '#10b981',
    icon: '✅',
  },
];

export function ProjectBoard() {
  const { projectId } = useParams<{
    projectId: string;
  }>();

  const {
    data: tasks = [],
    isLoading,
    error,
    refetch: refetchTasks,
  } = useTasks(projectId);

  const {
    data: projectMembers = [],
  } = useProjectMembers(projectId);

  const deleteTask = useDeleteTask();
  const createTask = useCreateTask();
  const moveTask = useMoveTask();

  const [showModal, setShowModal] =
    useState(false);

  const [modalColumnId, setModalColumnId] =
    useState<ColumnId>('todo');

  const [creatingTask, setCreatingTask] =
    useState(false);

  const [movingTask, setMovingTask] =
    useState(false);

  // ============================================================
  // DRAG SENSORS
  // ============================================================

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // ============================================================
  // GROUP TASKS
  // ============================================================

  const tasksByColumn = useMemo(() => {
    const grouped: Record<
      ColumnId,
      typeof tasks
    > = {
      backlog: [],
      todo: [],
      'in-progress': [],
      review: [],
      done: [],
    };

    tasks.forEach((task) => {
      const status =
        task.status as ColumnId;

      if (grouped[status]) {
        grouped[status].push(task);
      }
    });

    return grouped;
  }, [tasks]);

  const totalTasks = tasks.length;

  // ============================================================
  // ADD TASK
  // ============================================================

  const handleAddTask = (
    columnId: ColumnId
  ) => {
    setModalColumnId(columnId);
    setShowModal(true);
  };

  // ============================================================
  // CREATE TASK
  // ============================================================

  const handleCreateTask = async (
    taskData: any
  ) => {
    if (!projectId) {
      console.error(
        'Cannot create task: projectId is missing'
      );
      return;
    }

    try {
      setCreatingTask(true);

      await createTask.mutateAsync({
        ...taskData,
        projectId,
      });

      await refetchTasks();

      setShowModal(false);
    } catch (error) {
      console.error(
        'Failed to create task:',
        error
      );
    } finally {
      setCreatingTask(false);
    }
  };

  // ============================================================
  // DELETE TASK
  // ============================================================

  const handleDeleteTask = async (
    taskId: string
  ) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this task? This action cannot be undone.'
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTask.mutateAsync(
        taskId
      );

      await refetchTasks();
    } catch (error) {
      console.error(
        'Failed to delete task:',
        error
      );
    }
  };

  // ============================================================
  // DRAG AND DROP
  // ============================================================

  const handleDragEnd = async (
    event: DragEndEvent
  ) => {
    const {
      active,
      over,
    } = event;

    if (!over) {
      return;
    }

    const taskId =
      active.id as string;

    const destinationColumn =
      over.id as ColumnId;

    const task = tasks.find(
      currentTask =>
        currentTask.id === taskId
    );

    if (!task) {
      return;
    }

    if (
      task.status ===
      destinationColumn
    ) {
      return;
    }

    const destination =
      COLUMNS.find(
        column =>
          column.id ===
          destinationColumn
      );

    const source =
      COLUMNS.find(
        column =>
          column.id ===
          task.status
      );

    // ==========================================================
    // CONFIRM EVERY MOVE
    // ==========================================================

    const confirmed =
      window.confirm(
        `Are you sure you want to move "${task.title}" from ${
          source?.title ||
          task.status
        } to ${
          destination?.title ||
          destinationColumn
        }?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setMovingTask(true);

      await moveTask.mutateAsync({
        id: taskId,
        status: destinationColumn,
      });

      await refetchTasks();
    } catch (error) {
      console.error(
        'Failed to move task:',
        error
      );
    } finally {
      setMovingTask(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-[#09090F]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />

        <p className="mt-2 text-sm text-[#8E8EA3]">
          Loading tasks…
        </p>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-[#09090F] p-6">
        <p className="text-sm text-red-400">
          Failed to load tasks.
        </p>

        <button
          type="button"
          onClick={() =>
            refetchTasks()
          }
          className="mt-4 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#09090F]">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#242431] bg-[#11111A] px-4 py-3 shadow-sm">

        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-[#F5F3FF] md:text-lg">
            Board
          </h2>

          <span className="text-xs text-[#717184]">
            ·
          </span>

          <span className="text-xs text-[#8E8EA3] md:text-sm">
            {totalTasks}{' '}
            {totalTasks === 1
              ? 'task'
              : 'tasks'}
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            handleAddTask('todo')
          }
          disabled={creatingTask}
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm shadow-purple-900/30 transition-all hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50 md:px-4 md:py-2 md:text-sm"
        >
          <Plus size={16} />

          <span className="hidden sm:inline">
            New Task
          </span>
        </button>
      </div>

      {/* ========================================================
          BOARD
          
          Mobile:
          - Horizontal scrolling
          - One status column visible at a time
          - Snap scrolling
          - Clear status separation

          Desktop:
          - Normal horizontal Kanban layout
      ======================================================== */}

      <DndContext
        sensors={sensors}
        collisionDetection={
          closestCorners
        }
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4">

          <div
            className="
              flex
              h-full
              min-h-full
              snap-x
              snap-mandatory
              gap-3
              overflow-x-auto
              overflow-y-hidden
              pb-2

              sm:grid
              sm:grid-cols-2
              sm:items-start
              sm:gap-4
              sm:overflow-x-visible
              sm:overflow-y-visible

              lg:flex
              lg:flex-nowrap
              lg:gap-4
            "
          >

            {COLUMNS.map((column) => (
              <div
                key={column.id}
                className="
                  min-w-[calc(100vw-1.5rem)]
                  snap-center
                  rounded-2xl
                  border
                  border-[#242431]
                  bg-[#0D0D15]
                  p-2
                  shadow-lg
                  
                  sm:min-w-0
                  sm:p-0
                  sm:border-0
                  sm:bg-transparent
                  sm:shadow-none

                  lg:w-[300px]
                  lg:flex-shrink-0
                "
              >

                {/* Mobile status indicator */}
                <div
                  className="mb-2 flex items-center justify-between rounded-xl px-3 py-2 sm:hidden"
                  style={{
                    backgroundColor:
                      `${column.color}12`,
                    border:
                      `1px solid ${column.color}30`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {column.icon}
                    </span>

                    <span
                      className="text-sm font-semibold"
                      style={{
                        color:
                          column.color,
                      }}
                    >
                      {column.title}
                    </span>
                  </div>

                  <span className="rounded-full bg-[#1A1A25] px-2 py-0.5 text-xs text-[#8E8EA3]">
                    {tasksByColumn[
                      column.id
                    ].length}
                  </span>
                </div>

                <Column
                  id={column.id}
                  title={column.title}
                  color={column.color}
                  icon={column.icon}
                  tasks={
                    tasksByColumn[
                      column.id
                    ]
                  }
                  onToggleSubtask={() => {}}
                  onDeleteTask={
                    handleDeleteTask
                  }
                  onAddTask={
                    handleAddTask
                  }
                />
              </div>
            ))}

          </div>

          {/* Mobile swipe hint */}
          <div className="mt-2 flex justify-center sm:hidden">
            <p className="text-[11px] text-[#626276]">
              Swipe left or right to view other statuses
            </p>
          </div>

        </div>
      </DndContext>

      {/* ========================================================
          MOVING INDICATOR
      ======================================================== */}

      {movingTask && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-[#343443] bg-[#11111A] px-4 py-2 text-sm text-[#E9E7F2] shadow-2xl">
          Moving task…
        </div>
      )}

      {/* ========================================================
          CREATE TASK MODAL
      ======================================================== */}

      {showModal && (
        <TaskModal
          columnId={modalColumnId}
          teamMembers={projectMembers}
          onClose={() => {
            if (!creatingTask) {
              setShowModal(false);
            }
          }}
          onSubmit={
            handleCreateTask
          }
          isSubmitting={
            creatingTask
          }
        />
      )}

    </div>
  );
}