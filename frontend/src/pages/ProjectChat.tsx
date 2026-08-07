import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { Send, Wifi, WifiOff } from 'lucide-react';
import { format } from 'date-fns';

interface MessageUser {
  id: string;
  username: string;
  email: string;
  name?: string;
  avatarUrl?: string | null;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  projectId: string;
  userId: string;
  user: MessageUser;
}

interface JoinResponse {
  success: boolean;
  projectId?: string;
  error?: string;
}

interface SendResponse {
  success: boolean;
  message?: Message;
  error?: string;
}

interface TypingData {
  userId: string;
  isTyping: boolean;
}

export function ProjectChat() {
  const { projectId } = useParams<{ projectId: string }>();

  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [joinedProject, setJoinedProject] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ============================================================
  // FETCH MESSAGE HISTORY
  // ============================================================

  const {
    data: initialMessages,
    isLoading,
    error: messagesError,
  } = useQuery({
    queryKey: ['messages', projectId],

    queryFn: async () => {
      const { data } = await api.get<Message[]>(
        `/chat/${projectId}/messages`
      );

      return data;
    },

    enabled: !!projectId,
  });

  // ============================================================
  // SET INITIAL MESSAGES
  // ============================================================

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // ============================================================
  // SOCKET PROJECT ROOM
  // ============================================================

  useEffect(() => {
    if (!socket || !projectId || !isConnected) {
      return;
    }

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => {
        // Prevent duplicate messages
        if (prev.some((existing) => existing.id === message.id)) {
          return prev;
        }

        return [...prev, message];
      });
    };

    const handleTyping = (data: TypingData) => {
      // Never display the current user as typing
      if (data.userId === user?.id) {
        return;
      }

      setTypingUsers((prev) => ({
        ...prev,
        [data.userId]: data.isTyping,
      }));
    };

    // Join project room
    socket.emit(
      'join-project',
      projectId,
      (response: JoinResponse) => {
        if (response.success) {
          setJoinedProject(true);
          console.log(`Joined project ${projectId}`);
        } else {
          setJoinedProject(false);
          console.error(
            'Unable to join project:',
            response.error
          );
        }
      }
    );

    socket.on('new-message', handleNewMessage);
    socket.on('user-typing', handleTyping);

    return () => {
      socket.emit('leave-project', projectId);

      socket.off('new-message', handleNewMessage);
      socket.off('user-typing', handleTyping);

      setJoinedProject(false);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };
  }, [socket, projectId, isConnected, user?.id]);

  // ============================================================
  // AUTO-SCROLL
  // ============================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  // ============================================================
  // SEND MESSAGE
  // ============================================================

  const sendMessage = () => {
    if (
      !socket ||
      !isConnected ||
      !joinedProject ||
      !projectId
    ) {
      return;
    }

    const content = newMessage.trim();

    if (!content) {
      return;
    }

    setSendError(null);

    socket.emit(
      'send-message',
      {
        projectId,
        content,
      },
      (response: SendResponse) => {
        if (!response.success) {
          setSendError(
            response.error || 'Unable to send message'
          );
          return;
        }

        setNewMessage('');

        // Stop typing immediately after sending
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = null;
        }

        socket.emit('typing', {
          projectId,
          isTyping: false,
        });
      }
    );
  };

  // ============================================================
  // TYPING
  // ============================================================

  const handleTyping = (value: string) => {
    setNewMessage(value);

    if (!socket || !projectId || !isConnected) {
      return;
    }

    const isTyping = value.trim().length > 0;

    socket.emit('typing', {
      projectId,
      isTyping,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', {
          projectId,
          isTyping: false,
        });

        typingTimeoutRef.current = null;
      }, 2000);
    }
  };

  // ============================================================
  // ENTER KEY
  // ============================================================

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // ============================================================
  // TYPING USERS
  // ============================================================

  const activeTypingUsers = Object.entries(typingUsers)
    .filter(([, isTyping]) => isTyping)
    .map(([userId]) => userId);

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#09090F]">
        <div className="text-sm text-[#8E8EA3]">
          Loading messages...
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (messagesError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#09090F]">
        <div className="text-center">
          <p className="text-sm font-medium text-red-400">
            Unable to load messages
          </p>

          <p className="text-xs text-[#8E8EA3] mt-1">
            Make sure you are a member of this project.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // UI – DARK THEME
  // ============================================================

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#09090F]">

      {/* ======================================================
          CHAT HEADER – Dark
      ====================================================== */}

      <div className="border-b border-[#242431] bg-[#11111A] px-4 py-3 flex items-center justify-between flex-shrink-0">

        <div>
          <h2 className="font-semibold text-[#F5F3FF]">
            Project Chat
          </h2>

          <p className="text-xs text-[#8E8EA3]">
            {messages.length}{' '}
            {messages.length === 1 ? 'message' : 'messages'}
          </p>
        </div>

        <div className="flex items-center gap-2">

          {isConnected ? (
            <>
              <Wifi
                size={14}
                className="text-emerald-400"
              />

              <span className="text-xs text-emerald-400">
                Connected
              </span>
            </>
          ) : (
            <>
              <WifiOff
                size={14}
                className="text-red-400"
              />

              <span className="text-xs text-red-400">
                Disconnected
              </span>
            </>
          )}

        </div>
      </div>

      {/* ======================================================
          MESSAGES – Dark
      ====================================================== */}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">

              <p className="text-sm font-medium text-[#8E8EA3]">
                No messages yet
              </p>

              <p className="text-xs text-[#626276] mt-1">
                Start the conversation with your team.
              </p>

            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isMine = msg.user.id === user?.id;

          return (
            <div
              key={msg.id}
              className={`flex ${
                isMine
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                  isMine
                    ? 'bg-[#2A2A3A] text-[#F5F3FF] border border-[#3A3A4A]'
                    : 'bg-[#1A1A25] text-[#E9E7F2] border border-[#242431]'
                }`}
              >

                {!isMine && (
                  <p className="text-xs font-semibold text-purple-400 mb-1">
                    {msg.user.name ||
                      msg.user.username ||
                      msg.user.email}
                  </p>
                )}

                <p className="text-sm break-words whitespace-pre-wrap">
                  {msg.content}
                </p>

                <p
                  className={`text-[10px] mt-1 text-right ${
                    isMine
                      ? 'text-[#8E8EA3]'
                      : 'text-[#626276]'
                  }`}
                >
                  {format(
                    new Date(msg.createdAt),
                    'h:mm a'
                  )}
                </p>

              </div>
            </div>
          );
        })}

        {/* ====================================================
            TYPING INDICATOR – Dark
        ==================================================== */}

        {activeTypingUsers.length > 0 && (
          <div className="flex justify-start">

            <div className="bg-[#1A1A25] text-[#8E8EA3] px-4 py-2 rounded-2xl text-sm border border-[#242431] shadow-sm">
              <span className="animate-pulse">
                Someone is typing...
              </span>
            </div>

          </div>
        )}

        <div ref={messagesEndRef} />

      </div>

      {/* ======================================================
          SEND ERROR
      ====================================================== */}

      {sendError && (
        <div className="px-4 pb-2">
          <p className="text-xs text-red-400">
            {sendError}
          </p>
        </div>
      )}

      {/* ======================================================
          MESSAGE INPUT – Dark
      ====================================================== */}

      <div className="border-t border-[#242431] bg-[#11111A] p-3 flex items-center gap-2 flex-shrink-0">

        <input
          type="text"
          value={newMessage}
          onChange={(event) =>
            handleTyping(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder={
            !isConnected
              ? 'Connecting...'
              : !joinedProject
                ? 'Joining project...'
                : 'Type a message...'
          }
          disabled={
            !isConnected ||
            !joinedProject
          }
          maxLength={5000}
          className="flex-1 px-4 py-2 rounded-xl bg-[#1A1A25] border border-[#242431] focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/30 outline-none text-sm text-[#F5F3FF] placeholder-[#626276] disabled:bg-[#11111A] disabled:cursor-not-allowed transition-all"
        />

        <button
          onClick={sendMessage}
          disabled={
            !isConnected ||
            !joinedProject ||
            !newMessage.trim()
          }
          className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          title="Send message"
        >
          <Send size={18} />
        </button>

      </div>

    </div>
  );
}