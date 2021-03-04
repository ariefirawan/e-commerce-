const crypto = require('crypto');
const cloudinary = require('cloudinary');

const User = require('../models/User');

const ErrorHanlder = require('../utils/errorHandler');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail');
const APIFeatures = require('../utils/apiFeatures');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

//register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

  const { name, email, password } = req.body;

  const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: 'avatars',
    width: 150,
    crop: 'scale',
  });

  const user = await User.create({
    name,
    email,
    password,
    avatar: { public_id: result.public_id, url: result.url },
  });
  
  sendToken(user, 200, res);
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorHanlder('Please enter a valid email and password', 400)
    );
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHanlder('User not found', 401));
  }

  //checks password is correct or not
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHanlder('Invalid Password', 401));
  }

  sendToken(user, 201, res);
});

// update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Change Password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatch) {
    return next(new ErrorHanlder('Old Password is incorrect', 401));
  }
  user.password = req.body.password;
  await user.save();

  sendToken(user, 200, res);
});

// Forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHanlder('User not found', 404));
  }

  //Get reset token
  const resetToken = user.getResetPasswordToken();
  //setelah scr simple getResetPasswordToken di panggil save user walaupun validation nya invalid
  await user.save({ validateBeforeSave: false });

  //create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'ShopIT Password Recovery',
      message,
    });

    res.status(201).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHanlder(err.message, 500));
  }
});

// endpoint Reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //Hash token url
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpired: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHanlder(
        'Password reset token is invalid or has been expired',
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHanlder('Password does not match', 400));
  }
  //setup new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpired = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get currently logged in user details => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(201).json({
    success: true,
    user,
  });
});

exports.userLogout = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
});

// Get all users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
  const apiFeatures = await new APIFeatures(User.find(), req.query).search();
  const users = await apiFeatures.query;

  res.status(201).json({
    success: true,
    users,
  });
});

// Get user by id => /api/v1/admin/user/:id
exports.getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHanlder('User not found', 401));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update user profile => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHanlder('User not found', 401));
  }

  await user.remove();

  res.status(200).json({
    success: true,
  });
});
