const express = require('express');
const router = express.Router();

const {
  getProducts,
  newProduct,
  getById,
  updateProduct,
  deleteProduct,
  createProductReview,
  getReviewProduct,
  deleteReviewProduct,
} = require('../controllers/productController');
const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');

router.route('/products').get(getProducts);
router.route('/products/:id').get(getById);

router
  .route('/admin/products')
  .post(isAuthenticated, authorizeRoles('admin'), newProduct);
router
  .route('/admin/products/:id')
  .patch(isAuthenticated, authorizeRoles('admin'), updateProduct)
  .delete(isAuthenticated, authorizeRoles('admin'), deleteProduct);

router
  .route('/review')
  .get(isAuthenticated, getReviewProduct)
  .put(isAuthenticated, createProductReview)
  .delete(isAuthenticated, deleteReviewProduct);

module.exports = router;
