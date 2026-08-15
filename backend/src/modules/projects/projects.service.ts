const prisma = require('../../utils/prisma');
const { projectSchema } = require('./projects.schema');
const { randomBytes } = require('crypto');

class ProjectsService {
  // ============================================================
  // HELPERS
  // ============================================================

  async requireProjectAccess(
    projectId: string,
    userId: string
  ) {
    const project =
      await prisma.project.findFirst({
        where: {
          id: projectId,
          OR: [
            {
              ownerId: userId,
            },
            {
              members: {
                some: {
                  userId,
                },
              },
            },
          ],
        },
      });

    if (!project) {
      throw new Error(
        'Project not found or you do not have access'
      );
    }

    return project;
  }

  async requireProjectOwner(
    projectId: string,
    userId: string
  ) {
    const project =
      await prisma.project.findFirst({
        where: {
          id: projectId,
          ownerId: userId,
        },
      });

    if (!project) {
      throw new Error(
        'Project not found or you are not the owner'
      );
    }

    return project;
  }

  // ============================================================
  // PROJECT CRUD
  // ============================================================

  async create(data: {
    name: string;
    description?: string;
    maxMembers?: number;
    ownerId: string;
  }) {
    const parsed =
      projectSchema.parse(data);

    const project =
      await prisma.project.create({
        data: {
  name: parsed.name,
  description: parsed.description ?? null,
  maxMembers: parsed.maxMembers ?? 20,
  ownerId: data.ownerId,
},
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              name: true,
              email: true,
            },
          },
          tasks: true,
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

    return project;
  }

  async findAll(userId: string) {
    return prisma.project.findMany({
      where: {
        OR: [
          {
            ownerId: userId,
          },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
        tasks: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(
    id: string,
    userId: string
  ) {
    return prisma.project.findFirst({
      where: {
        id,
        OR: [
          {
            ownerId: userId,
          },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
        tasks: {
          include: {
            assignees: {
              select: {
                id: true,
                username: true,
                name: true,
                email: true,
              },
            },
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async update(
    id: string,
    userId: string,
    data: {
      name?: string;
      description?: string;
      maxMembers?: number;
    }
  ) {
    await this.requireProjectOwner(
      id,
      userId
    );

    const parsed =
      projectSchema
        .partial()
        .parse(data);

    return prisma.project.update({
      where: {
        id,
      },
      data: parsed,
    });
  }

  async delete(
    id: string,
    userId: string
  ) {
    await this.requireProjectOwner(
      id,
      userId
    );

    return prisma.project.delete({
      where: {
        id,
      },
    });
  }

  // ============================================================
  // MEMBERS
  // ============================================================

  async addMember(
    projectId: string,
    currentUserId: string,
    memberUserId: string,
    role: string = 'member'
  ) {
    const project =
      await this.requireProjectOwner(
        projectId,
        currentUserId
      );

    const validRoles = [
      'admin',
      'manager',
      'member',
      'viewer',
    ];

    if (!validRoles.includes(role)) {
      throw new Error(
        'Invalid project member role'
      );
    }

    const memberCount =
      await prisma.projectMember.count({
        where: {
          projectId,
        },
      });

    if (
      memberCount >= project.maxMembers
    ) {
      throw new Error(
        'Project has reached its maximum number of members'
      );
    }

    if (
      project.ownerId === memberUserId
    ) {
      throw new Error(
        'The project owner is already the owner of this project'
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: memberUserId,
        },
      });

    if (!user) {
      throw new Error(
        'User not found'
      );
    }

    const existingMember =
      await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: memberUserId,
            projectId,
          },
        },
      });

    if (existingMember) {
      throw new Error(
        'User is already a member of this project'
      );
    }

    return prisma.projectMember.create({
      data: {
        projectId,
        userId: memberUserId,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async removeMember(
    projectId: string,
    userIdToRemove: string,
    currentUserId: string
  ) {
    await this.requireProjectOwner(
      projectId,
      currentUserId
    );

    const member =
      await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: userIdToRemove,
            projectId,
          },
        },
      });

    if (!member) {
      throw new Error(
        'Project member not found'
      );
    }

    return prisma.projectMember.delete({
      where: {
        userId_projectId: {
          userId: userIdToRemove,
          projectId,
        },
      },
    });
  }

  async getMembers(
  projectId: string,
  currentUserId: string
) {
  await this.requireProjectAccess(
    projectId,
    currentUserId
  );

  const project =
    await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        ownerId: true,

        owner: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },

        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            joinedAt: 'asc',
          },
        },
      },
    });

  if (!project) {
    throw new Error(
      'Project not found'
    );
  }

  // ============================================================
  // PROJECT OWNER
  // ============================================================

  const owner = {
    id: `owner-${project.owner.id}`,
    userId: project.owner.id,
    role: 'owner',
    joinedAt: new Date(0).toISOString(),
    user: project.owner,
  };

  // ============================================================
  // PROJECT MEMBERS
  // ============================================================

  return [
    owner,
    ...project.members,
  ];
}
   // ============================================================
  // INVITATIONS
  // ============================================================

  /**
   * Create a project invitation.
   *
   * Invitations are only created for registered users.
   * The recipientId is stored so invitations can appear
   * directly inside the recipient's invitation center.
   */
  async createInvitation(
    projectId: string,
    senderId: string,
    email: string,
    role: string = 'member'
  ) {
    const project =
      await this.requireProjectOwner(
        projectId,
        senderId
      );

    const normalizedEmail =
      email.trim().toLowerCase();

    if (
      !normalizedEmail ||
      !normalizedEmail.includes('@')
    ) {
      throw new Error(
        'A valid email address is required'
      );
    }

    const validRoles = [
      'admin',
      'manager',
      'member',
      'viewer',
    ];

    if (!validRoles.includes(role)) {
      throw new Error(
        'Invalid invitation role'
      );
    }

    // ----------------------------------------------------------
    // CHECK PROJECT CAPACITY
    // ----------------------------------------------------------

    const memberCount =
      await prisma.projectMember.count({
        where: {
          projectId,
        },
      });

    if (
      memberCount >= project.maxMembers
    ) {
      throw new Error(
        'Project has reached its maximum number of members'
      );
    }

    // ----------------------------------------------------------
    // FIND RECIPIENT
    // ----------------------------------------------------------

    const recipient =
      await prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      });

