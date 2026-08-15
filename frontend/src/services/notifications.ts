import { api } from './api';

export interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  userId: string;
  projectId?: string | null;
  taskId?: string | null;
  invitationId?: string | null;
}

export interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  token: string;
  expiresAt: string;
  createdAt: string;

  project: {
    id: string;
    name: string;
    description?: string | null;
    maxMembers?: number;
    status?: string;
  };

  sender: {
    id: string;
    name?: string | null;
    username?: string | null;
    email: string;
    avatarUrl?: string | null;
  };
}

export const notificationService = {
  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  // Get the current user's notifications
  async getAll(
    limit = 50
  ): Promise<Notification[]> {
    const response = await api.get(
      '/notifications',
      {
        params: { limit },
      }
    );

    return Array.isArray(response.data)
      ? response.data
      : response.data.notifications || [];
  },

  // Mark one notification as read
  async markAsRead(
    notificationId: string
  ): Promise<Notification> {
    const response = await api.patch(
      `/notifications/${notificationId}/read`
    );

    return response.data;
  },

  // Mark every notification as read
  async markAllAsRead(): Promise<void> {
    await api.patch(
      '/notifications/read-all'
    );
  },

  // Clear every notification
  async clearNotifications(): Promise<void> {
    await api.delete(
      '/notifications'
    );
  },

  // ============================================================
  // INVITATIONS
  // ============================================================

  // Get pending invitations for the current user
  async getMyInvitations(): Promise<Invitation[]> {
    const response = await api.get(
      '/projects/invitations'
    );

    return Array.isArray(response.data)
      ? response.data
      : response.data.invitations || [];
  },

  // Accept an invitation using its token
  async acceptInvitation(
    token: string
  ) {
    const response = await api.post(
      '/projects/invitations/accept',
      {
        token,
      }
    );

    return response.data;
  },

  // Reject an invitation using its invitation ID
  async rejectInvitation(
    invitationId: string
  ) {
    const response = await api.post(
      '/projects/invitations/reject',
      {
        invitationId,
      }
    );

    return response.data;
  },
};