import type { Request, Response, NextFunction } from 'express';

const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  name?: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      env.jwtSecret
    ) as AuthUser;

    if (!decoded.id || !decoded.email || !decoded.username) {
      return res.status(401).json({
        error: 'Invalid token payload',
      });
    }

    req.user = decoded;

    next();
  } catch {
    return res.status(401).json({
      error: 'Invalid or expired token',
    });
  }
};

// Socket.IO authentication
export const verifySocketToken = (token: string) => {
  const decoded = jwt.verify(
    token,
    env.jwtSecret
  ) as AuthUser;

  if (!decoded.id || !decoded.email || !decoded.username) {
    throw new Error('Invalid token payload');
  }

  return decoded;
};
