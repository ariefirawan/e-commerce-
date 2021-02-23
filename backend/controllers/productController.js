const Product = require('../models/Product');

exports.newProduct = async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
};

exports.getProducts = async (req, res, next) => {
  const products = await Product.find();

  if (products.length < 1) {
    return res.status(200).json({
      message: 'No product',
    });
  }
  return res.status(200).json({
    success: true,
    products,
  });
};

exports.getById = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  return res.status(200).json({
    success: true,
    product,
  });
};

exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'product not found',
    });
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
};

exports.deleteProduct = async (req, res, next) => {
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
};
