import { useState } from 'react';
import {
  X,
  Loader2,
} from 'lucide-react';

import type {
  ColumnId,
  Priority,
} from '../Types';

// ============================================================
// PROJECT MEMBER TYPE
// ============================================================

interface ProjectMember {
  id: string;
  userId: string;
  role: string;
  joinedAt?: string;
  user: {
    id: string;
    username?: string;
    name?: string;
    email: string;
    avatarUrl?: string | null;
  };
}

interface TaskModalProps {
  columnId: ColumnId;
  teamMembers: ProjectMember[];
  onClose: () => void;
  onSubmit: (task: any) => void;
  isSubmitting?: boolean;
}

export function TaskModal({
  columnId,
  teamMembers,
  onClose,
  onSubmit,
  isSubmitting = false,
}: TaskModalProps) {
  const [title, setTitle] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [priority, setPriority] =
    useState<Priority>('medium');

  const [dueDate, setDueDate] =
    useState('');

  const [assigneeIds, setAssigneeIds] =
    useState<string[]>([]);

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate
        ? new Date(
            `${dueDate}T00:00:00.000Z`
          ).toISOString()
        : null,
      assigneeIds,
      status: columnId,
    });
  };

  // ============================================================
  // ASSIGNEES
  // ============================================================

  const handleAssigneeToggle = (
    userId: string
  ) => {
    setAssigneeIds(prev =>
      prev.includes(userId)
        ? prev.filter(
            id => id !== userId
          )
        : [...prev, userId]
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#242431] bg-[#11111A] shadow-2xl"
        onClick={e =>
          e.stopPropagation()
        }
      >

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-[#242431] px-6 py-4">

          <h2 className="text-lg font-bold text-[#F5F3FF]">
            Create New Task
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-[#8E8EA3] transition-all hover:bg-[#242431] hover:text-[#F5F3FF] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X size={20} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6"
        >

          {/* TITLE */}

          <div>
            <label className="mb-1 block text-sm font-medium text-[#E9E7F2]">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={e =>
                setTitle(e.target.value)
              }
              disabled={isSubmitting}
              className="w-full rounded-xl border border-[#242431] bg-[#1A1A25] px-4 py-2 text-[#F5F3FF] outline-none transition-all placeholder:text-[#626276] focus:border-purple-500/30 focus:ring-2 focus:ring-purple-500/30 disabled:opacity-50"
              placeholder="Task title..."
              required
              autoFocus
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-1 block text-sm font-medium text-[#E9E7F2]">
              Description
            </label>

            <textarea
              value={description}
              onChange={e =>
                setDescription(
                  e.target.value
                )
              }
              disabled={isSubmitting}
              rows={3}
              className="w-full resize-none rounded-xl border border-[#242431] bg-[#1A1A25] px-4 py-2 text-[#F5F3FF] outline-none transition-all placeholder:text-[#626276] focus:border-purple-500/30 focus:ring-2 focus:ring-purple-500/30 disabled:opacity-50"
              placeholder="Task description..."
            />
          </div>

          {/* PRIORITY / DATE */}

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="mb-1 block text-sm font-medium text-[#E9E7F2]">
                Priority
              </label>

              <select
                value={priority}
                onChange={e =>
                  setPriority(
                    e.target
                      .value as Priority
                  )
                }
                disabled={isSubmitting}
                className="w-full rounded-xl border border-[#242431] bg-[#1A1A25] px-4 py-2 text-[#F5F3FF] outline-none disabled:opacity-50"
              >
                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>

                <option value="urgent">
                  Urgent
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#E9E7F2]">
                Due Date
              </label>

              <input
                type="date"
                value={dueDate}
                onChange={e =>
                  setDueDate(
                    e.target.value
                  )
                }
                disabled={isSubmitting}
                className="w-full rounded-xl border border-[#242431] bg-[#1A1A25] px-4 py-2 text-[#F5F3FF] outline-none disabled:opacity-50"
              />
            </div>

          </div>

          {/* ====================================================
              PROJECT MEMBERS ONLY
          ==================================================== */}

          <div>

            <label className="mb-1 block text-sm font-medium text-[#E9E7F2]">
              Assignees
            </label>

            <div className="flex min-h-12 flex-wrap gap-2 rounded-xl border border-[#242431] bg-[#1A1A25] p-3">

              {teamMembers.map(
                member => {

                  const userId =
                    member.user.id;

                  const displayName =
                    member.user.name ||
                    member.user.username ||
                    member.user.email;

                  const isSelected =
                    assigneeIds.includes(
                      userId
                    );

                  return (
                    <button
                      key={userId}
                      type="button"
                      disabled={
                        isSubmitting
                      }
                      onClick={() =>
                        handleAssigneeToggle(
                          userId
                        )
                      }
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                          : 'bg-[#242431] text-[#E9E7F2] hover:bg-[#2B2B3B]'
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {displayName}
                    </button>
                  );
                }
              )}

              {teamMembers.length ===
                0 && (
                <span className="text-sm text-[#626276]">
                  No project members available.
                </span>
              )}

            </div>

            <p className="mt-1 text-xs text-[#626276]">
              Only members of this project can be assigned.
            </p>

          </div>

          {/* ACTIONS */}

          <div className="flex justify-end gap-3 border-t border-[#242431] pt-4">

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-[#242431] px-4 py-2 text-sm font-medium text-[#8E8EA3] transition-all hover:bg-[#242431] hover:text-[#F5F3FF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                !title.trim()
              }
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:from-purple-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {isSubmitting && (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              )}

              {isSubmitting
                ? 'Creating…'
                : 'Create Task'}

            </button>

          </div>

        </form>
      </div>
    </div>
  );
}