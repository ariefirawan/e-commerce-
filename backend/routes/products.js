const express = require('express');
const router = express.Router();

const { getProducts, newProduct } = require('../controllers/productController');

router.get('/products', getProducts);

router.post('/products', newProduct);

module.exports = router;
