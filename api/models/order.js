const mongoose = require('mongoose');

//It's like creating the table structure
const orderSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    product : {type : mongoose.Schema.Types.ObjectId ,ref : 'Product',required:true},
    quantity : { type : Number,default : 1 }
});
//in here with relation is added through ref
module.exports = mongoose.model('Order',orderSchema);