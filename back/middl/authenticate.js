const Errorhandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');
const JWT_SECRET = "5ABDAB9FF7F97D7E";
const User = require('../models/userModel')

exports.isAuthentivatedUser = catchAsyncError(async (req,res,next)=>{
    const { token } = req.cookies;

    if(!token){
        return next(new Errorhandler('login first to handle this resourse',401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);
    next();
})

exports.authorizeRoles =(...roles) =>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new Errorhandler(`Role ${req.user.role} is not allowed`,401 )   )
        }
        next();
    }
    
}