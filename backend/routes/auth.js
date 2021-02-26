const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  userLogout,
  getUserProfile,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const { isAuthenticated } = require('../middlewares/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);

router.route('/me').get(isAuthenticated, getUserProfile);
router.route('/logout').get(userLogout);

module.exports = router;
