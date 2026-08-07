import {
  MessageCircle,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface UserCardProps {
  user: any;
}

export function UserCard({
  user,
}: UserCardProps) {
  const navigate = useNavigate();

  const messageUser = async () => {
    try {
      const response =
        await api.post(
          '/chat/conversations',
          {
            userId: user.id,
          }
        );

      navigate(
        `/inbox/${response.data.id}`
      );
    } catch (error) {
      console.error(
        'Failed to start conversation:',
        error
      );
    }
  };

  return (
    <div className="rounded-2xl border border-[#29293A] bg-[#11111A] p-4 transition hover:border-purple-500/20">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-bold text-white">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            user.name?.[0] ||
            user.username?.[0] ||
            'U'
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {user.name ||
              user.username}
          </p>

          <p className="truncate text-xs text-[#68677B]">
            @{user.username}
          </p>
        </div>
      </div>

      {user.bio && (
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#77768A]">
          {user.bio}
        </p>
      )}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() =>
            navigate(
              `/users/${user.id}`
            )
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#343348] py-2 text-xs font-medium text-[#B4B1C1] hover:bg-white/5"
        >
          <User size={14} />
          Profile
        </button>

        <button
          type="button"
          onClick={messageUser}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 py-2 text-xs font-semibold text-white hover:bg-purple-500"
        >
          <MessageCircle size={14} />
          Message
        </button>
      </div>
    </div>
  );
}