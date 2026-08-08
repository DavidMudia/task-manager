import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,

  jwtSecret:
    process.env.JWT_SECRET || 'default-secret',

  databaseUrl:
    process.env.DATABASE_URL,

  frontendUrl:
    process.env.FRONTEND_URL || 'http://localhost:5173',

  nodeEnv:
    process.env.NODE_ENV || 'development',
};