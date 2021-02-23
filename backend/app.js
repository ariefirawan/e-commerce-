const express = require('express');
const app = express();

const errorMiddlewares = require('./middlewares/errors');

app.use(express.json());

//imports all routes
const products = require('./routes/products');

app.use('/api/v1', products);

//middleware to handle error
app.use(errorMiddlewares);

module.exports = app;
