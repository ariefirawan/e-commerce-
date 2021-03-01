const Product = require('../models/Product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');

exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user._id;
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 5;
  // const productsCount = await Product.countDocuments()
  
  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  const products = await apiFeatures.query;

  // if (products.length < 1) {
  //   return res.status(200).json({
  //     message: 'No product',
  //   });
  // }
  return res.status(200).json({
    success: true,
    productsCount: products.length,
    products,
  });
});

exports.getById = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  return res.status(200).json({
    success: true,
    product,
  });
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    useFindAndModify: false,
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    success: true,
    product,
  });
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  Product.findByIdAndRemove(
    req.params.id,
    { useFindAndModify: false },
    (err, model) => {
      if (err) {
        return err;
      }
      return res.status(200).json({
        success: true,
      });
    }
  );
});

// create review product => /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating,
    comment,
  };

  const product = await Product.findById(productId);

  const isReview = product.reviews.find(
    (p) => p.user.toString() === req.user._id.toString()
  );

  console.log(isReview);

  if (isReview) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        (review.comment = comment), (review.rating = rating);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;
  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true });
});

// get product review product => /api/v1/review?id=
exports.getReviewProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// delete review product => /api/v1/review?productId=&id=
exports.deleteReviewProduct = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.findById(req.query.productId);

  const reviews = products.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );

  const numOfReviews = reviews.length;

  const ratings =
    products.reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      ratings,
      numOfReviews,
      reviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
