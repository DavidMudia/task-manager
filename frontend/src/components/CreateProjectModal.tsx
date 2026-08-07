import { useState } from 'react';
import { useCreateProject } from '../hooks/useProjects';
import { X, AlertCircle } from 'lucide-react';

export function CreateProjectModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState(20);
  const [error, setError] = useState<string | null>(null);

  const createProject = useCreateProject();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Project name is required.');
      return;
    }

    try {
      await createProject.mutateAsync({
        name: trimmedName,
        description: description.trim() || undefined,
        maxMembers: Number(maxMembers) || 20,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.message ||
        'Failed to create project.';

      setError(message);

      console.error(
        'Project creation error:',
        err
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-[#242431] bg-[#11111A] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#242431] px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-[#F5F3FF]">
              Create Project
            </h2>

            <p className="mt-1 text-xs text-[#717184]">
              Set up a workspace for your team.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#8E8EA3] transition-colors hover:bg-[#242431] hover:text-[#F5F3FF]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            <AlertCircle
              size={18}
              className="mt-0.5 flex-shrink-0"
            />

            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {/* Project Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#E9E7F2]">
              Project Name{' '}
              <span className="text-red-400">*</span>
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full rounded-xl border border-[#242431] bg-[#1A1A25] px-3 py-2.5 text-sm text-[#F5F3FF] outline-none transition-all placeholder:text-[#626276] focus:border-purple-500/30 focus:ring-2 focus:ring-purple-500/30"
              placeholder="e.g. Website Redesign"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#E9E7F2]">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={3}
              className="w-full resize-none rounded-xl border border-[#242431] bg-[#1A1A25] px-3 py-2.5 text-sm text-[#F5F3FF] outline-none transition-all placeholder:text-[#626276] focus:border-purple-500/30 focus:ring-2 focus:ring-purple-500/30"
              placeholder="What is this project about?"
            />
          </div>

          {/* Max Members */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#E9E7F2]">
              Max Members
            </label>

            <input
              type="number"
              min={1}
              max={20}
              value={maxMembers}
              onChange={(e) => {
                const value =
                  Number(e.target.value);

                setMaxMembers(
                  Math.min(
                    20,
                    Math.max(
                      1,
                      value || 1
                    )
                  )
                );
              }}
              className="w-full rounded-xl border border-[#242431] bg-[#1A1A25] px-3 py-2.5 text-sm text-[#F5F3FF] outline-none transition-all focus:border-purple-500/30 focus:ring-2 focus:ring-purple-500/30"
            />

            <p className="mt-1 text-xs text-[#626276]">
              Maximum of 20 people can belong to this project.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-[#242431] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-[#242431] px-4 py-2.5 text-sm font-medium text-[#8E8EA3] transition-colors hover:bg-[#242431] hover:text-[#F5F3FF]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createProject.isPending}
              className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-purple-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createProject.isPending
                ? 'Creating…'
                : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}