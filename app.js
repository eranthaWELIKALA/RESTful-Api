const express = require('express');

const app = express();

const morgan =require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://eranthawelikala:94775778979@mongodb-zmk8t.mongodb.net/test?retryWrites=false');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//handling CORS(cross origin resource sharing)
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','POST DELETE PATCH GET');
        return res.status(200).json({});
    }
    next();
});

const productRoute = require('./api/Routes/products');
const ordersRoute = require('./api/Routes/orders');

//forwarding requests
app.use('/products',productRoute);
app.use('/orders',ordersRoute);

//this will handle every request which wasn't directed by above routers
app.use(function(req,res,next){
    const error = new Error('Not Found');
    error.status = 404;
    next(error) ;
});
app.use(function(error,req,res,next){
    res.status(error.status || 500);
    res.json({
        error:{
            message : error.message
        }
    });
});

module.exports = app;