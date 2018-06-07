const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order =  require('../models/order');
const Product =  require('../models/product');

router.get('/',function(req,res,next){
    Order.find()
    .populate('product','name price')
    .exec().then(docs=>{
        console.log(docs);
        res.status(200).json({docs})
    }).catch(err=>{
        res.status(500).json({
            error : err
        });
    });
});

router.post('/',function(req,res,next){
    Product.findById(req.body.productId) 
    .then(product=>{
        if(!product){
            return res.status(404).json({
                meessage :"ProductId not found"
            });
        }
        const order = new Order({
            _id : mongoose.Types.ObjectId(),
            quantity : req.body.quantity,
            product : req.body.productId
        });
        return order.save()    
    })
    .then(result => {
        console.log(result);
        res.status(201).json(result);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
});
    
    router.get('/:orderID',function(req,res,next){
        const id = req.params.orderID;
        Order.findOne({ _id: id})
        .exec()
        .then(result=>{
            if(!result){
                return res.status(404).json({
                    meessage : "Order not found "
                })
            }
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err=>{
            res.status(500).json({
                meessage : 'Product not found',
                error : err
            })
        });
    
});

router.delete('/:orderID',function(req,res,next){
    const id = req.params.orderID;
    Order.remove({ _id : id})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({meessage: "Order Deleted Successfully"});
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    }); 
});



module.exports = router;