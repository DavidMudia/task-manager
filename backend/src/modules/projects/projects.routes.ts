const { Router } = require('express');

const {
  verifyToken,
} = require('../../middleware/auth');

const {
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
} = require('./projects.controller');

const router = Router();

router.use(verifyToken);

// ============================================================
// PROJECT CRUD
// ============================================================

router.post(
  '/',
  createProject
);

router.get(
  '/',
  getProjects
);

// ============================================================
// INVITATIONS
// IMPORTANT:
// These routes must come before /:id
// ============================================================

// Get pending invitations for current user
router.get(
  '/invitations',
  getMyInvitations
);

router.post(
  '/invitations/accept',
  acceptInvitation
);

router.post(
  '/invitations/reject',
  rejectInvitation
);

router.post(
  '/:projectId/invitations',
  createInvitation
);
// ============================================================
// SINGLE PROJECT
// ============================================================

router.get(
  '/:id',
  getProject
);

router.patch(
  '/:id',
  updateProject
);

router.delete(
  '/:id',
  deleteProject
);

// ============================================================
// MEMBERS
// ============================================================

router.post(
  '/:projectId/members',
  addMember
);

router.delete(
  '/:projectId/members/:userId',
  removeMember
);

router.get(
  '/:projectId/members',
  getMembers
);

// ============================================================
// PROJECT ACTIVITIES
// ============================================================

router.get(
  '/:projectId/activities',
  getActivities
);

module.exports = router;