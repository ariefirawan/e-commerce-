const User = require('../models/User');

const ErrorHanlder = require('../utils/errorHandler');
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

  res.status(201).json({
    success: true,
    token,
  });
});