    if (!recipient) {
      throw new Error(
        'No registered user exists with this email address'
      );
    }

    // ----------------------------------------------------------
    // PREVENT SELF INVITATION
    // ----------------------------------------------------------

    if (
      recipient.id === project.ownerId
    ) {
      throw new Error(
        'The project owner cannot be invited'
      );
    }

    if (
      recipient.id === senderId
    ) {
      throw new Error(
        'You cannot invite yourself to your own project'
      );
    }

    // ----------------------------------------------------------
    // CHECK EXISTING MEMBER
    // ----------------------------------------------------------

    const existingMember =
      await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: recipient.id,
            projectId,
          },
        },
      });

    if (existingMember) {
      throw new Error(
        'User is already a member of this project'
      );
    }

    // ----------------------------------------------------------
    // CHECK EXISTING PENDING INVITATION
    // ----------------------------------------------------------

    const existingInvitation =
      await prisma.invitation.findFirst({
        where: {
          projectId,
          status: 'pending',
          OR: [
            {
              recipientId: recipient.id,
            },
            {
              email: normalizedEmail,
            },
          ],
        },
      });

    if (existingInvitation) {
      throw new Error(
        'A pending invitation already exists for this user'
      );
    }

    // ----------------------------------------------------------
    // CREATE SECURE TOKEN
    // ----------------------------------------------------------

    const token =
      randomBytes(32).toString('hex');

    const expiresAt =
      new Date();

    expiresAt.setDate(
      expiresAt.getDate() + 7
    );

    // ----------------------------------------------------------
    // CREATE INVITATION
    // ----------------------------------------------------------

    const invitation =
      await prisma.invitation.create({
        data: {
          email: normalizedEmail,
          role,
          token,
          expiresAt,
          projectId,
          senderId,
          recipientId: recipient.id,
          status: 'pending',
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              avatarUrl: true,
            },
          },
          recipient: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      });

    // Never expose the invitation token to normal
    // invitation-center responses.
    const {
      token: _token,
      ...safeInvitation
    } = invitation;

    return safeInvitation;
  }

  // ============================================================
  // GET MY PENDING INVITATIONS
  // ============================================================

  async getMyInvitations(
    userId: string
  ) {
    const invitations =
      await prisma.invitation.findMany({
        where: {
          recipientId: userId,
          status: 'pending',
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              description: true,
              maxMembers: true,
              status: true,
              owner: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  email: true,
                  avatarUrl: true,
                },
              },
            },
          },
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    // ----------------------------------------------------------
    // HANDLE EXPIRED INVITATIONS
    // ----------------------------------------------------------

    const now = new Date();

    const activeInvitations = [];

    for (const invitation of invitations) {
      if (invitation.expiresAt < now) {
        await prisma.invitation.update({
          where: {
            id: invitation.id,
          },
          data: {
            status: 'expired',
          },
        });

        continue;
      }

      activeInvitations.push(invitation);
    }

    return activeInvitations;
  }

  // ============================================================
  // GET INVITATION BY ID
  // ============================================================

  async getInvitation(
    invitationId: string,
    userId: string
  ) {
    const invitation =
      await prisma.invitation.findFirst({
        where: {
          id: invitationId,
          recipientId: userId,
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              description: true,
              maxMembers: true,
              status: true,
              owner: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  email: true,
                  avatarUrl: true,
                },
              },
            },
          },
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              avatarUrl: true,
            },
          },
          recipient: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      });

    if (!invitation) {
      throw new Error(
        'Invitation not found'
      );
    }

    return invitation;
  }

  // ============================================================
  // ACCEPT INVITATION
  // ============================================================

  async acceptInvitation(
    token: string,
    userId: string
  ) {
    const invitation =
      await prisma.invitation.findUnique({
        where: {
          token,
        },
        include: {
          project: true,
        },
      });

    if (!invitation) {
      throw new Error(
        'Invalid invitation'
      );
    }

    if (
      invitation.status !== 'pending'
    ) {
      throw new Error(
        'Invitation has already been processed'
      );
    }

    if (
      invitation.expiresAt < new Date()
    ) {
      await prisma.invitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: 'expired',
        },
      });

      throw new Error(
        'Invitation has expired'
      );
    }

    // ----------------------------------------------------------
    // VERIFY RECIPIENT
    // ----------------------------------------------------------

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
        },
      });

    if (!user) {
      throw new Error(
        'User not found'
      );
    }

    if (
      invitation.recipientId &&
      invitation.recipientId !== userId
    ) {
      throw new Error(
        'You are not authorized to accept this invitation'
      );
    }

    if (
      invitation.email.toLowerCase() !==
      user.email.toLowerCase()
    ) {
      throw new Error(
        'This invitation is for a different email'
      );
    }

    // ----------------------------------------------------------
    // CHECK PROJECT CAPACITY
    // ----------------------------------------------------------

    const memberCount =
      await prisma.projectMember.count({
        where: {
          projectId:
            invitation.projectId,
        },
      });

    if (
      memberCount >=
      invitation.project.maxMembers
    ) {
      throw new Error(
        'Project has reached its maximum number of members'
      );
    }

    // ----------------------------------------------------------
    // CHECK EXISTING MEMBERSHIP
    // ----------------------------------------------------------

    const existingMember =
      await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId:
              invitation.projectId,
          },
        },
      });

    if (existingMember) {
      throw new Error(
        'You are already a member of this project'
      );
    }

    // ----------------------------------------------------------
    // CREATE MEMBER + ACCEPT INVITATION
    // ----------------------------------------------------------

    const result =
      await prisma.$transaction(
        async (tx: any) => {
          await tx.projectMember.create({
            data: {
              projectId:
                invitation.projectId,
              userId,
              role: invitation.role,
            },
          });

          return tx.invitation.update({
            where: {
              id: invitation.id,
            },
            data: {
              status: 'accepted',
              recipientId: userId,
            },
            include: {
              project: {
                select: {
                  id: true,
                  name: true,
                },
              },
              sender: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  email: true,
                  avatarUrl: true,
                },
              },
              recipient: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  email: true,
                  avatarUrl: true,
                },
              },
            },
          });
        }
      );

    return result;
  }

  // ============================================================
  // REJECT / DECLINE INVITATION
  // ============================================================

  async rejectInvitation(
    invitationId: string,
    userId: string
  ) {
    const invitation =
      await prisma.invitation.findUnique({
        where: {
          id: invitationId,
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              avatarUrl: true,
            },
          },
          recipient: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      });

    if (!invitation) {
      throw new Error(
        'Invitation not found'
      );
    }

    if (
      invitation.recipientId !== userId
    ) {
      throw new Error(
        'You are not authorized to reject this invitation'
      );
    }

    if (
      invitation.status !== 'pending'
    ) {
      throw new Error(
        'Invitation has already been processed'
      );
    }

    if (
      invitation.expiresAt < new Date()
    ) {
      await prisma.invitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: 'expired',
        },
      });

      throw new Error(
        'Invitation has expired'
      );
    }

    return prisma.invitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        status: 'declined',
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            avatarUrl: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  // ============================================================
  // GET INVITATION HISTORY
  // ============================================================

  async getInvitationHistory(
    userId: string
  ) {
    return prisma.invitation.findMany({
      where: {
        recipientId: userId,
        status: {
          in: [
            'accepted',
            'declined',
            'expired',
          ],
        },
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            avatarUrl: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // ============================================================
  // ACTIVITIES
  // ============================================================

  async getActivities(
    projectId: string,
    currentUserId: string,
    limit: number = 50
  ) {
    await this.requireProjectAccess(
      projectId,
      currentUserId
    );

    return prisma.activity.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        task: true,
      },
    });
  }

  async logActivity(
    projectId: string,
    userId: string,
    type: string,
    message: string,
    taskId?: string
  ) {
    return prisma.activity.create({
      data: {
        projectId,
        userId,
        type,
        message,
        taskId: taskId ?? null,
      },
    });
  }
}

module.exports = {
  ProjectsService,
};

export {};