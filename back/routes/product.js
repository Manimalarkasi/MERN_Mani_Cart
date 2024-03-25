const express =require('express');
const { getProducts,
     newProduct,
      getSingleProducts,
       updateProduct, 
       deleteProduct, 
       createReview,
       getReviews,
       deleteReview} = require('../controllers/productControler');
const {isAuthentivatedUser, authorizeRoles} = require('../middl/authenticate')

const router = express.Router();


// router.get('/products',getProducts)
router.route('/products').get(isAuthentivatedUser, getProducts);
router.route('/product/:id')
.get(getSingleProducts)
.put(updateProduct)
.delete(deleteProduct);

router.route('/review').put(isAuthentivatedUser,createReview).delete(deleteReview)
router.route('/reviews').get(getReviews)


//admin routes
router.route('/admin/product/new').post(isAuthentivatedUser,authorizeRoles('admin'),newProduct);



module.exports = router;