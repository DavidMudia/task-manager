import { Link } from 'react-router-dom';
import {
  MessageCircle,
} from 'lucide-react';

interface ConversationListProps {
  conversations: any[];
  activeConversationId?: string;
}

export function ConversationList({
  conversations,
  activeConversationId,
}: ConversationListProps) {
  if (!conversations.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
          <MessageCircle size={22} />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-white">
          No conversations yet
        </h3>

        <p className="mt-2 text-xs leading-5 text-[#6F6E82]">
          Find someone on TaskFlow and start a private conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2">
      {conversations.map(
        (conversation) => {
          const participant =
            conversation.participant;

          const lastMessage =
            conversation.lastMessage;

          const unreadCount =
            conversation.unreadCount || 0;

          const isUnread =
            unreadCount > 0;

          const isActive =
            conversation.id ===
            activeConversationId;

          if (!participant) {
            return null;
          }

          return (
            <Link
              key={conversation.id}
              to={`/inbox/${conversation.id}`}
              className={`flex items-center gap-3 rounded-xl p-3 transition ${
                isActive
                  ? 'bg-purple-500/10 ring-1 ring-purple-500/20'
                  : isUnread
                    ? 'bg-purple-500/[0.06] hover:bg-purple-500/[0.10]'
                    : 'hover:bg-white/[0.04]'
              }`}
            >
              {/* Avatar */}

              <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-bold text-white">
                {participant.avatarUrl ? (
                  <img
                    src={
                      participant.avatarUrl
                    }
                    alt={
                      participant.name ||
                      participant.username ||
                      'User'
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  participant.name?.[0] ||
                  participant.username?.[0] ||
                  'U'
                )}

                {/* Unread dot */}

                {isUnread && (
                  <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-[#11111A] bg-purple-500" />
                )}
              </div>

              {/* Conversation info */}

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`truncate text-sm ${
                      isUnread
                        ? 'font-bold text-white'
                        : 'font-semibold text-[#D8D5E4]'
                    }`}
                  >
                    {participant.name ||
                      participant.username}
                  </p>

                  {conversation.updatedAt && (
                    <span
                      className={`flex-shrink-0 text-[10px] ${
                        isUnread
                          ? 'font-semibold text-purple-300'
                          : 'text-[#5F5E72]'
                      }`}
                    >
                      {new Date(
                        conversation.updatedAt
                      ).toLocaleDateString(
                        [],
                        {
                          month: 'short',
                          day: 'numeric',
                        }
                      )}
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <p
                    className={`min-w-0 flex-1 truncate text-xs ${
                      isUnread
                        ? 'font-medium text-[#B8B4CC]'
                        : 'text-[#68677B]'
                    }`}
                  >
                    {isUnread
                      ? `New message${
                          lastMessage?.senderId
                            ? ''
                            : ''
                        }`
                      : lastMessage?.content ||
                        'Start a conversation'}
                  </p>

                  {/* Unread count */}

                  {isUnread && (
                    <span className="flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 px-1.5 text-[10px] font-bold text-white">
                      {unreadCount > 99
                        ? '99+'
                        : unreadCount}
                    </span>
                  )}
                </div>

                {/* Show sender */}

                {isUnread && (
                  <p className="mt-1 truncate text-[10px] font-medium text-purple-300">
                    New message from{' '}
                    {participant.name ||
                      participant.username}
                  </p>
                )}
              </div>
            </Link>
          );
        }
      )}
    </div>
  );
}