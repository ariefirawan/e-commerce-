const Order = require('../models/Order');
const Product = require('../models/Product');

const ErrorHanlder = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

// get single order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!order) {
    return next(new ErrorHanlder('No order found with this ID', 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user orders => /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.find(req.user.id);

  res.status(200).json({
    success: true,
    count: order.length,
    order,
  });
});

// get logged in all orders => /api/v1/admin/orders
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.find();

  let totalAmount = 0;
  order.forEach((order) => (totalAmount += order.totalPrice));

  res.status(200).json({
    success: true,
    count: order.length,
    totalAmount,
    order,
  });
});

// update order => /api/v1/admin/order/:id
exports.updateOrders = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHanlder('You have already delivered this order', 400));
  }

  order.orderItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });

  (order.orderStatus = req.body.status), (order.deliveredAt = Date.now());

  await order.save();

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, qty) {
  const product = await Product.findById(id);
  product.stock = product.stock - qty;
  await product.save({ validateBeforeSave: false });
}

// get single order => /api/v1/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHanlder('No order found with this ID', 404));
  }

  order.remove();
  
  res.status(200).json({
    success: true,
  });
});
