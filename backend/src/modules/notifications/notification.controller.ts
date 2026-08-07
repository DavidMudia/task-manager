import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/auth';

const {
  NotificationsService,
} = require('./notification.service');

const notificationsService =
  new NotificationsService();

// ============================================================
// GET NOTIFICATIONS
// ============================================================

const getNotifications = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const notifications =
      await notificationsService.getNotifications(
        req.user!.id
      );

    res.json(notifications);
  } catch (error) {
    console.error(
      'Get notifications error:',
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(500).json({
      error: message,
    });
  }
};

// ============================================================
// GET UNREAD COUNT
// ============================================================

const getUnreadCount = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const count =
      await notificationsService.getUnreadCount(
        req.user!.id
      );

    res.json({
      count,
    });
  } catch (error) {
    console.error(
      'Get unread notification count error:',
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(500).json({
      error: message,
    });
  }
};

// ============================================================
// MARK ONE AS READ
// ============================================================

const markAsRead = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      notificationId,
    } = req.params;

    const notification =
      await notificationsService.markAsRead(
        notificationId,
        req.user!.id
      );

    res.json(notification);
  } catch (error) {
    console.error(
      'Mark notification as read error:',
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(404).json({
      error: message,
    });
  }
};

// ============================================================
// MARK ALL AS READ
// ============================================================

const markAllAsRead = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result =
      await notificationsService.markAllAsRead(
        req.user!.id
      );

    res.json({
      success: true,
      updated: result.count,
    });
  } catch (error) {
    console.error(
      'Mark all notifications as read error:',
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(500).json({
      error: message,
    });
  }
};

// ============================================================
// DELETE ALL
// ============================================================

const deleteAll = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result =
      await notificationsService.deleteAll(
        req.user!.id
      );

    res.json({
      success: true,
      deleted: result.count,
    });
  } catch (error) {
    console.error(
      'Delete notifications error:',
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(500).json({
      error: message,
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteAll,
};

export {};