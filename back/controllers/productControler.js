
const Product = require('../models/productModel');
const Errorhandler = require('../utils/errorHandler')
const catchAsynError = require('../middl/catchAsyncError')
const APIFeatures = require('../utils/apiFeatures')





// exports.getProducts = (req,res,next) =>{
//     res.status(200).json({
//         success : true,
//         message : "this rout will show all the porducts in db"
//     }) 
// }



//get products = http://localhost:7000/api/v1/products
//fiter prodect = http://localhost:7000/api/v1/product?keyword=Pro
exports.getProducts = catchAsynError(async(req,res,next) =>{
    const resPerPage = 2
    const apiFeature= new APIFeatures(Product.find(), req.query)
    .search().filter().paginate(resPerPage);

    const porducts = await apiFeature.query;
    res.status(200).json({
        success : true,
        count: porducts.length,
        porducts
    }) 
})


//create product = http://localhost:7000/api/v1/product/new
exports.newProduct = catchAsynError(async(req,res,next) =>{

    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    });
})

// get a single product = http://localhost:7000/api/v1/product/:id
exports.getSingleProducts =catchAsynError (async(req,res,next) =>{
    const product = await Product.findById(req.params.id)

    if(!product) {
    //    return res.status(404).json({
    //         success:false,
    //         message:'rroducty is not define'
    //     });
    return next(new Errorhandler("Product not found test" , 404))
    }
    res.status(201).json({
        success:true,
        product
    });
})

//update product =http://localhost:7000/api/v1/product/65ef0ecdb58c05c990a8a30f

exports.updateProduct =catchAsynError(async(req,res,next) =>{
    const product = await Product.findById(req.params.id)

    if(!product) {
       return res.status(404).json({
            success:false,
            message:'rroducty is not define'
        });
    }

     await Product.findByIdAndUpdate(req.params.id, req.body ,{
        new: true,
        runValidators:true
    });

    res.status(200).json({
        success:true,
        product
    });
})
//delete product =http://localhost:7000/api/v1/product/65ef0ecdb58c05c990a8a30f

exports.deleteProduct =catchAsynError(async(req,res,next) =>{
    const product = await Product.findById(req.params.id)

    if(!product) {
       return res.status(404).json({
            success:false,
            message:'rroducty is not define'
        });
    }

    await Product.findByIdAndDelete(req.params.id, req.body ,{
        new: true,
        runValidators:true
    });


    res.status(200).json({
        success:true,
        message:'product deleted'
    });
})

//Create review =  api/vi/review
exports.createReview =catchAsynError(async(req,res,next) =>{
    const { productId, rating, comment } = req.body;
    const review = {
        user : req.user.id,
       rating,
       comment,
    }
    const product = await Product.findById(productId);
    //finding user  review exists
    const isReviewed = product.reviews.find(review => {
        return review.user.toString() == req.user.id.toString()
    })

    if(isReviewed){
        //updating the review
        product.reviews.forEach(review =>{
            if(review.user.toString() == req.user.id.toString()){
                review.comment = comment
                review.rating = rating
            }
        })
    }
    else{
        //create the review
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length;
    }
    //find the averagre of the product reviees
    product.ratings = product.reviews.reduce((acc, review) =>{
        return review.rating + acc;
    },0) / product.reviews.length;

    product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

    await product.save({validateBeforeSave : false});

    res.status(200).json({
        success:true,
    });
})

//get reviews = api/v1/reviews?id{productId}
exports.getReviews =catchAsynError(async(req,res,next) =>{
    const product = await Product.findById(req.query.id)

    res.status(200).json({
        success:true,
        reviews: product.reviews
    });
})

//delete review = api/v1/review
exports.deleteReview =catchAsynError(async(req,res,next) =>{
    const product = await Product.findById(req.query.productId)
    //filter the reviews which does match the deleting the review id
    const reviews = product.reviews.filter(review=>{
        review._id.toString() !== req.query.id.toString();
    });
    //number of views
    const numOfReviews = reviews.length;
    //finding the average withthe filltered reviews
    let ratings =  product.reviews.reduce((acc, review) =>{
        return review.rating + acc;
    },0) / product.reviews.length;
    ratings = isNaN(ratings) ? 0 : ratings;
//save the product data/document
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,numOfReviews,ratings
    });
    res.status(200).json({
        success:true,
        // reviews: product.reviews
    });
})
