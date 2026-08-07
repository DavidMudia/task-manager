import { Link } from 'react-router-dom';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    createdAt: string | Date;
    sender?: {
      id: string;
      username: string;
      name?: string | null;
      avatarUrl?: string | null;
    };
  };

  currentUserId?: string;

  onDelete?: (
    messageId: string
  ) => Promise<void>;
}

export function MessageBubble({
  message,
  currentUserId,
  onDelete,
}: MessageBubbleProps) {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const isOwnMessage =
    message.sender?.id === currentUserId;

  const senderName =
    message.sender?.name ||
    message.sender?.username ||
    'User';

  const avatarLetter =
    senderName[0]?.toUpperCase() || 'U';

  const handleDelete = async () => {
    if (!onDelete || deleting) {
      return;
    }

    try {
      setDeleting(true);
      setMenuOpen(false);

      await onDelete(message.id);
    } catch (error) {
      console.error(
        'Failed to delete message:',
        error
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={`flex w-full gap-3 ${
        isOwnMessage
          ? 'justify-end'
          : 'justify-start'
      }`}
    >

      {/* =====================================================
          OTHER USER AVATAR
      ====================================================== */}

      {!isOwnMessage && (
        <Link
          to={`/users/${message.sender?.id}`}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-xs font-bold text-white"
        >
          {message.sender?.avatarUrl ? (
            <img
              src={message.sender.avatarUrl}
              alt={senderName}
              className="h-full w-full object-cover"
            />
          ) : (
            avatarLetter
          )}
        </Link>
      )}

      {/* =====================================================
          MESSAGE CONTENT
      ====================================================== */}

      <div
        className={`group relative flex max-w-[75%] flex-col ${
          isOwnMessage
            ? 'items-end'
            : 'items-start'
        }`}
      >

        {/* Sender name */}

        {!isOwnMessage && (
          <span className="mb-1 px-1 text-[11px] font-medium text-[#77768A]">
            {senderName}
          </span>
        )}

        <div className="relative">

          {/* Message */}

          <div
            className={`rounded-2xl px-4 py-2.5 text-sm leading-5 ${
              isOwnMessage
                ? 'rounded-br-md bg-purple-600 text-white'
                : 'rounded-bl-md border border-[#29293A] bg-[#15151F] text-[#D8D5E4]'
            } ${
              deleting
                ? 'opacity-50'
                : ''
            }`}
          >
            {message.content}
          </div>

          {/* =================================================
              MESSAGE MENU
          ================================================== */}

          {isOwnMessage &&
            onDelete && (
              <div className="absolute -right-9 top-1/2 -translate-y-1/2">

                <button
                  type="button"
                  onClick={() =>
                    setMenuOpen(
                      !menuOpen
                    )
                  }
                  disabled={deleting}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[#555467] opacity-0 transition hover:bg-white/5 hover:text-white group-hover:opacity-100"
                  aria-label="Message options"
                >
                  <MoreHorizontal
                    size={15}
                  />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-8 z-50 w-32 overflow-hidden rounded-xl border border-[#29293A] bg-[#15151F] p-1 shadow-xl">

                    <button
                      type="button"
                      onClick={
                        handleDelete
                      }
                      disabled={deleting}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-400 transition hover:bg-red-500/10"
                    >
                      <Trash2
                        size={14}
                      />

                      {deleting
                        ? 'Deleting...'
                        : 'Delete'}
                    </button>

                  </div>
                )}

              </div>
            )}

        </div>

        {/* =================================================
            TIMESTAMP
        ================================================== */}

        <span className="mt-1 px-1 text-[10px] text-[#555467]">
          {new Date(
            message.createdAt
          ).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>

      </div>

    </div>
  );
}