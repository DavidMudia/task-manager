import {
  ArrowLeft,
  Send,
  MoreVertical,
  Check,
  CheckCheck,
} from 'lucide-react';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Link,
  useParams,
} from 'react-router-dom';

import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// ============================================================
// TYPES
// ============================================================

interface User {
  id: string;
  name?: string | null;
  username: string;
  email?: string;
  avatarUrl?: string | null;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  updatedAt?: string;
  read: boolean;
  sender?: User;
}

interface Conversation {
  id: string;
  createdAt?: string;
  updatedAt?: string;

  participants?: Array<{
    user: User;
  }>;

  unreadCount?: number;
}

// ============================================================
// CONVERSATION
// ============================================================

export function Conversation() {
  const {
    conversationId,
  } = useParams<{
    conversationId: string;
  }>();

  const { user } = useAuth();

  const [conversation, setConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [message, setMessage] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState('');

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  // ============================================================
  // GET CONVERSATION
  // ============================================================

  const loadConversation = async () => {
    if (!conversationId) {
      return;
    }

    try {
      const response =
        await api.get<Conversation>(
          `/chat/conversations/${conversationId}`
        );

      setConversation(response.data);
    } catch (error) {
      console.error(
        'Failed to load conversation:',
        error
      );

      setError(
        'Unable to load conversation.'
      );
    }
  };

  // ============================================================
  // GET MESSAGES
  // ============================================================

  const loadMessages = async () => {
    if (!conversationId) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response =
        await api.get<Message[]>(
          `/chat/conversations/${conversationId}/messages`,
          {
            params: {
              limit: 100,
            },
          }
        );

      setMessages(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        'Failed to load messages:',
        error
      );

      setError(
        'Unable to load messages.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // MARK AS READ
  // ============================================================

  const markAsRead = async () => {
    if (!conversationId) {
      return;
    }

    try {
      await api.patch(
        `/chat/conversations/${conversationId}/read`
      );
    } catch (error) {
      console.error(
        'Failed to mark messages as read:',
        error
      );
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    const load = async () => {
      await loadConversation();
      await loadMessages();
      await markAsRead();
    };

    load();
  }, [conversationId]);

  // ============================================================
  // AUTO SCROLL
  // ============================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  // ============================================================
  // SEND MESSAGE
  // ============================================================

  const handleSendMessage = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (
      !conversationId ||
      !message.trim() ||
      sending
    ) {
      return;
    }

    try {
      setSending(true);

      const response =
        await api.post<Message>(
          `/chat/conversations/${conversationId}/messages`,
          {
            content: message.trim(),
          }
        );

      setMessages((previous) => [
        ...previous,
        response.data,
      ]);

      setMessage('');

      await markAsRead();
    } catch (error) {
      console.error(
        'Failed to send message:',
        error
      );
    } finally {
      setSending(false);
    }
  };

  // ============================================================
  // GET OTHER USER
  // ============================================================

  const currentParticipant =
    conversation?.participants?.find(
      (participant) =>
        participant.user.id !== user?.id
    )?.user;

  // ============================================================
  // INVALID CONVERSATION
  // ============================================================

  if (!conversationId) {
    return (
      <div className="min-h-full bg-[#09090F] p-6 text-white">
        Invalid conversation.
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="flex h-full min-h-screen flex-col bg-[#09090F] text-white">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#242431] bg-[#11111A] px-4">

        <div className="flex items-center gap-3">

          <Link
            to="/inbox"
            className="rounded-lg p-2 text-[#77768A] transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={19} />
          </Link>

          <div className="flex items-center gap-3">

            {currentParticipant?.avatarUrl ? (
              <img
                src={
                  currentParticipant.avatarUrl
                }
                alt={
                  currentParticipant.name ||
                  currentParticipant.username
                }
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/20 text-sm font-semibold text-purple-300">
                {(
                  currentParticipant?.name ||
                  currentParticipant?.username ||
                  '?'
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div>
              <h1 className="text-sm font-semibold text-white">
                {currentParticipant?.name ||
                  currentParticipant?.username ||
                  'Conversation'}
              </h1>

              {currentParticipant?.username && (
                <p className="text-xs text-[#68677B]">
                  @{currentParticipant.username}
                </p>
              )}
            </div>

          </div>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-[#77768A] transition hover:bg-white/5 hover:text-white"
        >
          <MoreVertical size={19} />
        </button>

      </header>

      {/* ======================================================
          MESSAGES
      ====================================================== */}

      <main className="flex-1 overflow-y-auto px-4 py-6">

        <div className="mx-auto flex max-w-3xl flex-col gap-3">

          {loading ? (
            <div className="py-20 text-center text-sm text-[#68677B]">
              Loading messages...
            </div>
          ) : error ? (
            <div className="py-20 text-center">

              <p className="text-sm text-red-400">
                {error}
              </p>

              <button
                type="button"
                onClick={loadMessages}
                className="mt-3 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
              >
                Try again
              </button>

            </div>
          ) : messages.length === 0 ? (
            <div className="py-20 text-center">

              <p className="text-sm text-[#77768A]">
                No messages yet.
              </p>

              <p className="mt-1 text-xs text-[#555466]">
                Send the first message.
              </p>

            </div>
          ) : (
            messages.map((item) => (
              <MessageBubble
                key={item.id}
                message={item}
                currentUserId={user?.id}
              />
            ))
          )}

          <div ref={messagesEndRef} />

        </div>

      </main>

      {/* ======================================================
          MESSAGE INPUT
      ====================================================== */}

      <div className="shrink-0 border-t border-[#242431] bg-[#11111A] p-4">

        <form
          onSubmit={handleSendMessage}
          className="mx-auto flex max-w-3xl items-end gap-3"
        >

          <textarea
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' &&
                !event.shiftKey
              ) {
                event.preventDefault();

                handleSendMessage(event);
              }
            }}
            rows={1}
            placeholder="Write a message..."
            className="min-h-[44px] max-h-32 flex-1 resize-none rounded-xl border border-[#29293A] bg-[#1A1A25] px-4 py-3 text-sm text-white outline-none placeholder:text-[#626276] focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/10"
          />

          <button
            type="submit"
            disabled={
              sending ||
              !message.trim()
            }
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {sending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Send size={17} />
            )}
          </button>

        </form>

      </div>

    </div>
  );
}

// ============================================================
// MESSAGE BUBBLE
// ============================================================

function MessageBubble({
  message,
  currentUserId,
}: {
  message: Message;
  currentUserId?: string;
}) {
  // ==========================================================
  // DETERMINE SENDER
  // ==========================================================

  const isMine =
    message.senderId === currentUserId;

  const senderName =
    message.sender?.name ||
    message.sender?.username ||
    message.sender?.email ||
    'User';

  const senderAvatar =
    message.sender?.avatarUrl;

  // ==========================================================
  // MESSAGE TIME
  // ==========================================================

  const messageTime =
    new Date(
      message.createdAt
    ).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className={`flex w-full ${
        isMine
          ? 'justify-end'
          : 'justify-start'
      }`}
    >

      <div
        className={`flex max-w-[80%] items-end gap-2 ${
          isMine
            ? 'flex-row-reverse'
            : 'flex-row'
        }`}
      >

        {/* ==================================================
            RECEIVER AVATAR
        ================================================== */}

        {!isMine && (
          <div className="shrink-0">

            {senderAvatar ? (
              <img
                src={senderAvatar}
                alt={senderName}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-xs font-semibold text-purple-300">
                {senderName
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

          </div>
        )}

        {/* ==================================================
            MESSAGE CONTENT
        ================================================== */}

        <div
          className={`flex flex-col ${
            isMine
              ? 'items-end'
              : 'items-start'
          }`}
        >

          {/* Sender name */}

          {!isMine && (
            <p className="mb-1 ml-1 text-[11px] font-medium text-purple-400">
              {senderName}
            </p>
          )}

          {/* Bubble */}

          <div
            className={`rounded-2xl px-4 py-2.5 shadow-sm ${
              isMine
                ? 'rounded-br-md bg-purple-600 text-white'
                : 'rounded-bl-md border border-[#29293A] bg-[#151520] text-[#E9E7F2]'
            }`}
          >

            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {message.content}
            </p>

          </div>

          {/* Time + read status */}

          <div
            className={`mt-1 flex items-center gap-1 text-[10px] ${
              isMine
                ? 'mr-1 text-[#68677B]'
                : 'ml-1 text-[#626276]'
            }`}
          >

            <span>
              {messageTime}
            </span>

            {isMine && (
              message.read ? (
                <CheckCheck
                  size={12}
                  className="text-purple-400"
                />
              ) : (
                <Check
                  size={12}
                />
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}