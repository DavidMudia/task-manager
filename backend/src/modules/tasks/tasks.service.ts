const prisma = require('../../utils/prisma');
const { taskSchema } = require('./tasks.schema');

class TasksService {
  // ============================================================
  // TASKS
  // ============================================================

  async create(data: any) {
    const parsed = taskSchema.parse(data);

    const project = await prisma.project.findUnique({
      where: {
        id: parsed.projectId,
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const task = await prisma.task.create({
      data: {
        title: parsed.title,
        description: parsed.description ?? null,
        status: parsed.status ?? 'todo',
        priority: parsed.priority ?? 'medium',
        dueDate: parsed.dueDate
          ? new Date(parsed.dueDate)
          : null,
        projectId: parsed.projectId,

        assignees:
          parsed.assigneeIds &&
          parsed.assigneeIds.length > 0
            ? {
                connect: parsed.assigneeIds.map(
                  (id: string) => ({
                    id,
                  })
                ),
              }
            : undefined,
      },

      include: {
        assignees: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },

        subtasks: true,
      },
    });

    return task;
  }

  async findAll(
    projectId?: string,
    userId?: string
  ) {
    const where: any = {};

    if (projectId) {
      where.projectId = projectId;
    }

    if (userId) {
      where.assignees = {
        some: {
          id: userId,
        },
      };
    }

    return prisma.task.findMany({
      where,

      include: {
        assignees: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },

        subtasks: true,

        _count: {
          select: {
            comments: true,
            attachments: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return prisma.task.findUnique({
      where: {
        id,
      },

      include: {
        assignees: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },

        subtasks: true,

        comments: {
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

          orderBy: {
            createdAt: 'asc',
          },
        },

        attachments: {
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

          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async update(id: string, data: any) {
    const existingTask =
      await prisma.task.findUnique({
        where: {
          id,
        },

        include: {
          assignees: {
            select: {
              id: true,
              username: true,
              name: true,
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

    if (!existingTask) {
      throw new Error('Task not found');
    }

    const updateData: any = {};

    if (data.title !== undefined) {
      updateData.title = data.title;
    }

    if (data.description !== undefined) {
      updateData.description =
        data.description;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    if (data.priority !== undefined) {
      updateData.priority = data.priority;
    }

    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate
        ? new Date(data.dueDate)
        : null;
    }

    if (data.assigneeIds !== undefined) {
      if (!Array.isArray(data.assigneeIds)) {
        throw new Error(
          'assigneeIds must be an array'
        );
      }

      updateData.assignees = {
        set: data.assigneeIds.map(
          (id: string) => ({
            id,
          })
        ),
      };
    }

    const task =
      await prisma.task.update({
        where: {
          id,
        },

        data: updateData,

        include: {
          assignees: {
            select: {
              id: true,
              username: true,
              name: true,
              email: true,
            },
          },

          subtasks: true,
        },
      });

    return task;
  }

  async delete(id: string) {
    const existingTask =
      await prisma.task.findUnique({
        where: {
          id,
        },
      });

    if (!existingTask) {
      throw new Error('Task not found');
    }

    return prisma.task.delete({
      where: {
        id,
      },
    });
  }

  // ============================================================
  // SUBTASKS
  // ============================================================

  async getSubtasks(taskId: string) {
    return prisma.subtask.findMany({
      where: {
        taskId,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async createSubtask(
    taskId: string,
    data: { text: string }
  ) {
    if (
      !data.text ||
      !data.text.trim()
    ) {
      throw new Error(
        'Subtask text is required'
      );
    }

    const task =
      await prisma.task.findUnique({
        where: {
          id: taskId,
        },
      });

    if (!task) {
      throw new Error('Task not found');
    }

    return prisma.subtask.create({
      data: {
        taskId,
        text: data.text.trim(),
      },
    });
  }

  async updateSubtask(
    subtaskId: string,
    data: {
      text?: string;
      done?: boolean;
    }
  ) {
    const existingSubtask =
      await prisma.subtask.findUnique({
        where: {
          id: subtaskId,
        },
      });

    if (!existingSubtask) {
      throw new Error(
        'Subtask not found'
      );
    }

    const updateData: any = {};

    if (data.text !== undefined) {
      if (!data.text.trim()) {
        throw new Error(
          'Subtask text is required'
        );
      }

      updateData.text =
        data.text.trim();
    }

    if (data.done !== undefined) {
      updateData.done = data.done;
    }

    return prisma.subtask.update({
      where: {
        id: subtaskId,
      },

      data: updateData,
    });
  }

  async deleteSubtask(
    subtaskId: string
  ) {
    const existingSubtask =
      await prisma.subtask.findUnique({
        where: {
          id: subtaskId,
        },
      });

    if (!existingSubtask) {
      throw new Error(
        'Subtask not found'
      );
    }

    return prisma.subtask.delete({
      where: {
        id: subtaskId,
      },
    });
  }

  // ============================================================
  // COMMENTS
  // ============================================================

  async createComment(
    taskId: string,
    userId: string,
    data: {
      content: string;
      parentId?: string;
    }
  ) {
    if (
      !data.content ||
      !data.content.trim()
    ) {
      throw new Error(
        'Comment cannot be empty'
      );
    }

    const task =
      await prisma.task.findUnique({
        where: {
          id: taskId,
        },
      });

    if (!task) {
      throw new Error('Task not found');
    }

    if (data.parentId) {
      const parentComment =
        await prisma.comment.findUnique({
          where: {
            id: data.parentId,
          },
        });

      if (!parentComment) {
        throw new Error(
          'Parent comment not found'
        );
      }

      if (
        parentComment.taskId !== taskId
      ) {
        throw new Error(
          'Parent comment belongs to another task'
        );
      }
    }

    return prisma.comment.create({
      data: {
        content: data.content.trim(),
        taskId,
        userId,
        parentId:
          data.parentId || null,
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
      },
    });
  }

  async getComments(taskId: string) {
    return prisma.comment.findMany({
      where: {
        taskId,
        parentId: null,
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

        replies: {
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

          orderBy: {
            createdAt: 'asc',
          },
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async updateComment(
    commentId: string,
    content: string
  ) {
    if (
      !content ||
      !content.trim()
    ) {
      throw new Error(
        'Comment cannot be empty'
      );
    }

    const existingComment =
      await prisma.comment.findUnique({
        where: {
          id: commentId,
        },
      });

    if (!existingComment) {
      throw new Error(
        'Comment not found'
      );
    }

    return prisma.comment.update({
      where: {
        id: commentId,
      },

      data: {
        content: content.trim(),
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
      },
    });
  }

  async deleteComment(
    commentId: string
  ) {
    const existingComment =
      await prisma.comment.findUnique({
        where: {
          id: commentId,
        },
      });

    if (!existingComment) {
      throw new Error(
        'Comment not found'
      );
    }

    return prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  }

  // ============================================================
  // ATTACHMENTS
  // ============================================================

  async createAttachment(
    taskId: string,
    userId: string,
    data: {
      filename: string;
      fileUrl: string;
      fileSize: number;
      mimeType: string;
    }
  ) {
    const task =
      await prisma.task.findUnique({
        where: {
          id: taskId,
        },
      });

    if (!task) {
      throw new Error('Task not found');
    }

    return prisma.attachment.create({
      data: {
        filename: data.filename,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        taskId,
        userId,
      },
    });
  }

  async getAttachments(
    taskId: string
  ) {
    return prisma.attachment.findMany({
      where: {
        taskId,
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
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deleteAttachment(
    attachmentId: string
  ) {
    const existingAttachment =
      await prisma.attachment.findUnique({
        where: {
          id: attachmentId,
        },
      });

    if (!existingAttachment) {
      throw new Error(
        'Attachment not found'
      );
    }

    return prisma.attachment.delete({
      where: {
        id: attachmentId,
      },
    });
  }
}

module.exports = {
  TasksService,
};

export {};