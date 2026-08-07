const { Router } = require('express');
const { verifyToken } = require('../../middleware/auth');
const { upload } = require('../../middleware/upload');

const {
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
} = require('./tasks.controller');

const router = Router();

router.use(verifyToken);

// Task CRUD
router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

// Subtasks
router.get('/:taskId/subtasks', getSubtasks);
router.post('/:taskId/subtasks', createSubtask);
router.patch('/subtasks/:subtaskId', updateSubtask);
router.delete('/subtasks/:subtaskId', deleteSubtask);

// Comments
router.get('/:taskId/comments', getComments);
router.post('/:taskId/comments', createComment);
router.patch('/comments/:commentId', updateComment);
router.delete('/comments/:commentId', deleteComment);

// Attachments
router.post(
  '/:taskId/attachments',
  upload.single('file'),
  uploadAttachment
);

router.get('/:taskId/attachments', getAttachments);
router.delete('/attachments/:attachmentId', deleteAttachment);

module.exports = router;

export {};
