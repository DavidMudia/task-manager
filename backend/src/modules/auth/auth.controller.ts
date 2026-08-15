import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/auth';

const AuthService = require('./auth.service');
const authService = new AuthService();

const register = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result =
      await authService.register(
        req.body
      );

    res.status(201).json(result);
  } catch (error: any) {
    console.error(
      'Registration error:',
      error
    );

    // --------------------------------------------------------
    // Zod validation errors
    // --------------------------------------------------------

    if (error?.name === 'ZodError') {
      const firstIssue =
        error.issues?.[0];

      return res.status(400).json({
        error:
          firstIssue?.message ||
          'Invalid registration details.',
      });
    }

    // --------------------------------------------------------
    // Known application errors
    // --------------------------------------------------------

    if (error instanceof Error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(400).json({
      error:
        'Unable to create your account.',
    });
  }
};

const login = async (req: AuthRequest, res: Response) => {
  try {
    const result = await authService.login(req.body);

    res.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';

    res.status(401).json({
      error: message,
    });
  }
};

const getProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = await authService.getProfile(req.user!.id);

    res.json(user);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';

    res.status(404).json({
      error: message,
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};

export {};
