import {
  Check,
  X,
  Clock,
  UserPlus,
  RefreshCw,
} from 'lucide-react';

import {
  useEffect,
  useState,
} from 'react';

import { formatDistanceToNow } from 'date-fns';

import {
  api,
} from '../services/api';

interface User {
  id: string;
  username: string;
  name?: string | null;
  email?: string;
  avatarUrl?: string | null;
}

interface Project {
  id: string;
  name: string;
  description?: string | null;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  token: string;
  status:
    | 'pending'
    | 'accepted'
    | 'declined';
  expiresAt: string;
  createdAt: string;

  projectId: string;

  project: Project;
  sender: User;
}

export function Invitations() {
  const [
    invitations,
    setInvitations,
  ] = useState<Invitation[]>(
    []
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const [
    processing,
    setProcessing,
  ] = useState<string | null>(
    null
  );

  const loadInvitations =
    async () => {
      try {
        setLoading(true);
        setError('');

        const response =
          await api.get(
            '/projects/invitations'
          );

        setInvitations(
          Array.isArray(
            response.data
          )
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          'Failed to load invitations:',
          error
        );

        setError(
          'Unable to load invitations.'
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadInvitations();
  }, []);

  const accept =
    async (
      invitation: Invitation
    ) => {
      try {
        setProcessing(
          invitation.id
        );

        await api.post(
          '/projects/invitations/accept',
          {
            token:
              invitation.token,
          }
        );

        setInvitations(
          previous =>
            previous.map(
              item =>
                item.id ===
                invitation.id
                  ? {
                      ...item,
                      status:
                        'accepted',
                    }
                  : item
            )
        );
      } catch (error) {
        console.error(
          'Failed to accept invitation:',
          error
        );

        setError(
          'Unable to accept invitation.'
        );
      } finally {
        setProcessing(null);
      }
    };

  const reject =
    async (
      invitation: Invitation
    ) => {
      try {
        setProcessing(
          invitation.id
        );

        await api.post(
          '/projects/invitations/reject',
          {
            token:
              invitation.token,
          }
        );

        setInvitations(
          previous =>
            previous.map(
              item =>
                item.id ===
                invitation.id
                  ? {
                      ...item,
                      status:
                        'declined',
                    }
                  : item
            )
        );
      } catch (error) {
        console.error(
          'Failed to reject invitation:',
          error
        );

        setError(
          'Unable to reject invitation.'
        );
      } finally {
        setProcessing(null);
      }
    };

  const pending =
    invitations.filter(
      invitation =>
        invitation.status ===
        'pending'
    );

  const processed =
    invitations.filter(
      invitation =>
        invitation.status !==
        'pending'
    );

  return (
    <div className="min-h-full bg-[#09090F] px-6 py-8 text-white">

      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
                <UserPlus size={20} />
              </div>

              <h1 className="text-2xl font-bold">
                Invitations
              </h1>
            </div>

            <p className="mt-2 text-sm text-[#77768A]">
              Manage project invitations
              sent to you.
            </p>
          </div>

          <button
            type="button"
            onClick={
              loadInvitations
            }
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-[#29293A] bg-[#151520] px-4 py-2 text-sm text-[#B7B5C6] transition hover:bg-[#1C1C28] hover:text-white disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={
                loading
                  ? 'animate-spin'
                  : ''
              }
            />

            Refresh
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="py-20 text-center text-sm text-[#68677B]">
            Loading invitations...
          </div>
        ) : invitations.length ===
          0 ? (
          <div className="rounded-2xl border border-[#242431] bg-[#11111A] py-20 text-center">

            <UserPlus
              size={40}
              className="mx-auto mb-4 text-[#2B2B3B]"
            />

            <h2 className="text-base font-semibold text-[#D8D6E4]">
              No invitations
            </h2>

            <p className="mt-1 text-sm text-[#626276]">
              You don't have any
              project invitations.
            </p>

          </div>
        ) : (
          <div className="space-y-8">

            {/* PENDING */}

            {pending.length > 0 && (
              <section>

                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-[#77768A]">
                    Pending
                  </h2>

                  <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-300">
                    {pending.length}
                  </span>
                </div>

                <div className="space-y-3">

                  {pending.map(
                    invitation => {
                      const isProcessing =
                        processing ===
                        invitation.id;

                      return (
                        <div
                          key={
                            invitation.id
                          }
                          className="rounded-2xl border border-[#29293A] bg-[#11111A] p-5"
                        >

                          <div className="flex gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-purple-300">
                              <UserPlus
                                size={
                                  19
                                }
                              />
                            </div>

                            <div className="min-w-0 flex-1">

                              <div className="flex flex-wrap items-start justify-between gap-3">

                                <div>
                                  <h3 className="font-semibold text-white">
                                    {
                                      invitation
                                        .project
                                        .name
                                    }
                                  </h3>

                                  <p className="mt-1 text-sm text-[#858397]">
                                    Invited by{' '}
                                    <span className="text-[#C3C1D0]">
                                      {
                                        invitation
                                          .sender
                                          .name ||
                                        invitation
                                          .sender
                                          .username
                                      }
                                    </span>
                                  </p>
                                </div>

                                <span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-300">
                                  Pending
                                </span>

                              </div>

                              {invitation
                                .project
                                .description && (
                                <p className="mt-3 text-sm leading-relaxed text-[#77768A]">
                                  {
                                    invitation
                                      .project
                                      .description
                                  }
                                </p>
                              )}

                              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#68677B]">

                                <span>
                                  Role:{' '}
                                  <span className="text-[#A8A6B8]">
                                    {
                                      invitation.role
                                    }
                                  </span>
                                </span>

                                <span className="flex items-center gap-1">
                                  <Clock
                                    size={
                                      12
                                    }
                                  />

                                  Expires{' '}
                                  {formatDistanceToNow(
                                    new Date(
                                      invitation.expiresAt
                                    ),
                                    {
                                      addSuffix:
                                        true,
                                    }
                                  )}
                                </span>

                              </div>

                              <div className="mt-5 flex gap-3">

                                <button
                                  type="button"
                                  disabled={
                                    isProcessing
                                  }
                                  onClick={() =>
                                    accept(
                                      invitation
                                    )
                                  }
                                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <Check
                                    size={
                                      16
                                    }
                                  />

                                  Accept
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    isProcessing
                                  }
                                  onClick={() =>
                                    reject(
                                      invitation
                                    )
                                  }
                                  className="flex items-center gap-2 rounded-xl border border-[#343443] bg-[#181821] px-5 py-2.5 text-sm font-semibold text-[#B7B5C6] transition hover:bg-[#22222E] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <X
                                    size={
                                      16
                                    }
                                  />

                                  Reject
                                </button>

                              </div>

                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}

                </div>
              </section>
            )}

            {/* PROCESSED */}

            {processed.length > 0 && (
              <section>

                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#77768A]">
                  Invitation history
                </h2>

                <div className="space-y-2">

                  {processed.map(
                    invitation => (
                      <div
                        key={
                          invitation.id
                        }
                        className="flex items-center justify-between rounded-xl border border-[#242431] bg-[#11111A] px-4 py-4"
                      >

                        <div>
                          <p className="text-sm font-medium text-[#E9E7F2]">
                            {
                              invitation
                                .project
                                .name
                            }
                          </p>

                          <p className="mt-1 text-xs text-[#68677B]">
                            Invited by{' '}
                            {
                              invitation
                                .sender
                                .name ||
                              invitation
                                .sender
                                .username
                            }
                          </p>
                        </div>

                        {invitation.status ===
                        'accepted' ? (
                          <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400">
                            <Check
                              size={13}
                            />
                            Accepted
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400">
                            <X
                              size={13}
                            />
                            Declined
                          </span>
                        )}

                      </div>
                    )
                  )}

                </div>
              </section>
            )}

          </div>
        )}

      </div>
    </div>
  );
}