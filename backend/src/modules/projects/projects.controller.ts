import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/auth';

const {
  NotificationsService,
} = require('../notifications/notification.service');

const {
  emitNotification,
} = require('../notifications/notification.socket');

const notificationsService =
  new NotificationsService();
const { ProjectsService } = require('./projects.service');

const projectsService = new ProjectsService();

const getId = (id: string | string[]): string => {
  return typeof id === 'string' ? id : id[0];
};

// ============================================================
// PROJECT CRUD
// ============================================================

const createProject = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const project = await projectsService.create({
      ...req.body,
      ownerId: req.user!.id,
    });

    await projectsService.logActivity(
      project.id,
      req.user!.id,
      'project_created',
      `Project "${project.name}" was created`
    );

    res.status(201).json(project);
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

const getProjects = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projects =
      await projectsService.findAll(
        req.user!.id
      );

    res.json(projects);
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

const getProject = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projectId = getId(req.params.id);

    const project =
      await projectsService.findOne(
        projectId,
        req.user!.id
      );

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
      });
    }

    res.json(project);
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

const updateProject = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projectId = getId(req.params.id);

    const project =
      await projectsService.update(
        projectId,
        req.user!.id,
        req.body
      );

    await projectsService.logActivity(
      projectId,
      req.user!.id,
      'project_updated',
      'Project details were updated'
    );

    res.json(project);
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

const deleteProject = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projectId = getId(req.params.id);

    await projectsService.delete(
      projectId,
      req.user!.id
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
// MEMBERS
// ============================================================

const addMember = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projectId = getId(
      req.params.projectId
    );

    const { userId, role } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'userId is required',
      });
    }

    const member =
  await projectsService.addMember(
    projectId,
    req.user!.id,
    userId,
    role
  );

const notification =
  await notificationsService.create({
    userId,
    type: 'member_added',
    message: `You were added to project "${member.project.name}"`,
    projectId,
  });

emitNotification(userId, notification);

    await projectsService.logActivity(
      projectId,
      req.user!.id,
      'member_added',
      'A new member was added to the project'
    );

    res.status(201).json(member);
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

const removeMember = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projectId = getId(
      req.params.projectId
    );

    const userId = getId(
      req.params.userId
    );

    await projectsService.removeMember(
      projectId,
      userId,
      req.user!.id
    );

    await projectsService.logActivity(
      projectId,
      req.user!.id,
      'member_removed',
      'A project member was removed'
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

const getMembers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projectId = getId(
      req.params.projectId
    );

    const members =
      await projectsService.getMembers(
        projectId,
        req.user!.id
      );

    res.json(members);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(403).json({
      error: message,
    });
  }
};

// ============================================================
// INVITATIONS
// ============================================================

const createInvitation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projectId = getId(req.params.projectId);

    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email is required',
      });
    }

    const invitation =
      await projectsService.createInvitation(
        projectId,
        req.user!.id,
        email,
        role
      );

    // --------------------------------------------------------
    // Notify recipient
    // --------------------------------------------------------

    if (invitation.recipient?.id) {
      const notification =
        await notificationsService.create({
          userId: invitation.recipient.id,
          type: 'project_invitation',
          message: `${invitation.sender.name || invitation.sender.username} invited you to join "${invitation.project.name}"`,
          projectId,
        });

      emitNotification(
        invitation.recipient.id,
        notification
      );
    }

    await projectsService.logActivity(
      projectId,
      req.user!.id,
      'invitation_sent',
      `Invitation sent to ${invitation.email}`
    );

    res.status(201).json(invitation);
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
// GET MY PENDING INVITATIONS
// ============================================================

const getMyInvitations = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    console.log(
      '🔍 getMyInvitations user:',
      req.user
    );

    const invitations =
      await projectsService.getMyInvitations(
        req.user!.id
      );

    console.log(
      '✅ Invitations loaded:',
      invitations
    );

    res.json(invitations);
  } catch (error) {
    console.error(
      '❌ GET MY INVITATIONS ERROR:',
      error
    );

    if (error instanceof Error) {
      console.error(
        'Message:',
        error.message
      );

      console.error(
        'Stack:',
        error.stack
      );
    }

    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Unknown error',
    });
  }
};

// ============================================================
// GET INVITATION HISTORY
// ============================================================

const getInvitationHistory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const history =
      await projectsService.getInvitationHistory(
        req.user!.id
      );

    res.json(history);
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
// ACCEPT INVITATION
// ============================================================

const acceptInvitation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Invitation token is required',
      });
    }

    const result =
      await projectsService.acceptInvitation(
        token,
        req.user!.id
      );

    await projectsService.logActivity(
      result.project.id,
      req.user!.id,
      'member_joined',
      `${req.user!.username} joined the project`
    );

    // --------------------------------------------------------
    // Notify project owner / sender
    // --------------------------------------------------------

    if (result.sender?.id) {
      const notification =
        await notificationsService.create({
          userId: result.sender.id,
          type: 'invitation_accepted',
          message: `${result.recipient.name || result.recipient.username} accepted your invitation to "${result.project.name}"`,
          projectId: result.project.id,
        });

      emitNotification(
        result.sender.id,
        notification
      );
    }

    res.json(result);
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
// REJECT INVITATION
// ============================================================

const rejectInvitation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { invitationId } = req.body;

    if (!invitationId) {
      return res.status(400).json({
        error: 'Invitation ID is required',
      });
    }

    const result =
      await projectsService.rejectInvitation(
        invitationId,
        req.user!.id
      );

    if (result.sender?.id) {
      const notification =
        await notificationsService.create({
          userId: result.sender.id,
          type: 'invitation_declined',
          message: `${result.recipient.name || result.recipient.username} declined your invitation to "${result.project.name}"`,
          projectId: result.project.id,
        });

      emitNotification(
        result.sender.id,
        notification
      );
    }

    res.json(result);
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
// ACTIVITIES
// ============================================================

const getActivities = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const projectId = getId(
      req.params.projectId
    );

    const activities =
      await projectsService.getActivities(
        projectId,
        req.user!.id
      );

    res.json(activities);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    res.status(403).json({
      error: message,
    });
  }
};
module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,

  addMember,
  removeMember,
  getMembers,

  createInvitation,
  getMyInvitations,
  getInvitationHistory,
  acceptInvitation,
  rejectInvitation,

  getActivities,
};
export {};