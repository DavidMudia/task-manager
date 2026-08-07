import { Router } from 'express';

import {
  verifyToken,
} from '../../middleware/auth';

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteAll,
} = require('./notification.controller');

const router = Router();

router.use(verifyToken);

router.get(
  '/',
  getNotifications
);

router.get(
  '/unread-count',
  getUnreadCount
);

router.patch(
  '/read-all',
  markAllAsRead
);

router.patch(
  '/:notificationId/read',
  markAsRead
);

router.delete(
  '/',
  deleteAll
);

module.exports = router;

export {};