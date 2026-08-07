const { Router } = require('express');

const {
  getUsers,
  getUser,
  updateProfile,
  uploadAvatar,
} = require('./users.controller');

const { verifyToken } = require('../../middleware/auth');
const { upload } = require('../../middleware/upload');

const router = Router();

router.use(verifyToken);

// User search
router.get('/', getUsers);

// Current user's profile
router.patch('/profile', updateProfile);

// Current user's profile picture
router.post(
  '/profile/avatar',
  upload.single('avatar'),
  uploadAvatar
);

// Public user profile
router.get('/:id', getUser);

module.exports = router;
export {};