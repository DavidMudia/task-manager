import type { Request, Response } from 'express';

const prisma = require('../../utils/prisma');
const { TasksService } = require('./tasks.service');

const {
  NotificationsService,
} = require('../notifications/notification.service');

const {
  emitNotification,
} = require('../notifications/notification.socket');

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
  file?: Express.Multer.File;
}

const tasksService = new TasksService();
const notificationsService =
  new NotificationsService();

/**
 * Express 5 can type route params as string | string[].
 * This helper guarantees that we always work with a string.
 */
const getId = (
  id: string | string[] | undefined
): string => {
  if (typeof id === 'string') {
    return id;
  }

  if (Array.isArray(id) && id.length > 0) {
    return id[0];
  }

  throw new Error('Invalid route parameter');
};

/**
 * Get the authenticated user's ID.
 */
const getCurrentUserId = (
  req: AuthRequest
): string => {
  if (!req.user?.id) {
    throw new Error('Authentication required');
  }

  return req.user.id;
};

/**
 * Log task activity.
 */
async function logTaskActivity(
  taskId: string,
  userId: string,
  type: string,
  message: string
) {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!task) {
    return;
  }

  await prisma.activity.create({
    data: {
      projectId: task.projectId,
      userId,
      type,
      message,
      taskId,
    },
  });
}

/**
 * Create and emit a notification.
 */
async function notifyUser(
  userId: string,
  data: {
    type: string;
    message: string;
    projectId?: string;
    taskId?: string;
  }
) {
  const notification =
    await notificationsService.create({
      userId,
      type: data.type,
      message: data.message,
      projectId: data.projectId,
      taskId: data.taskId,
    });

  emitNotification(
    userId,
    notification
  );

  return notification;
}

/**
 * Notify multiple users.
 */
async function notifyUsers(
  userIds: string[],
  data: {
    type: string;
    message: string;
    projectId?: string;
    taskId?: string;
  }
) {
  const uniqueUserIds = [
    ...new Set(userIds),
  ];

  await Promise.all(
    uniqueUserIds.map((userId) =>
      notifyUser(userId, data)
    )
  );
}

// ============================================================
// TASK CRUD
// ============================================================

const createTask = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const currentUserId =
      getCurrentUserId(req);

    const task =
      await tasksService.create(req.body);

    await logTaskActivity(
      task.id,
      currentUserId,
      'task_created',
      `Created task: ${task.title}`
    );

    if (
      task.assignees &&
      task.assignees.length > 0
    ) {
      const assigneeIds =
        task.assignees
          .map(
            (user: { id: string }) =>
              user.id
          )
          .filter(
            (userId: string) =>
              userId !== currentUserId
          );

      if (assigneeIds.length > 0) {
        await notifyUsers(
          assigneeIds,
          {
            type: 'task_assigned',
            message: `You were assigned to task: ${task.title}`,
            projectId: task.projectId,
            taskId: task.id,
          }
        );
      }
    }

    res.status(201).json(task);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(400).json({
      error: message,
    });
  }
};

const getTasks = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projectId =
      typeof req.query.projectId === 'string'
        ? req.query.projectId
        : undefined;

    const userId =
      typeof req.query.userId === 'string'
        ? req.query.userId
        : undefined;

    const tasks =
      await tasksService.findAll(
        projectId,
        userId
      );

    res.json(tasks);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(500).json({
      error: message,
    });
  }
};

const getTask = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const taskId =
      getId(req.params.id);

    const task =
      await tasksService.findOne(taskId);

    if (!task) {
      return res.status(404).json({
        error: 'Task not found',
      });
    }

    res.json(task);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(500).json({
      error: message,
    });
  }
};

const updateTask = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const currentUserId =
      getCurrentUserId(req);

    const taskId =
      getId(req.params.id);

    const existingTask =
      await prisma.task.findUnique({
        where: {
          id: taskId,
        },
        include: {
          assignees: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
        },
      });

    if (!existingTask) {
      return res.status(404).json({
        error: 'Task not found',
      });
    }

    const task =
      await tasksService.update(
        taskId,
        req.body
      );

    await logTaskActivity(
      taskId,
      currentUserId,
      'task_updated',
      `Updated task: ${task.title}`
    );

    if (
      req.body.assigneeIds !== undefined
    ) {
      const previousAssigneeIds =
        existingTask.assignees.map(
          (user: { id: string }) =>
            user.id
        );

      const newAssigneeIds =
        task.assignees.map(
          (user: { id: string }) =>
            user.id
        );

      const newlyAssigned =
        newAssigneeIds.filter(
          (userId: string) =>
            !previousAssigneeIds.includes(
              userId
            ) &&
            userId !== currentUserId
        );

      if (newlyAssigned.length > 0) {
        await notifyUsers(
          newlyAssigned,
          {
            type: 'task_assigned',
            message: `You were assigned to task: ${task.title}`,
            projectId: task.projectId,
            taskId: task.id,
          }
        );
      }
    }

    if (
      req.body.status !== undefined &&
      req.body.status !==
        existingTask.status
    ) {
      const assigneeIds =
        task.assignees
          .map(
            (user: { id: string }) =>
              user.id
          )
          .filter(
            (userId: string) =>
              userId !== currentUserId
          );

      if (assigneeIds.length > 0) {
        await notifyUsers(
          assigneeIds,
          {
            type: 'task_status_changed',
            message: `Task "${task.title}" status changed to ${task.status}`,
            projectId: task.projectId,
            taskId: task.id,
          }
        );
      }
    }

    res.json(task);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(400).json({
      error: message,
    });
  }
};

