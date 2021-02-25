const express = require('express');
const router = express.Router();

const {
  getProducts,
  newProduct,
  getById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { isAuthenticated } = require('../middlewares/auth');

router.route('/products').get(getProducts);
router.route('/products/:id').get(getById);

router.route('/admin/products').post(isAuthenticated, newProduct);
router
  .route('/admin/products/:id')
  .patch(isAuthenticated, updateProduct)
  .delete(isAuthenticated, deleteProduct);

module.exports = router;
