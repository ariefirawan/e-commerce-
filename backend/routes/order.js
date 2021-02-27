const express = require('express');
const router = express.Router();

const {
  newOrder,
  getSingleOrder,
  myOrders,
  updateOrders,
  allOrders,
  deleteOrder,
} = require('../controllers/orderController');

const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');

router.route('/order/new').post(isAuthenticated, newOrder);

router.route('/order/:id').get(isAuthenticated, getSingleOrder);
router.route('/order/me').get(isAuthenticated, myOrders);
router
  .route('/admin/orders')
  .get(isAuthenticated, authorizeRoles('admin'), allOrders);

router
  .route('/admin/order/:id')
  .put(isAuthenticated, authorizeRoles('admin'), updateOrders)
  .delete(isAuthenticated, authorizeRoles('admin'), deleteOrder);

module.exports = router;
