import type {
  Request,
  Response,
} from 'express';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const authRoutes =
  require('./modules/auth/auth.routes');

const projectRoutes =
  require('./modules/projects/projects.routes');

const taskRoutes =
  require('./modules/tasks/tasks.routes');

const userRoutes =
  require('./modules/users/users.routes');

const chatRoutes =
  require('./modules/chat/chat.routes');

const notificationRoutes =
  require('./modules/notifications/notification.routes');

const {
  errorHandler,
} = require('./middleware/errorHandler');

const {
  env,
} = require('./config/env');

const app = express();

// ============================================================
// SECURITY
// ============================================================

app.use(
  helmet()
);

// ============================================================
// CORS
// ============================================================

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

if (env.frontendUrl) {
  allowedOrigins.push(
    env.frontendUrl
  );
}

app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (
        error: Error | null,
        allowed?: boolean
      ) => void
    ) => {
      // Allow requests without an Origin
      // such as health checks or server-to-server requests.
      if (!origin) {
        return callback(
          null,
          true
        );
      }

      if (
        allowedOrigins.includes(
          origin
        )
      ) {
        return callback(
          null,
          true
        );
      }

      return callback(
        new Error(
          'CORS: Origin not allowed'
        )
      );
    },
    credentials: true,
  })
);

// ============================================================
// GENERAL MIDDLEWARE
// ============================================================

app.use(
  morgan(
    env.nodeEnv ===
      'production'
      ? 'combined'
      : 'dev'
  )
);

app.use(
  express.json({
    limit: '2mb',
  })
);

// ============================================================
// STATIC FILES
// ============================================================

app.use(
  '/uploads',
  express.static(
    path.join(
      __dirname,
      '../uploads'
    )
  )
);

// ============================================================
// HEALTH CHECK
// ============================================================

app.get(
  '/',
  (
    req: Request,
    res: Response
  ) => {
    res.status(200).json({
      success: true,
      message:
        '🚀 TaskFlow Backend is running',
      version: '1.0.0',
      environment:
        env.nodeEnv,
    });
  }
);

// ============================================================
// API ROUTES
// ============================================================

app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api/projects',
  projectRoutes
);

app.use(
  '/api/tasks',
  taskRoutes
);

app.use(
  '/api/users',
  userRoutes
);

app.use(
  '/api/chat',
  chatRoutes
);

app.use(
  '/api/notifications',
  notificationRoutes
);

// ============================================================
// ERROR HANDLER
// MUST REMAIN LAST
// ============================================================

app.use(
  errorHandler
);

module.exports = app;

export {};