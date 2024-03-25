const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name:{
        type : String,
        required : [true, "Plese enter product name"],
        trim:true,
        maxlength: [100, "Product name cannot exeed 100 charactors"]
    },
    price:{
        type: String,
        required: true,
        default: 0.0
    },
    description:{
        type: String,
        required: [true, "Plese enter product description "]
    },
    ratings:{
        type:String,
        default:0
    },
    images:[
        {
            image:{
                type:String,
                required:true,
            }
        }
    ],
    category:{
        type:String,
        required:[true,"plese enter product catagory"],
        enum:{
            values:[
                'Electronics',
                'Mobile Phones',
                'Laptops',
                'Accessories',
                'Headphones',
                'Clothes/Shopes',
                'Food',
                'books',
                'Beauty/Health',
                'Sports',
                'OutDoor',
                'home',
                "Dolls",
            ],
            message:"Plese select your correct category"
        }
    },
    seller:{
        type:String,
        required: [true, "plese enter product seller"]
    },
    stock: {
        type:Number,
        required:[true, "Plese enter product stock"],
        maxlength:[20,"Product stock cannot exceed 20"],
    },
    numOfReviews: {
        type:Number,
        default:0
    },
    reviews: [
        {
            user: mongoose.Schema.Types.ObjectId,
            rating:{
                type:String,
                required:true
            },
            comment:{
                type:String,
                required:true
            },
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

});

const Schema = mongoose.model('Products',productSchema);
module.exports = Schema;