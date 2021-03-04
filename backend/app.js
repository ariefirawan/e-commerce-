const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();

const errorMiddlewares = require('./middlewares/errors');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());


//imports all routes
const auth = require('./routes/auth');
const products = require('./routes/products');
const order = require('./routes/order');

app.use('/api/v1', products);
app.use('/api/v1', order);
app.use('/api/v1', auth);

//middleware to handle error
app.use(errorMiddlewares);

module.exports = app;
