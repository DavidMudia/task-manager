const prisma = require('../../utils/prisma');

class ChatService {
  // ============================================================
  // ============================================================
  // PRIVATE / DIRECT CONVERSATIONS
  // ============================================================
  // ============================================================

  // ============================================================
  // CREATE / GET PRIVATE CONVERSATION
  // ============================================================

  async getOrCreateConversation(
    currentUserId: string,
    otherUserId: string
  ) {
    if (!currentUserId || !otherUserId) {
      throw new Error('Both user IDs are required');
    }

    if (currentUserId === otherUserId) {
      throw new Error(
        'You cannot start a conversation with yourself'
      );
    }

    const otherUser = await prisma.user.findUnique({
      where: {
        id: otherUserId,
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
    });

    if (!otherUser) {
      throw new Error('User not found');
    }

    const existingConversation =
      await prisma.conversation.findFirst({
        where: {
          AND: [
            {
              participants: {
                some: {
                  userId: currentUserId,
                },
              },
            },
            {
              participants: {
                some: {
                  userId: otherUserId,
                },
              },
            },
          ],
        },

        include: {
          participants: {
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
          },

          messages: {
            orderBy: {
              createdAt: 'desc',
            },

            take: 1,

            select: {
              id: true,
              content: true,
              createdAt: true,
              senderId: true,
              read: true,
            },
          },

          _count: {
            select: {
              messages: {
                where: {
                  senderId: {
                    not: currentUserId,
                  },
                  read: false,
                },
              },
            },
          },
        },
      });

    if (existingConversation) {
      return {
        ...existingConversation,
        unreadCount:
          existingConversation._count.messages,
      };
    }

    const conversation =
      await prisma.conversation.create({
        data: {
          participants: {
            create: [
              {
                userId: currentUserId,
              },
              {
                userId: otherUserId,
              },
            ],
          },
        },

        include: {
          participants: {
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
          },

          messages: true,

          _count: {
            select: {
              messages: {
                where: {
                  senderId: {
                    not: currentUserId,
                  },
                  read: false,
                },
              },
            },
          },
        },
      });

    return {
      ...conversation,
      unreadCount: 0,
    };
  }

  // ============================================================
  // GET ALL PRIVATE CONVERSATIONS
  // ============================================================

  async getConversations(userId: string) {
    const conversations =
      await prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              userId,
            },
          },
        },

        orderBy: {
          updatedAt: 'desc',
        },

        include: {
          participants: {
            where: {
              userId: {
                not: userId,
              },
            },

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
          },

          messages: {
            orderBy: {
              createdAt: 'desc',
            },

            take: 1,

            select: {
              id: true,
              content: true,
              createdAt: true,
              senderId: true,
              read: true,
            },
          },

          _count: {
            select: {
              messages: {
                where: {
                  senderId: {
                    not: userId,
                  },
                  read: false,
                },
              },
            },
          },
        },
      });

    return conversations.map(
      (conversation: any) => ({
        id: conversation.id,

        createdAt:
          conversation.createdAt,

        updatedAt:
          conversation.updatedAt,

        participant:
          conversation
            .participants[0]?.user || null,

        lastMessage:
          conversation.messages[0] || null,

        unreadCount:
          conversation._count?.messages || 0,
      })
    );
  }

  // ============================================================
  // GET SINGLE PRIVATE CONVERSATION
  // ============================================================

  async getConversation(
    conversationId: string,
    userId: string
  ) {
    const conversation =
      await prisma.conversation.findFirst({
        where: {
          id: conversationId,

          participants: {
            some: {
              userId,
            },
          },
        },

        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  email: true,
                  avatarUrl: true,
                  createdAt: true,
                },
              },
            },
          },

          _count: {
            select: {
              messages: {
                where: {
                  senderId: {
                    not: userId,
                  },
                  read: false,
                },
              },
            },
          },
        },
      });

    if (!conversation) {
      throw new Error(
        'Conversation not found'
      );
    }

    return {
      ...conversation,
      unreadCount:
        conversation._count?.messages || 0,
    };
  }

  // ============================================================
  // GET PRIVATE CONVERSATION MESSAGES
  // ============================================================

  async getMessages(
    conversationId: string,
    userId: string,
    limit: number = 50
  ) {
    await this.verifyParticipant(
      conversationId,
      userId
    );

    return prisma.directMessage.findMany({
      where: {
        conversationId,
      },

      orderBy: {
        createdAt: 'asc',
      },

      take: limit,

      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  // ============================================================
  // SEND PRIVATE MESSAGE
  // ============================================================

  async sendMessage(
    conversationId: string,
    userId: string,
    content: string
  ) {
    await this.verifyParticipant(
      conversationId,
      userId
    );

    const trimmedContent =
      content.trim();

    if (!trimmedContent) {
      throw new Error(
        'Message cannot be empty'
      );
    }

    if (trimmedContent.length > 5000) {
      throw new Error(
        'Message cannot exceed 5000 characters'
      );
    }

    const message =
      await prisma.directMessage.create({
        data: {
          content: trimmedContent,
          conversationId,
          senderId: userId,
        },

        include: {
          sender: {
            select: {
              id: true,
              username: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      });

    await prisma.conversation.update({
      where: {
        id: conversationId,
      },

      data: {
        updatedAt: new Date(),
      },
    });

    return message;
  }

  // ============================================================
  // MARK PRIVATE MESSAGES AS READ
  // ============================================================

  async markMessagesAsRead(
    conversationId: string,
    userId: string
  ) {
    await this.verifyParticipant(
      conversationId,
      userId
    );

    return prisma.directMessage.updateMany({
      where: {
        conversationId,

        senderId: {
          not: userId,
        },

        read: false,
      },

      data: {
        read: true,
      },
    });
  }

  // ============================================================
  // DELETE PRIVATE MESSAGE
  // ============================================================

  async deleteMessage(
    messageId: string,
    userId: string
  ) {
    const message =
      await prisma.directMessage.findFirst({
        where: {
          id: messageId,
          senderId: userId,
        },
      });

    if (!message) {
      throw new Error(
        'Message not found or you are not allowed to delete it'
      );
    }

    return prisma.directMessage.delete({
      where: {
        id: messageId,
      },
    });
  }

  // ============================================================
  // VERIFY PRIVATE CONVERSATION PARTICIPANT
  // ============================================================

  async verifyParticipant(
    conversationId: string,
    userId: string
  ) {
    const participant =
      await prisma.conversationParticipant.findFirst({
        where: {
          conversationId,
          userId,
        },
      });

    if (!participant) {
      throw new Error(
        'You are not a participant in this conversation'
      );
    }

    return participant;
  }

  // ============================================================
  // ============================================================
  // PROJECT / GROUP CHAT
  // ============================================================
  // ============================================================

  // ============================================================
  // VERIFY PROJECT ACCESS
  // ============================================================

  async verifyProjectAccess(
    projectId: string,
    userId: string
  ) {
    if (!projectId || !userId) {
      throw new Error(
        'Project ID and user ID are required'
      );
    }

    const project =
      await prisma.project.findUnique({
        where: {
          id: projectId,
        },

        select: {
          id: true,
          ownerId: true,
          members: {
            where: {
              userId,
            },

            select: {
              id: true,
              userId: true,
              role: true,
            },
          },
        },
      });

    if (!project) {
      throw new Error(
        'Project not found'
      );
    }

    // Project owner always has access
    if (project.ownerId === userId) {
      return {
        hasAccess: true,
        role: 'owner',
        project,
      };
    }

    // Project member has access
    const membership =
      project.members[0];

    if (!membership) {
      throw new Error(
        'You are not a member of this project'
      );
    }

    return {
      hasAccess: true,
      role: membership.role,
      project,
    };
  }

  // ============================================================
  // GET PROJECT CHAT MESSAGES
  // ============================================================

  async getProjectMessages(
    projectId: string,
    userId: string,
    limit: number = 50
  ) {
    await this.verifyProjectAccess(
      projectId,
      userId
    );

    return prisma.message.findMany({
      where: {
        projectId,
      },

      orderBy: {
        createdAt: 'asc',
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
      },
    });
  }

  // ============================================================
  // CREATE PROJECT CHAT MESSAGE
  // ============================================================

  async createMessage(
    projectId: string,
    userId: string,
    content: string
  ) {
    await this.verifyProjectAccess(
      projectId,
      userId
    );

    const trimmedContent =
      content.trim();

    if (!trimmedContent) {
      throw new Error(
        'Message cannot be empty'
      );
    }

    if (trimmedContent.length > 5000) {
      throw new Error(
        'Message cannot exceed 5000 characters'
      );
    }

    return prisma.message.create({
      data: {
        content: trimmedContent,
        projectId,
        userId,
      },

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
    });
  }
}

module.exports = {
  ChatService,
};

export {};