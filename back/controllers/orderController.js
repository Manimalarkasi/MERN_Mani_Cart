const catchAsyncError = require("../middl/catchAsyncError");
const Order =  require('../models/ordermodel');
const Product = require('../models/productModel')
const Errorhandler = require('../utils/errorHandler');
//create newOrder = api/v1/order/new
exports.newOrder = catchAsyncError(async(req,res,next) =>{
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt:Date.now(),
        user:req.user.id,
    })

    res.status(200).json({
        success:true,
        order
    })
})


//get single order order  = {{base_url}}/api/v1/order/65f68fac16c7fbac6dc1b7b0
 exports.getSingleOrder = catchAsyncError(async(req,res,next) =>{
    const order = await Order.findById(req.params.id).populate('user','name email')
    if(!order){
        return next(new Errorhandler(`order not found with this id: ${res.params.id}`,400))
    }
    res.status(200).json({
        success:true,
        order
    })
 })

 //get Logged User order = {{base_url}}/api/v1/myorder
 exports.myOrders = catchAsyncError(async(req,res,next) =>{
    const orders = await Order.find({user:req.user.id})
    if(!orders){
        return next(new Errorhandler(`order not found with this id: ${res.params.id}`,400))
    }
    res.status(200).json({
        success:true,
        count: orders.length,
        orders
    })
 })

 //admin: get all orders = {{base_url}}/api/v1/orders

 exports.orders = catchAsyncError(async(req,res,next) =>{
    const orders = await Order.find()
    
    let totalAmount =0;

    orders.forEach(order => {
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success:true,
        count: orders.length,
        totalAmount,
        orders
    })
 })

 //admin:update order/order status = api/v1/order/:id
 exports.updateOrders = catchAsyncError(async(req,res,next) =>{
    const order = await Order.findById(req.params.id)
    
    if(order.orderStatus == 'Deliverde'){
        return next(new Errorhandler('order has been already delivered!',400))
    }

    //updating the product stock of each order item = {base_url}}/api/v1/order/65f68fac16c7fbac6dc1b7b0
    order.orderItems.forEach(async orderItems =>{
        await updateStock(orderItems.product,orderItems.quantity)
    })
    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();
    await order.save();
    res.status(200).json({
        success:true,
    })
})
async function updateStock (productId, quantity){
    const product = await Product.findById(productId);
    product.stock = product.stock-quantity;
    product.save({validateBeforeSave:false});
}

//admin : Delete Order = {{base_url}}/api/v1/order/65f6cd3d57c3c3c5a90438b8
exports.deleteOrder = catchAsyncError(async(req,res,next) =>{
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new Errorhandler(`order not found with this id: ${res.params.id}`,400))
    }

    await Order.findByIdAndDelete(req.params.id,{
        new:true,
        runValidators:true,
    });
    // await order.remove();
    res.status(200).json({
        success:"deleted",
        // count: order.length,
        // order
    })
    // const order = await Order.findById(req.params.id);
    //     if (order) {
    //         const deletedOrder = await order.delete();
    //         res.send({ message: 'Order Deleted', product: deletedOrder });
    //     } else {
    //         res.status(404).send({ message: 'Order Not Found' });
    //     }
})