const deleteTask = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const currentUserId =
      getCurrentUserId(req);

    const taskId =
      getId(req.params.id);

    const existingTask =
      await prisma.task.findUnique({
        where: {
          id: taskId,
        },
        include: {
          assignees: {
            select: {
              id: true,
            },
          },
        },
      });

    if (!existingTask) {
      return res.status(404).json({
        error: 'Task not found',
      });
    }

    await tasksService.delete(taskId);

    await logTaskActivity(
      taskId,
      currentUserId,
      'task_deleted',
      'Deleted task'
    ).catch(() => {});

    const assigneeIds =
      existingTask.assignees
        .map(
          (user: { id: string }) =>
            user.id
        )
        .filter(
          (userId: string) =>
            userId !== currentUserId
        );

    if (assigneeIds.length > 0) {
      await notifyUsers(
        assigneeIds,
        {
          type: 'task_deleted',
          message:
            'A task assigned to you was deleted.',
          projectId:
            existingTask.projectId,
          taskId,
        }
      );
    }

    res.status(204).send();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(400).json({
      error: message,
    });
  }
};

// ============================================================
// SUBTASKS
// ============================================================

const createSubtask = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const currentUserId =
      getCurrentUserId(req);

    const taskId =
      getId(req.params.taskId);

    const subtask =
      await tasksService.createSubtask(
        taskId,
        req.body
      );

    await logTaskActivity(
      taskId,
      currentUserId,
      'subtask_added',
      `Added subtask: ${subtask.text}`
    );

    res.status(201).json(subtask);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(400).json({
      error: message,
    });
  }
};

const updateSubtask = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const subtaskId =
      getId(req.params.subtaskId);

    const subtask =
      await tasksService.updateSubtask(
        subtaskId,
        req.body
      );

    res.json(subtask);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(400).json({
      error: message,
    });
  }
};

const deleteSubtask = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const subtaskId =
      getId(req.params.subtaskId);

    await tasksService.deleteSubtask(
      subtaskId
    );

    res.status(204).send();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(400).json({
      error: message,
    });
  }
};

const getSubtasks = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const taskId =
      getId(req.params.taskId);

    const subtasks =
      await tasksService.getSubtasks(
        taskId
      );

    res.json(subtasks);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(500).json({
      error: message,
    });
  }
};

// ============================================================
// COMMENTS
// ============================================================

const createComment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const currentUserId =
      getCurrentUserId(req);

    const taskId =
      getId(req.params.taskId);

    const comment =
      await tasksService.createComment(
        taskId,
        currentUserId,
        req.body
      );

    await logTaskActivity(
      taskId,
      currentUserId,
      'comment_added',
      'Added a comment'
    );

    const task =
      await prisma.task.findUnique({
        where: {
          id: taskId,
        },
        include: {
          assignees: {
            select: {
              id: true,
            },
          },
        },
      });

    if (task) {
      const assigneeIds =
        task.assignees
          .map(
            (user: { id: string }) =>
              user.id
          )
          .filter(
            (userId: string) =>
              userId !== currentUserId
          );

      if (assigneeIds.length > 0) {
        await notifyUsers(
          assigneeIds,
          {
            type: 'comment_added',
            message:
              'A new comment was added to a task assigned to you.',
            projectId: task.projectId,
            taskId,
          }
        );
      }
    }

    res.status(201).json(comment);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(400).json({
      error: message,
    });
  }
};

const getComments = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const taskId =
      getId(req.params.taskId);

    const comments =
      await tasksService.getComments(
        taskId
      );

    res.json(comments);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(500).json({
      error: message,
    });
  }
};

const updateComment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const commentId =
      getId(req.params.commentId);

    const { content } = req.body;

    const comment =
      await tasksService.updateComment(
        commentId,
        content
      );

    res.json(comment);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(400).json({
      error: message,
    });
  }
};

const deleteComment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const commentId =
      getId(req.params.commentId);

    await tasksService.deleteComment(
      commentId
    );

    res.status(204).send();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(400).json({
      error: message,
    });
  }
};

// ============================================================
// ATTACHMENTS
// ============================================================

const uploadAttachment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const currentUserId =
      getCurrentUserId(req);

    const taskId =
      getId(req.params.taskId);

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: 'No file uploaded',
      });
    }

    const attachment =
      await tasksService.createAttachment(
        taskId,
        currentUserId,
        {
          filename: file.originalname,
          fileUrl: `/uploads/${file.filename}`,
          fileSize: file.size,
          mimeType: file.mimetype,
        }
      );

    res.status(201).json(attachment);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(400).json({
      error: message,
    });
  }
};

const getAttachments = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const taskId =
      getId(req.params.taskId);

    const attachments =
      await tasksService.getAttachments(
        taskId
      );

    res.json(attachments);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(500).json({
      error: message,
    });
  }
};

const deleteAttachment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const attachmentId =
      getId(req.params.attachmentId);

    await tasksService.deleteAttachment(
      attachmentId
    );

    res.status(204).send();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(400).json({
      error: message,
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,

  getSubtasks,
  createSubtask,
  updateSubtask,
  deleteSubtask,

  createComment,
  getComments,
  updateComment,
  deleteComment,

  uploadAttachment,
  getAttachments,
  deleteAttachment,
};

export {};