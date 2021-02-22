const Product = require('../models/Product');

exports.newProduct = async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product
  });
};

exports.getProducts = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'this routes will show all products in database',
  });
};
