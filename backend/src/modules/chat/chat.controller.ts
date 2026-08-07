import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/auth';

const ChatService =
  require('./chat.service').ChatService;

const chatService =
  new ChatService();

// ============================================================
// CREATE / GET CONVERSATION
// ============================================================

const createConversation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const currentUserId =
      req.user!.id;

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'userId is required',
      });
    }

    const conversation =
      await chatService.getOrCreateConversation(
        currentUserId,
        userId
      );

    res.status(200).json(
      conversation
    );
  } catch (error) {
    console.error(
      'Create conversation error:',
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(400).json({
      error: message,
    });
  }
};

// ============================================================
// GET CONVERSATIONS
// ============================================================

const getConversations = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const conversations =
      await chatService.getConversations(
        req.user!.id
      );

    res.json(conversations);
  } catch (error) {
    console.error(
      'Get conversations error:',
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
// GET SINGLE CONVERSATION
// ============================================================

const getConversation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      conversationId,
    } = req.params;

    const conversation =
      await chatService.getConversation(
        conversationId,
        req.user!.id
      );

    res.json(conversation);
  } catch (error) {
    console.error(
      'Get conversation error:',
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(403).json({
      error: message,
    });
  }
};

// ============================================================
// GET MESSAGES
// ============================================================

const getMessages = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      conversationId,
    } = req.params;

    const limitParam =
      typeof req.query.limit === 'string'
        ? Number(req.query.limit)
        : 50;

    const limit =
      Number.isFinite(limitParam)
        ? Math.min(
            Math.max(limitParam, 1),
            100
          )
        : 50;

    const messages =
      await chatService.getMessages(
        conversationId,
        req.user!.id,
        limit
      );

    res.json(messages);
  } catch (error) {
    console.error(
      'Get messages error:',
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(403).json({
      error: message,
    });
  }
};

// ============================================================
// SEND MESSAGE
// ============================================================

const sendMessage = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      conversationId,
    } = req.params;

    const { content } = req.body;

    if (
      typeof content !== 'string'
    ) {
      return res.status(400).json({
        error:
          'Message content is required',
      });
    }

    const message =
      await chatService.sendMessage(
        conversationId,
        req.user!.id,
        content
      );

    res.status(201).json(
      message
    );
  } catch (error) {
    console.error(
      'Send message error:',
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(400).json({
      error: message,
    });
  }
};

// ============================================================
// MARK AS READ
// ============================================================

const markAsRead = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      conversationId,
    } = req.params;

    const result =
      await chatService.markMessagesAsRead(
        conversationId,
        req.user!.id
      );

    res.json({
      success: true,
      updated: result.count,
    });
  } catch (error) {
    console.error(
      'Mark messages read error:',
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(403).json({
      error: message,
    });
  }
};

// ============================================================
// DELETE MESSAGE
// ============================================================

const deleteMessage = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      messageId,
    } = req.params;

    await chatService.deleteMessage(
      messageId,
      req.user!.id
    );

    res.status(204).send();
  } catch (error) {
    console.error(
      'Delete message error:',
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(400).json({
      error: message,
    });
  }
};

// ============================================================
// PROJECT / GROUP CHAT
// ============================================================

// Get project chat messages
const getProjectMessages = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({
        error: 'Project ID is required',
      });
    }

    const limitParam =
      typeof req.query.limit === 'string'
        ? Number(req.query.limit)
        : 50;

    const limit =
      Number.isFinite(limitParam)
        ? Math.min(
            Math.max(limitParam, 1),
            100
          )
        : 50;

    const messages =
      await chatService.getProjectMessages(
        projectId,
        req.user!.id,
        limit
      );

    res.json(messages);
  } catch (error) {
    console.error(
      'Get project messages error:',
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(403).json({
      error: message,
    });
  }
};

// Send project chat message
const sendProjectMessage = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { projectId } = req.params;
    const { content } = req.body;

    if (!projectId) {
      return res.status(400).json({
        error: 'Project ID is required',
      });
    }

    if (typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({
        error: 'Message content is required',
      });
    }

    const message =
      await chatService.createMessage(
        projectId,
        req.user!.id,
        content
      );

    res.status(201).json(message);
  } catch (error) {
    console.error(
      'Send project message error:',
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(400).json({
      error: message,
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createConversation,
  getConversations,
  getConversation,
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage,
  getProjectMessages,
  sendProjectMessage,
};

export {};