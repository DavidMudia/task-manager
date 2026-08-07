import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 bg-[#11111A] border border-[#242431] text-[#F5F3FF] rounded-xl shadow-2xl max-w-sm animate-slide-up">
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-[#8E8EA3] hover:text-[#F5F3FF] transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}