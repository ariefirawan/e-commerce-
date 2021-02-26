const express = require('express');
const router = express.Router();

const { registerUser, loginUser, userLogout, forgotPassword, resetPassword } = require('../controllers/authController');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);

router.route('/logout').get(userLogout);

module.exports = router;
