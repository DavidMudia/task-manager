const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../../utils/prisma');
const { env } = require('../../config/env');
const authSchema = require('./auth.schema');

class AuthService {
  async register(data: {
    username: string;
    email: string;
    password: string;
    name?: string;
  }) {
    // Validate input
    const parsed = authSchema.registerSchema.parse(data);

    // Check username
    const existingUsername = await db.user.findUnique({
      where: {
        username: parsed.username,
      },
    });

    if (existingUsername) {
      throw new Error('Username already exists');
    }

    // Check email
    const existingEmail = await db.user.findUnique({
      where: {
        email: parsed.email,
      },
    });

    if (existingEmail) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    // Create user
    const user = await db.user.create({
      data: {
        username: parsed.username,
        email: parsed.email,
        password: hashedPassword,
        name: parsed.name || null,
      },
    });

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
      env.jwtSecret,
      {
        expiresIn: '7d',
      }
    );

    return {
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    };
  }

  async login(data: {
    email: string;
    password: string;
  }) {
    // Validate input
    const parsed = authSchema.loginSchema.parse(data);

    // Find user
    const user = await db.user.findUnique({
      where: {
        email: parsed.email,
      },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      parsed.password,
      user.password
    );

    if (!passwordMatch) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
      env.jwtSecret,
      {
        expiresIn: '7d',
      }
    );

    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

module.exports = AuthService;

export {};