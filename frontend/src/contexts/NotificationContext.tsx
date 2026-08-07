import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { useSocket } from './SocketContext';
import { api } from '../services/api';

// ============================================================
// TYPES
// ============================================================

export interface NotificationInvitation {
  id: string;
  token: string;
  role: string;
  status: string;
  expiresAt: string;

  project: {
    id: string;
    name: string;
  };

  sender: {
    id: string;
    username: string;
    name?: string | null;
    avatarUrl?: string | null;
  };
}

export interface Notification {
  id: string;
  type: string;
  message: string;

  taskId?: string | null;
  projectId?: string | null;
  invitationId?: string | null;

  userId: string;
  createdAt: string;
  read: boolean;

  invitation?: NotificationInvitation | null;
}

export interface Invitation {
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

  project: {
    id: string;
    name: string;
    description?: string | null;
    category?: string | null;
    color?: string | null;
    coverImage?: string | null;
    maxMembers?: number;
    status?: string;

    owner?: {
      id: string;
      name?: string | null;
      username?: string | null;
      email?: string | null;
      avatarUrl?: string | null;
    };
  };

  sender: {
    id: string;
    username: string;
    name?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
  };
}

// ============================================================
// CONTEXT TYPE
// ============================================================

export interface NotificationContextType {
  notifications: Notification[];
  invitations: Invitation[];

  unreadCount: number;

  loading: boolean;
  invitationsLoading: boolean;

  addNotification: (
    notification: Omit<
      Notification,
      'id' | 'read' | 'createdAt'
    >
  ) => void;

  markAsRead: (
    id: string
  ) => Promise<void>;

  markAllAsRead: () => Promise<void>;

  clearNotifications: () => Promise<void>;

  refreshNotifications: () => Promise<void>;

  refreshInvitations: () => Promise<void>;

  acceptInvitation: (
    token: string
  ) => Promise<void>;

  rejectInvitation: (
    token: string
  ) => Promise<void>;
}

// ============================================================
// CONTEXT
// ============================================================

export const NotificationContext =
  createContext<
    NotificationContextType | undefined
  >(undefined);

// ============================================================
// PROVIDER
// ============================================================

