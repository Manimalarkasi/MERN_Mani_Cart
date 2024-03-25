//for authendication  request handelrrs
const catchAsyncError = require("../middl/catchAsyncError");
const User = require('../models/userModel');
const Errorhandler = require('../utils/errorHandler');
const sendToken  = require('../utils/jwt');
const {getResetToken} = require('../models/userModel')
const sendEmail = require('../utils/email');
const crypto = require('crypto');


//Register User - http://localhost:7000/api/v1/register
exports.registerUser = catchAsyncError(async(req,res,next) =>{
    const { name,email,password,cpassword,avatar } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        cpassword,
        avatar
    });
    const token = user.getjwtToken();

console.log(user,token)
sendToken(user,201,res)

    // res.status(201).json({
    //     success:true,
    //     user,
    //     token
    // })
}) ;

//Login User - http://localhost:7000/api/v1/login
exports.loginUser = catchAsyncError(async(req,res,next) => {
    const {email,password} = req.body;
    if(!email || !password) {
        return next(new Errorhandler("please enter Email & Password",400))
    }

    //finding the user db
    const user = await User.findOne({email}).select('+password');

    if(!user){
        return next(new Errorhandler("Invalid Email & Password",401))
    }

    if(!await user.isValidPassword(password)){
        return next(new Errorhandler("Invalid Email & Password",401))
    }
    const token = user.getjwtToken();
    console.log(user,token)

    sendToken(user,201,res)
});

//Logout - /api/v1/logout
exports.logoutUser = (req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    }).status(200)
    .json({
        success:true,
        messsage:"logdeout",

    })
}

//Forgot Password - /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new Errorhandler('User not found with this email',404))
    }

    const resetToken = user.getResetToken();
    await user.save({validateBeforeSave:false});

    //create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset url is as follows \n\n
    ${resetUrl}\n\n If you have not requested this email, then i ignore it`;

    try {
        sendEmail({
            email:user.email,
            subject:'MANIcart Password Recovery',
            message
        });

        res.status(200).json({
            success:true,
            message:`Email send to ${user.email}`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({validateBeforeSave:false})
        return next(new Errorhandler(error.message),500);
    }
})

//Reset paeeword = http://localhost:7000/api/v1/password/reset/59dee4682a68d253b23c5821411429b6c52fb2aa
exports.resetPassword = catchAsyncError(async(req,res,next)=>{
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token ).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire:{
            $gt: Date.now()
        }
    })

    if(!user){
        return next(new Errorhandler('Password reset token is invalid or expired',404))
    }

    if(req.body.password !== req.body.confirmpassword ){
        return next(new Errorhandler('Password does not match',404))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    user.cpassword = req.body.password
    await user.save({validateBeforeSave:false});

    sendToken(user,201,res)
})


//Get user profile = /api/v1/myprofile
exports.getUserProfile = catchAsyncError(async(req,res,next)=> {
   const  user = await User.findById(req.user.id)
   res.status(200).json({
    success:true,
    user
   })
})


//change password =/api/v1/password/change
exports.changePassword = catchAsyncError(async(req,res,next)=> {
    const  user = await User.findById(req.user.id).select('+password')

    //check old paaword
    if(!await user.isValidPassword(req.body.oldPassword)){
        return next(new Errorhandler('old Password is incorrect',404))
    }

    //aasigning new password
    user.password = req.body.password;
    user.cpassword = req.body.password;
    await user.save();

    res.status(200).json({
     success:true,
    })
 })


 //update profile = {{base_url}}/api/v1/updateprofile
 exports.updatePofile = catchAsyncError(async(req,res,next) => {
    const newUserData ={
        name:req.body.name,
        email:req.body.email,
    }

   const user =  await User.findByIdAndUpdate(req.user.id, newUserData,{
        new:true,
        runValidators:true,
    })

    res.status(200).json({
        success:true,
        user
    })
 })


 //admin get all users = {{base_url}}/api/v1/admin/users
 exports.getAllUsers = catchAsyncError(async(req,res,next)=>{
    const users = await User.find()
    res.status(200).json({
        success:true,
        count: users.length,
        users
    })
 })


 //Admin get specific User = http://localhost:7000/api/v1/admin/user/:id
 exports.getUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        return next(new Errorhandler(`User is not found with this id ${req.params.id}`),404)
    }

    res.status(200).json({
        success:true,
        user
    })
 });


 //Admin :update User = http://localhost:7000/api/v1/admin/user/:id
 exports.updateUser =  catchAsyncError(async(req,res,next)=>{
    const newUserData ={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }

   const user =  await User.findByIdAndUpdate(req.user.id, newUserData,{
        new:true,
        runValidators:true,
    })

    res.status(200).json({
        success:true,
        user
    })
 });

 //Admin : Delete User = http://localhost:7000/api/v1/admin/user/:id
 exports.deleteUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        return next(new Errorhandler(`User is not found with this id ${req.params.id}`),404)
    }
    await User.findByIdAndDelete(req.user.id,{
        new:true,
        runValidators:true,
    })
    res.status(200).json({
        success:true
    })
 })