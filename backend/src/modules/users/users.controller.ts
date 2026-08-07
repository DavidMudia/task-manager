import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/auth';

const prisma = require('../../utils/prisma');

const getPublicUserSelect = {
  id: true,
  username: true,
  name: true,
  bio: true,
  avatarUrl: true,
  createdAt: true,
};

const getUsers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const search =
      typeof req.query.search === 'string'
        ? req.query.search.trim()
        : '';

    const users = await prisma.user.findMany({
      where: search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                username: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : undefined,

      select: getPublicUserSelect,

      orderBy: [
        {
          name: 'asc',
        },
        {
          username: 'asc',
        },
      ],

      take: 50,
    });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(500).json({
      error: message,
    });
  }
};

const getUser = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        ...getPublicUserSelect,

        projects: {
          where: {
            status: 'completed',
          },
          select: {
            id: true,
            name: true,
          },
          orderBy: {
            updatedAt: 'desc',
          },
        },

        memberships: {
          where: {
            project: {
              status: 'completed',
            },
          },
          select: {
            project: {
              select: {
                id: true,
                name: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    const completedProjects = [
      ...user.projects,
      ...user.memberships.map(
        (membership: any) => ({
          ...membership.project,
          completedAt: membership.project.updatedAt,
        })
      ),
    ];

    const uniqueProjects = Array.from(
      new Map(
        completedProjects.map(
          (project: any) => [
            project.id,
            project,
          ]
        )
      ).values()
    );

    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      completedProjects: uniqueProjects,
      completedProjectsCount:
        uniqueProjects.length,
    });
  } catch (error) {
    console.error('Get user error:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(500).json({
      error: message,
    });
  }
};

const updateProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;

    const {
      name,
      bio,
    } = req.body;

    if (
      name !== undefined &&
      typeof name !== 'string'
    ) {
      return res.status(400).json({
        error: 'Name must be a string',
      });
    }

    if (
      bio !== undefined &&
      typeof bio !== 'string'
    ) {
      return res.status(400).json({
        error: 'Bio must be a string',
      });
    }

    const updatedUser =
      await prisma.user.update({
        where: {
          id: userId,
        },

        data: {
          ...(name !== undefined && {
            name: name.trim() || null,
          }),

          ...(bio !== undefined && {
            bio: bio.trim() || null,
          }),
        },

        select: getPublicUserSelect,
      });

    res.json(updatedUser);
  } catch (error) {
    console.error(
      'Update profile error:',
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

const uploadAvatar = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Profile picture is required',
      });
    }

    const avatarUrl =
      `/uploads/${req.file.filename}`;

    const user =
      await prisma.user.update({
        where: {
          id: req.user!.id,
        },

        data: {
          avatarUrl,
        },

        select: getPublicUserSelect,
      });

    res.json(user);
  } catch (error) {
    console.error(
      'Upload avatar error:',
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

module.exports = {
  getUsers,
  getUser,
  updateProfile,
  uploadAvatar,
};

export {};