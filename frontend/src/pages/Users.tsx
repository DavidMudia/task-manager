import {
  ArrowLeft,
  Search,
  Users as UsersIcon,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { api } from '../services/api';
import { UserCard } from '../components/UserCard';

export function Users() {
  const [users, setUsers] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [hasSearched, setHasSearched] =
    useState(false);

  const [recentSearches, setRecentSearches] =
    useState<string[]>(() => {
      try {
        const stored =
          localStorage.getItem(
            'taskflow_recent_user_searches'
          );

        return stored
          ? JSON.parse(stored)
          : [];
      } catch {
        return [];
      }
    });

  // ============================================================
  // SEARCH USERS
  // ============================================================

  const loadUsers = async (
    searchValue: string
  ) => {
    const trimmed =
      searchValue.trim();

    if (trimmed.length < 2) {
      setUsers([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);

      const response =
        await api.get('/users', {
          params: {
            search: trimmed,
          },
        });

      setUsers(
        Array.isArray(response.data)
          ? response.data
          : []
      );

      // Save recent search
      setRecentSearches(
        previous => {
          const updated = [
            trimmed,
            ...previous.filter(
              item =>
                item.toLowerCase() !==
                trimmed.toLowerCase()
            ),
          ].slice(0, 5);

          localStorage.setItem(
            'taskflow_recent_user_searches',
            JSON.stringify(updated)
          );

          return updated;
        }
      );
    } catch (error) {
      console.error(
        'Failed to search users:',
        error
      );

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // DEBOUNCED SEARCH
  // ============================================================

  useEffect(() => {
    const trimmed =
      search.trim();

    if (trimmed.length < 2) {
      setUsers([]);
      setHasSearched(false);
      return;
    }

    const timer =
      setTimeout(() => {
        loadUsers(trimmed);
      }, 300);

    return () =>
      clearTimeout(timer);
  }, [search]);

  // ============================================================
  // RECENT SEARCH
  // ============================================================

  const handleRecentSearch = (
    value: string
  ) => {
    setSearch(value);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem(
      'taskflow_recent_user_searches'
    );

    setRecentSearches([]);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-full bg-[#09090F] px-4 py-6 text-white md:px-6">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/home"
              className="rounded-lg p-2 text-[#77768A] hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <h1 className="text-xl font-bold">
                People
              </h1>

              <p className="text-xs text-[#68677B]">
                Find people on TaskFlow
              </p>
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
            <UsersIcon size={18} />
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative mb-6 max-w-md">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#626276]"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by name or username..."
            className="w-full rounded-xl border border-[#29293A] bg-[#11111A] py-3 pl-10 pr-10 text-sm text-white outline-none placeholder:text-[#5F5E72] focus:border-purple-500/40"
          />

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setUsers([]);
                setHasSearched(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#626276] hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* RECENT SEARCHES */}
        {!search &&
          recentSearches.length > 0 && (
            <div className="mb-8 max-w-2xl">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#D8D6E3]">
                  Recent searches
                </h2>

                <button
                  type="button"
                  onClick={clearRecentSearches}
                  className="text-xs text-[#68677B] hover:text-white"
                >
                  Clear
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map(
                  value => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        handleRecentSearch(
                          value
                        )
                      }
                      className="rounded-full border border-[#29293A] bg-[#11111A] px-3 py-1.5 text-xs text-[#A8A6B8] transition hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-white"
                    >
                      <span className="flex items-center gap-1.5">
                        <Search size={12} />
                        {value}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
          )}

        {/* INITIAL STATE */}
        {!search && (
          <div className="rounded-2xl border border-dashed border-[#303043] bg-[#11111A] p-10 text-center">
            <Search
              size={26}
              className="mx-auto text-[#555466]"
            />

            <p className="mt-3 text-sm text-[#77768A]">
              Search for someone to connect with.
            </p>

            <p className="mt-1 text-xs text-[#555466]">
              Enter at least 2 characters.
            </p>
          </div>
        )}

        {/* TOO SHORT */}
        {search.trim().length === 1 && (
          <div className="rounded-2xl border border-dashed border-[#303043] bg-[#11111A] p-10 text-center">
            <Search
              size={26}
              className="mx-auto text-[#555466]"
            />

            <p className="mt-3 text-sm text-[#77768A]">
              Keep typing...
            </p>

            <p className="mt-1 text-xs text-[#555466]">
              Enter at least 2 characters.
            </p>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="py-16 text-center text-sm text-[#68677B]">
            Searching people...
          </div>
        )}

        {/* NO RESULTS */}
        {!loading &&
          hasSearched &&
          search.trim().length >= 2 &&
          users.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#303043] bg-[#11111A] p-10 text-center">
              <UsersIcon
                size={24}
                className="mx-auto text-[#555466]"
              />

              <p className="mt-3 text-sm text-[#77768A]">
                No people found.
              </p>

              <p className="mt-1 text-xs text-[#555466]">
                Try searching with another name or username.
              </p>
            </div>
          )}

        {/* RESULTS */}
        {!loading &&
          users.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {users.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                />
              ))}
            </div>
          )}
      </div>
    </div>
  );
}