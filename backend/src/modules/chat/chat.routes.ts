export {};

const { Router } = require('express');

const {
  verifyToken,
} = require('../../middleware/auth');

const {
  createConversation,
  getConversations,
  getConversation,
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage,

  getProjectMessages,
} = require('./chat.controller');

const router = Router();

router.use(verifyToken);

// ============================================================
// PROJECT / GROUP CHAT
// ============================================================

// Get messages for a project
router.get(
  '/:projectId/messages',
  getProjectMessages
);

// ============================================================
// DIRECT CONVERSATIONS
// ============================================================

// Get all conversations for current user
router.get(
  '/conversations',
  getConversations
);

// Create a new private conversation
// or return an existing one.
router.post(
  '/conversations',
  createConversation
);

// Get one conversation
router.get(
  '/conversations/:conversationId',
  getConversation
);

// Get messages
router.get(
  '/conversations/:conversationId/messages',
  getMessages
);

// Send message
router.post(
  '/conversations/:conversationId/messages',
  sendMessage
);

// Mark messages as read
router.patch(
  '/conversations/:conversationId/read',
  markAsRead
);

// Delete direct message
router.delete(
  '/messages/:messageId',
  deleteMessage
);

module.exports = router;