const User = require('../models/User');

const ErrorHanlder = require('../utils/errorHandler');
const sendToken = require('../utils/tokenJwt');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

//register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: { public_id: '1', url: 'sdsadasd' },
  });

  const token = user.getJwtToken();

  sendToken(user, 201, res)
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

  const token = user.getJwtToken();

  sendToken(user, 201, res)
});