export const NotificationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { socket } = useSocket();

  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const [
    invitations,
    setInvitations,
  ] = useState<Invitation[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    invitationsLoading,
    setInvitationsLoading,
  ] = useState(true);

  // ============================================================
  // LOAD NOTIFICATIONS
  // ============================================================

  const refreshNotifications =
    async () => {
      try {
        setLoading(true);

        const response =
          await api.get(
            '/notifications'
          );

        const data =
          Array.isArray(
            response.data
          )
            ? response.data
            : response.data.notifications ||
              [];

        setNotifications(data);
      } catch (error) {
        console.error(
          'Failed to load notifications:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

  // ============================================================
  // LOAD INVITATIONS
  // ============================================================

  const refreshInvitations =
    async () => {
      try {
        setInvitationsLoading(true);

        const response =
          await api.get(
            '/projects/invitations'
          );

        const data =
          Array.isArray(
            response.data
          )
            ? response.data
            : response.data.invitations ||
              [];

        setInvitations(data);
      } catch (error) {
        console.error(
          'Failed to load invitations:',
          error
        );

        setInvitations([]);
      } finally {
        setInvitationsLoading(false);
      }
    };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    const token =
      localStorage.getItem(
        'token'
      );

    if (!token) {
      setNotifications([]);
      setInvitations([]);
      setLoading(false);
      setInvitationsLoading(false);

      return;
    }

    const loadData =
      async () => {
        await Promise.all([
          refreshNotifications(),
          refreshInvitations(),
        ]);
      };

    loadData();
  }, []);

  // ============================================================
  // SOCKET NOTIFICATIONS
  // ============================================================

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleNotification = (
      data: Notification
    ) => {
      console.log(
        '🔔 Notification received:',
        data
      );

      // Always preserve the real database
      // notification ID from the backend.
      const newNotification:
        Notification = {
          id:
            data.id ||
            `${Date.now()}-${Math.random()}`,

          type:
            data.type ||
            'general',

          message:
            data.message ||
            'You have a new notification',

          taskId:
            data.taskId ??
            null,

          projectId:
            data.projectId ??
            null,

          invitationId:
            data.invitationId ??
            null,

          invitation:
            data.invitation ??
            null,

          userId:
            data.userId,

          createdAt:
            data.createdAt ||
            new Date().toISOString(),

          read:
            Boolean(data.read),
        };

      setNotifications(
        previous => {
          // Prevent duplicate database
          // notifications.
          if (
            previous.some(
              notification =>
                notification.id ===
                newNotification.id
            )
          ) {
            return previous;
          }

          return [
            newNotification,
            ...previous,
          ];
        }
      );

      // Refresh invitation data when a
      // project invitation arrives.
      const isInvitation =
        newNotification.type ===
          'invitation' ||
        newNotification.type ===
          'project_invitation' ||
        newNotification.type ===
          'member_invitation';

      if (isInvitation) {
        refreshInvitations();
      }
    };

    socket.on(
      'notification',
      handleNotification
    );

    return () => {
      socket.off(
        'notification',
        handleNotification
      );
    };
  }, [socket]);

  // ============================================================
  // UNREAD COUNT
  // ============================================================

  const unreadCount =
    notifications.filter(
      notification =>
        !notification.read
    ).length;

  // ============================================================
  // LOCAL NOTIFICATION
  // ============================================================

  const addNotification = (
    notification: Omit<
      Notification,
      'id' | 'read' | 'createdAt'
    >
  ) => {
    const newNotification:
      Notification = {
        ...notification,

        id:
          `${Date.now()}-${Math.random()}`,

        read: false,

        createdAt:
          new Date().toISOString(),
      };

    setNotifications(
      previous => [
        newNotification,
        ...previous,
      ]
    );
  };

  // ============================================================
  // MARK ONE AS READ
  // ============================================================

  const markAsRead =
    async (
      id: string
    ) => {
      try {
        await api.patch(
          `/notifications/${id}/read`
        );

        setNotifications(
          previous =>
            previous.map(
              notification =>
                notification.id === id
                  ? {
                      ...notification,
                      read: true,
                    }
                  : notification
            )
        );
      } catch (error) {
        console.error(
          'Failed to mark notification as read:',
          error
        );

        throw error;
      }
    };

  // ============================================================
  // MARK ALL AS READ
  // ============================================================

  const markAllAsRead =
    async () => {
      try {
        await api.patch(
          '/notifications/read-all'
        );

        setNotifications(
          previous =>
            previous.map(
              notification => ({
                ...notification,
                read: true,
              })
            )
        );
      } catch (error) {
        console.error(
          'Failed to mark all notifications as read:',
          error
        );

        throw error;
      }
    };

  // ============================================================
  // CLEAR ALL NOTIFICATIONS
  // ============================================================

  const clearNotifications =
    async () => {
      try {
        await api.delete(
          '/notifications'
        );

        setNotifications([]);
      } catch (error) {
        console.error(
          'Failed to clear notifications:',
          error
        );

        throw error;
      }
    };

  // ============================================================
  // ACCEPT INVITATION
  // ============================================================

  const acceptInvitation =
    async (
      token: string
    ) => {
      try {
        await api.post(
          '/projects/invitations/accept',
          {
            token,
          }
        );

        await Promise.all([
          refreshInvitations(),
          refreshNotifications(),
        ]);
      } catch (error) {
        console.error(
          'Failed to accept invitation:',
          error
        );

        throw error;
      }
    };

  // ============================================================
  // REJECT INVITATION
  // ============================================================

  const rejectInvitation =
    async (
      token: string
    ) => {
      try {
        await api.post(
          '/projects/invitations/reject',
          {
            token,
          }
        );

        await Promise.all([
          refreshInvitations(),
          refreshNotifications(),
        ]);
      } catch (error) {
        console.error(
          'Failed to reject invitation:',
          error
        );

        throw error;
      }
    };

  // ============================================================
  // PROVIDER
  // ============================================================

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        invitations,

        unreadCount,

        loading,
        invitationsLoading,

        addNotification,

        markAsRead,

        markAllAsRead,

        clearNotifications,

        refreshNotifications,

        refreshInvitations,

        acceptInvitation,

        rejectInvitation,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};