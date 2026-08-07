interface ProjectCardProps {
  project: { id: string; name: string; description?: string; color?: string };
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-[#FDF6E3] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-amber-100/30 hover:border-amber-200/50"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-stone-800 truncate">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-stone-500 mt-1 line-clamp-2">{project.description}</p>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 ml-3 ring-2 ring-amber-100/50"
          style={{ backgroundColor: project.color || '#8b5cf6' }}
        />
      </div>
      <div className="mt-4 text-xs text-stone-400">Click to open</div>
    </div>
  );
}