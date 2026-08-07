import {
  ArrowLeft,
  MessageCircle,
  Search,
  UserPlus,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ConversationList } from '../components/ConversationList';

export function Inbox() {
  const [conversations, setConversations] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState('');

  const [users, setUsers] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [searching, setSearching] =
    useState(false);

  useEffect(() => {
  loadConversations();

  const interval =
    window.setInterval(
      loadConversations,
      10000
    );

  return () => {
    window.clearInterval(
      interval
    );
  };
}, []);

  const loadConversations = async () => {
    try {
      setLoading(true);

      const response =
        await api.get(
          '/chat/conversations'
        );

      setConversations(
        response.data
      );
    } catch (error) {
      console.error(
        'Failed to load conversations:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (
    value: string
  ) => {
    setSearch(value);

    if (!value.trim()) {
      setUsers([]);
      return;
    }

    try {
      setSearching(true);

      const response =
        await api.get('/users', {
          params: {
            search: value.trim(),
          },
        });

      setUsers(response.data);
    } catch (error) {
      console.error(
        'Failed to search users:',
        error
      );
    } finally {
      setSearching(false);
    }
  };

  const startConversation = async (
    userId: string
  ) => {
    try {
      const response =
        await api.post(
          '/chat/conversations',
          {
            userId,
          }
        );

      const conversation =
        response.data;

      window.location.href =
        `/inbox/${conversation.id}`;
    } catch (error) {
      console.error(
        'Failed to create conversation:',
        error
      );
    }
  };

  return (
    <div className="h-full bg-[#09090F] text-white">
      <div className="mx-auto flex h-full max-w-7xl flex-col">

        {/* Header */}

        <header className="flex flex-shrink-0 items-center justify-between border-b border-[#242431] px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/home"
              className="rounded-lg p-2 text-[#77768A] transition hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <h1 className="text-xl font-bold text-white">
                Inbox
              </h1>

              <p className="text-xs text-[#68677B]">
                Private conversations
              </p>
            </div>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
            <MessageCircle size={18} />
          </div>
        </header>

        <div className="min-h-0 flex-1 md:flex">

          {/* Conversation sidebar */}

          <aside className="flex w-full flex-col border-b border-[#242431] md:w-80 md:flex-shrink-0 md:border-b-0 md:border-r">

            {/* Search */}

            <div className="border-b border-[#242431] p-4">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#626276]"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    searchUsers(
                      event.target.value
                    )
                  }
                  placeholder="Find someone..."
                  className="w-full rounded-xl border border-[#29293A] bg-[#15151F] py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-[#5F5E72] focus:border-purple-500/40"
                />
              </div>
            </div>

            {/* Search results */}

            {search.trim() && (
              <div className="border-b border-[#242431] p-2">
                <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#626276]">
                  People
                </p>

                {searching ? (
                  <p className="px-3 py-3 text-xs text-[#68677B]">
                    Searching...
                  </p>
                ) : users.length === 0 ? (
                  <p className="px-3 py-3 text-xs text-[#68677B]">
                    No users found.
                  </p>
                ) : (
                  users.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() =>
                        startConversation(
                          user.id
                        )
                      }
                      className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-white/[0.04]"
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-xs font-bold text-white">
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
                        <p className="truncate text-sm font-medium text-white">
                          {user.name ||
                            user.username}
                        </p>

                        <p className="truncate text-xs text-[#68677B]">
                          @{user.username}
                        </p>
                      </div>

                      <UserPlus
                        size={15}
                        className="text-[#68677B]"
                      />
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Conversations */}

            <div className="min-h-0 flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-5 text-center text-xs text-[#68677B]">
                  Loading conversations...
                </div>
              ) : (
                <ConversationList
                  conversations={
                    conversations
                  }
                />
              )}
            </div>
          </aside>

          {/* Empty state */}

          <main className="hidden min-w-0 flex-1 items-center justify-center md:flex">
            <div className="max-w-sm px-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-300">
                <MessageCircle size={28} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-white">
                Your private inbox
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#6F6E82]">
                Select a conversation or search for
                someone to start a private message.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}