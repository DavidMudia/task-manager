const app = require('./app');

const { env } = require('./config/env');
const { createServer } = require('http');
const {
  Server: SocketServer,
} = require('socket.io');

const {
  verifySocketToken,
} = require('./middleware/auth');

const {
  ChatService,
} = require('./modules/chat/chat.service');

const {
  setSocketIO,
} = require('./modules/notifications/notification.socket');

// ============================================================
// HTTP SERVER
// ============================================================

const httpServer = createServer(app);

const chatService = new ChatService();

// ============================================================
// FRONTEND ORIGIN
// ============================================================

const frontendUrl =
  env.frontendUrl || 'http://localhost:5173';

// ============================================================
// SOCKET.IO
// ============================================================

const io = new SocketServer(
  httpServer,
  {
    cors: {
      origin: frontendUrl,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  }
);

// ============================================================
// NOTIFICATION SOCKET
// ============================================================

setSocketIO(io);

// ============================================================
// SOCKET AUTHENTICATION
// ============================================================

io.use(
  (
    socket: any,
    next: any
  ) => {
    try {
      const token =
        socket.handshake.auth?.token;

      if (!token) {
        return next(
          new Error(
            'Authentication error'
          )
        );
      }

      const decoded =
        verifySocketToken(token);

      socket.data.user = decoded;

      next();
    } catch (error) {
      console.error(
        'Socket authentication failed:',
        error instanceof Error
          ? error.message
          : 'Unknown error'
      );

      next(
        new Error(
          'Invalid token'
        )
      );
    }
  }
);

// ============================================================
// SOCKET CONNECTION
// ============================================================

io.on(
  'connection',
  (socket: any) => {
    const {
      id: userId,
      email,
    } = socket.data.user;

    console.log(
      `User ${email} connected`
    );

    // ========================================================
    // PERSONAL USER ROOM
    // ========================================================

    socket.join(
      `user:${userId}`
    );

    // ========================================================
    // JOIN PROJECT
    // ========================================================

    socket.on(
      'join-project',
      async (
        projectId: string,
        callback?: (
          response: any
        ) => void
      ) => {
        try {
          if (!projectId) {
            throw new Error(
              'Project ID is required'
            );
          }

          await chatService.verifyProjectAccess(
            projectId,
            userId
          );

          socket.join(
            `project:${projectId}`
          );

          console.log(
            `User ${email} joined project ${projectId}`
          );

          callback?.({
            success: true,
            projectId,
          });
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Unable to join project';

          console.error(
            `Join project error for ${email}:`,
            message
          );

          callback?.({
            success: false,
            error: message,
          });
        }
      }
    );

    // ========================================================
    // LEAVE PROJECT
    // ========================================================

    socket.on(
      'leave-project',
      (
        projectId: string,
        callback?: (
          response: any
        ) => void
      ) => {
        if (!projectId) {
          callback?.({
            success: false,
            error:
              'Project ID is required',
          });

          return;
        }

        socket.leave(
          `project:${projectId}`
        );

        console.log(
          `User ${email} left project ${projectId}`
        );

        callback?.({
          success: true,
          projectId,
        });
      }
    );

    // ========================================================
    // SEND MESSAGE
    // ========================================================

    socket.on(
      'send-message',
      async (
        data: {
          projectId: string;
          content: string;
        },
        callback?: (
          response: any
        ) => void
      ) => {
        try {
          const {
            projectId,
            content,
          } = data || {};

          if (!projectId) {
            throw new Error(
              'Project ID is required'
            );
          }

          if (
            !content ||
            !content.trim()
          ) {
            throw new Error(
              'Message content is required'
            );
          }

          const message =
            await chatService.createMessage(
              projectId,
              userId,
              content.trim()
            );

          io
            .to(`project:${projectId}`)
            .emit(
              'new-message',
              message
            );

          console.log(
            `Message sent by ${email} in project ${projectId}`
          );

          callback?.({
            success: true,
            message,
          });
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Unable to send message';

          console.error(
            `Send message error for ${email}:`,
            message
          );

          callback?.({
            success: false,
            error: message,
          });
        }
      }
    );

    // ========================================================
    // TYPING INDICATOR
    // ========================================================

    socket.on(
      'typing',
      async (
        data: {
          projectId: string;
          isTyping: boolean;
        }
      ) => {
        try {
          const {
            projectId,
            isTyping,
          } = data || {};

          if (!projectId) {
            return;
          }

          await chatService.verifyProjectAccess(
            projectId,
            userId
          );

          socket
            .to(`project:${projectId}`)
            .emit(
              'user-typing',
              {
                userId,
                isTyping:
                  Boolean(isTyping),
              }
            );
        } catch (error) {
          console.error(
            'Typing event rejected:',
            error instanceof Error
              ? error.message
              : 'Unknown error'
          );
        }
      }
    );

    // ========================================================
    // DISCONNECT
    // ========================================================

    socket.on(
      'disconnect',
      (reason: string) => {
        console.log(
          `User ${email} disconnected: ${reason}`
        );
      }
    );
  }
);

// ============================================================
// START SERVER
// ============================================================

const port =
  Number(process.env.PORT) ||
  env.port ||
  5000;

httpServer.listen(
  port,
  '0.0.0.0',
  () => {
    console.log(
      `🚀 TaskFlow API running on port ${port}`
    );

    console.log(
      `🔌 Socket.IO enabled`
    );

    console.log(
      `🌍 Frontend origin: ${frontendUrl}`
    );
  }
);