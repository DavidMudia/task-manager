const { Router } = require('express');
const {
  register,
  login,
  getProfile,
} = require('./auth.controller');

const { verifyToken } = require('../../middleware/auth');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getProfile);

module.exports = router;

export {};
