import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Bell,
  Check,
  X,
  Clock,
  UserPlus,
} from 'lucide-react';

import {
  useNotifications,
} from '../contexts/useNotifications';

import {
  formatDistanceToNow,
} from 'date-fns';

export function NotificationBell() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    acceptInvitation,
    rejectInvitation,
  } = useNotifications();

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const [
    processingInvitation,
    setProcessingInvitation,
  ] = useState<string | null>(null);

  // ============================================================
  // DROPDOWN REF
  // ============================================================

  const notificationRef =
    useRef<HTMLDivElement | null>(null);

  // ============================================================
  // CLOSE WHEN CLICKING OUTSIDE
  // ============================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      const target =
        event.target as Node;

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          target
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );
    };
  }, [isOpen]);

  // ============================================================
  // ACCEPT INVITATION
  // ============================================================

  const handleAccept = async (
    notificationId: string,
    invitationToken: string
  ) => {
    try {
      setProcessingInvitation(
        notificationId
      );

      await acceptInvitation(
        invitationToken
      );

      await markAsRead(
        notificationId
      );
    } catch (error) {
      console.error(
        'Failed to accept invitation:',
        error
      );
    } finally {
      setProcessingInvitation(
        null
      );
    }
  };

  // ============================================================
  // REJECT INVITATION
  // ============================================================

  const handleReject = async (
    notificationId: string,
    invitationToken: string
  ) => {
    try {
      setProcessingInvitation(
        notificationId
      );

      await rejectInvitation(
        invitationToken
      );

      await markAsRead(
        notificationId
      );
    } catch (error) {
      console.error(
        'Failed to reject invitation:',
        error
      );
    } finally {
      setProcessingInvitation(
        null
      );
    }
  };

  return (
    <div
      ref={notificationRef}
      className="relative"
    >

      {/* ========================================================
          NOTIFICATION BUTTON
      ======================================================== */}

      <button
        type="button"
        onClick={() =>
          setIsOpen(
            previous => !previous
          )
        }
        className="relative rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 transition-all hover:bg-white/10 hover:text-white/90"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell size={18} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9
              ? '9+'
              : unreadCount}
          </span>
        )}
      </button>

      {/* ========================================================
          DROPDOWN
      ======================================================== */}

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-[calc(100vw-2rem)] max-w-[380px] overflow-hidden rounded-2xl border border-[#242431] bg-[#11111A] shadow-2xl sm:w-[380px]">

          {/* HEADER */}

          <div className="flex items-start justify-between gap-3 border-b border-[#242431] px-4 py-3">

            <div>
              <h3 className="font-semibold text-[#F5F3FF]">
                Notifications
              </h3>

              {unreadCount > 0 && (
                <p className="mt-0.5 text-xs text-[#626276]">
                  {unreadCount} unread
                </p>
              )}
            </div>

           <div className="flex shrink-0 gap-2">

              {notifications.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={
                      markAllAsRead
                    }
                    className="text-xs font-medium text-purple-400 transition-colors hover:text-purple-300"
                  >
                    Mark all read
                  </button>

                  <button
                    type="button"
                    onClick={
                      clearNotifications
                    }
                    className="text-xs font-medium text-[#717184] transition-colors hover:text-[#8E8EA3]"
                  >
                    Clear
                  </button>
                </>
              )}

            </div>

          </div>

          {/* NOTIFICATION LIST */}

          <div className="max-h-[480px] divide-y divide-[#242431] overflow-y-auto">

            {notifications.length === 0 ? (

              <div className="p-8 text-center text-[#717184]">

                <Bell
                  size={32}
                  className="mx-auto mb-2 text-[#2B2B3B]"
                />

                <p className="text-sm">
                  No notifications
                </p>

              </div>

            ) : (

              notifications.map(
                notification => {

                  const isInvitation =
                    notification.type ===
                      'project_invitation' ||
                    notification.type ===
                      'invitation' ||
                    notification.type ===
                      'member_invitation';

                  const invitation =
                    notification.invitation;

                  const isProcessing =
                    processingInvitation ===
                    notification.id;

                  return (
                    <div
                      key={
                        notification.id
                      }
                      className={`px-4 py-4 transition-colors hover:bg-[#171720] ${
                        !notification.read
                          ? 'bg-purple-500/5'
                          : ''
                      }`}
                    >

                      {!isInvitation && (

                        <button
                          type="button"
                          onClick={() =>
                            markAsRead(
                              notification.id
                            )
                          }
                          className="w-full text-left"
                        >

                          <p className="text-sm text-[#E9E7F2]">
                            {
                              notification.message
                            }
                          </p>

                          <p className="mt-1 text-xs text-[#626276]">
                            {formatDistanceToNow(
                              new Date(
                                notification.createdAt
                              ),
                              {
                                addSuffix:
                                  true,
                              }
                            )}
                          </p>

                        </button>

                      )}

                      {isInvitation && (

                        <div>

                          <div className="flex shrink-0 gap-2">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-purple-300">
                              <UserPlus
                                size={17}
                              />
                            </div>

                            <div className="min-w-0 flex-1">

                              <p className="text-sm font-medium text-white">
                                Project invitation
                              </p>

                              <p className="mt-1 text-sm leading-relaxed text-[#B4B2C5]">
                                {
                                  notification.message
                                }
                              </p>

                              {invitation && (

                                <div className="mt-3 rounded-xl border border-[#29293A] bg-[#171720] p-3">

                                  <p className="text-sm font-semibold text-white">
                                    {
                                      invitation
                                        .project
                                        .name
                                    }
                                  </p>

                                  <p className="mt-1 text-xs text-[#77768A]">

                                    Role:{' '}

                                    <span className="text-[#A8A6B8]">
                                      {
                                        invitation.role
                                      }
                                    </span>

                                  </p>

                                  <div className="mt-2 flex items-center gap-1 text-xs text-[#77768A]">

                                    <Clock
                                      size={12}
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

                                  </div>

                                </div>

                              )}

                              {invitation &&
                                invitation.status ===
                                  'pending' && (

                                  <div className="mt-3 flex gap-2">

                                    <button
                                      type="button"
                                      disabled={
                                        isProcessing ||
                                        !invitation.token
                                      }
                                      onClick={() =>
                                        handleAccept(
                                          notification.id,
                                          invitation.token
                                        )
                                      }
                                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                      <Check
                                        size={14}
                                      />

                                      Accept

                                    </button>

                                    <button
                                      type="button"
                                      disabled={
                                        isProcessing ||
                                        !invitation.token
                                      }
                                      onClick={() =>
                                        handleReject(
                                          notification.id,
                                          invitation.token
                                        )
                                      }
                                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#343443] bg-[#1A1A25] px-3 py-2 text-xs font-semibold text-[#B7B5C6] transition hover:bg-[#22222E] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                      <X
                                        size={14}
                                      />

                                      Reject

                                    </button>

                                  </div>

                                )}

                              <p className="mt-2 text-[10px] text-[#626276]">

                                {formatDistanceToNow(
                                  new Date(
                                    notification.createdAt
                                  ),
                                  {
                                    addSuffix:
                                      true,
                                  }
                                )}

                              </p>

                            </div>

                          </div>

                        </div>

                      )}

                    </div>
                  );
                }
              )

            )}

          </div>

        </div>
      )}

    </div>
  );
}