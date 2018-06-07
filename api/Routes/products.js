const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({dest : 'uploads/'});

const Product = require('../models/product');

router.get('/',function(req,res,next){
    Product.find()
    .select('name price _id')
    .exec()
    .then(doc=>{
        if(doc.length>=0){
            const response = {
                count : doc.length,
                product : doc
            };
            res.status(200).json(response);
        }else{
            res.status(404).json({message : 'No entries'});
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
    /* res.status(200).json({
     p   message : "Handling GET request on /products"
    }); */
});

router.post('/',upload.single('productImage'),function(req,res,next){
    console.log(req.file);
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price
    });

    product.save().then(result=>{
        console.log(result);
    })
    .catch(err=>{console.log(err);});
    res.status(201).json({
        message : "Handling POST request on /products",
        createdProduct : product
    });
});

router.get('/:productID',function(req,res,next){
    const id = req.params.productID;
    Product.findOne({name:id})
    .exec()
    .then(doc=>{
        console.log(doc);
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
/* 
    res.status(200).json({
        message : "Product Details",
        ID : id
    }); */
});

router.patch('/:productID',function(req,res,next){
    const id = req.params.productID;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Product.update({_id:id},{$set : updateOps})
    .exec()
    .then(result=>{
        res.status(200).json({message : 'Successfully updated!'})
    })
    .catch(err=>{
        res.status(500).json({
            error : err
        });
    });
    ;
    //{name: req.body.newName,price: req.body.newPrice}
});

router.delete('/:productID',function(req,res,next){
    const id = req.params.productID;
    Product.remove({name : id})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({message :'ID deleted successfully'});
    }) 
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
});
module.exports = router;