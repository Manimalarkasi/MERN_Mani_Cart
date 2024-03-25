const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "5ABDAB9FF7F97D7E";
const JWT_EXORES_TIME = "7d";
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Please enter name']
    },
    email:{
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        maxlength: [6, 'Password cannot exceed 6 characters'],
        select: false
    },
    cpassword: {
        type: String,
        required: [true, 'Please enter password'],
        maxlength: [6, 'Password cannot exceed 6 characters'],
        select: false
    },
    avatar: {
        type: String,
        required:true
    },
    role :{
        type: String,
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    createdAt :{
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function(next){
    console.log(this.password)
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getjwtToken = function(){
    return jwt.sign({email: this.email, id: this.id, name: this.name}, process.env.JWT_SECRET,{
        expiresIn: "7d"})
}

userSchema.methods.isValidPassword = async function(enteredPassword){
    return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetToken = function(){
    //generate token
   const token = crypto.randomBytes(20).toString('hex');
   //generate Hash & set to trsetPasswordToken
   this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
   //set token expies time
   this.resetPasswordTokenExpire = Date.now() + 30 * 60 *1000;

   return token;

}   

let model =  mongoose.model('User', userSchema);

module.exports = model;