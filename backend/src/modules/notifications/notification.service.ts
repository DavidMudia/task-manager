const prisma = require('../../utils/prisma');

class NotificationsService {
  // ============================================================
  // CREATE NOTIFICATION
  // ============================================================

  async create(data: {
    userId: string;
    type: string;
    message: string;
    projectId?: string;
    taskId?: string;
    invitationId?: string;
  }) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        message: data.message,
        projectId: data.projectId,
        taskId: data.taskId,
        invitationId: data.invitationId,
      },
    });
  }

  // ============================================================
  // GET NOTIFICATIONS
  // ============================================================

  async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
      include: {
        invitation: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
              },
            },
            sender: {
              select: {
                id: true,
                name: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }
  // ============================================================
  // CLEAR ALL NOTIFICATIONS
  // ============================================================

  async clearAll(userId: string) {
    return prisma.notification.deleteMany({
      where: {
        userId,
      },
    });
  }
  // ============================================================
  // GET UNREAD COUNT
  // ============================================================

  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  // ============================================================
  // MARK ONE AS READ
  // ============================================================

  async markAsRead(
    notificationId: string,
    userId: string
  ) {
    const notification =
      await prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId,
        },
      });

    if (!notification) {
      throw new Error(
        'Notification not found'
      );
    }

    return prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        read: true,
      },
    });
  }

  // ============================================================
  // MARK ALL AS READ
  // ============================================================

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  }
}

module.exports = {
  NotificationsService,
};

export {};