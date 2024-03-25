const express = require("express");
const app = express();
const bodyparser = require('body-parser')
const mongoose = require("mongoose")
const cors =require("cors");
const helmet = require('helmet')
const morgan = require("morgan");
const jwt = require('jsonwebtoken');
const bcrypt =require('bcrypt');    
const cookieParser = require('cookie-parser');
const errorMiddlewar = require('./middl/error')

const products = require('./routes/product')
const auth = require('./routes/auth')
const order = require('./routes/order');
app.use(express.json());
app.use(helmet());
app.use(helmet.contentSecurityPolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyparser.json());
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.urlencoded({
    extended:false,
}));
app.use(cors());
//you want use cookie it must
app.use(cookieParser())

app.use('/api/v1/', products);
app.use('/api/v1/',auth);
app.use('/api/v1/',order);

app.use(errorMiddlewar)
module.exports = app;