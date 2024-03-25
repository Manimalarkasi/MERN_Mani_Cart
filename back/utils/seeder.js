const products = require('../data/products.json');
const Product = require('../models/productModel');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');
const path = require('path');


dotenv.config({path:path.join(__dirname, "config/.env")});
connectDatabase();

const seedProducts = async()=>{
    try {
        await Product.deleteMany();
    console.log("all prodects are deleted");
        await Product.insertMany(products);
    console.log("all prodects are added");
    } catch (error) {
        console.log(error)
    }
    process.exit();
}
seedProducts()