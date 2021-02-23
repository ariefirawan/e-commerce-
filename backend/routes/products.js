const express = require('express');
const router = express.Router();

const {
  getProducts,
  newProduct,
  getById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

router.route('/products').get(getProducts);
router.route('/products/:id').get(getById);

router.route('/admin/products').post(newProduct);
router.route('/admin/products/:id')
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = router;
