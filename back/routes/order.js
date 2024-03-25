const express = require('express');
const {isAuthentivatedUser,authorizeRoles} = require('../middl/authenticate')
const { newOrder, getSingleOrder, myOrders, orders, updateOrders, deleteOrder } = require('../controllers/orderController');
const orderModel = require('../models/ordermodel');
const router = express.Router();

router.route('/order/new').post(isAuthentivatedUser,newOrder);
router.route('/order/:id').get(isAuthentivatedUser,getSingleOrder);
router.route('/myorder').get(isAuthentivatedUser,myOrders);
//admin
router.route('/orders').get(isAuthentivatedUser,authorizeRoles('admin'),orders);
router.route('/order/:id').put(isAuthentivatedUser,authorizeRoles('admin'),updateOrders)
.delete(isAuthentivatedUser,authorizeRoles('admin'),deleteOrder);

module.exports = router;