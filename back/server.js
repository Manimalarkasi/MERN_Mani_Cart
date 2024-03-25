const app = require('./app');
const bodyparser = require('body-parser')
const mongoose = require("mongoose")
const cors =require("cors");
const helmet = require('helmet')
const morgan = require("morgan");
const jwt = require('jsonwebtoken');
const bcrypt =require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/database');
const port =process.env.PORT || 7000;
const devlopment = process.env.NODE_ENV || "production";
// console.log(__dirname)
// console.log(__filename)
// console.log(process.env.PORT)

dotenv.config({path:path.join(__dirname, "config/config.env")});
//{path:path.join(__dirname, "config/.env")}
connectDatabase();
// console.log(process.env.JWT_SECRET)
app.listen(port,()=>{
    console.log(`the server is runing on ${process.env.PORT} this port in ${process.env.NODE_ENV}`);
});

// mongoose.connect('mongodb://localhost:27017/manicart',{
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// })
// .then(()=>{
//     app.listen(port,()=>console.log(`Searver port : ${port} `));

// })
// .catch((err)=>console.log(`${err} did not connect`));