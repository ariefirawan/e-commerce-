const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

const errorMiddlewares = require('./middlewares/errors');

app.use(express.json());
app.use(cookieParser());
//imports all routes
const auth = require('./routes/auth');
const products = require('./routes/products');
const order =require('./routes/order')

app.use('/api/v1', auth);
app.use('/api/v1', products);
app.use('/api/v1', order);

//middleware to handle error
app.use(errorMiddlewares);

module.exports = app;
