const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  userLogout,
  getUserProfile,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  allUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/authController');

const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);

router.route('/password/update').put(isAuthenticated, updatePassword);

router.route('/me').get(isAuthenticated, getUserProfile);
router.route('/me/update').put(isAuthenticated, updateProfile);
router.route('/logout').get(userLogout);

router
  .route('/admin/users')
  .get(isAuthenticated, authorizeRoles('admin'), allUsers);
router
  .route('/admin/user/:id')
  .get(isAuthenticated, authorizeRoles('admin'), getUser)
  .put(isAuthenticated, authorizeRoles('admin'), updateUser)
  .delete(isAuthenticated, authorizeRoles('admin'), deleteUser);

module.exports = router;
