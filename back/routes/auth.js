const express = require('express');
const {
     registerUser,
      loginUser,
      logoutUser,
      forgotPassword,
       resetPassword,
        getUserProfile, 
        changePassword,
        updatePofile,
        getAllUsers,
        getUser,
        updateUser,
        deleteUser} = require('../controllers/authController');
const router = express.Router();
const {isAuthentivatedUser,authorizeRoles} = require('../middl/authenticate')
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/myprofile').get(isAuthentivatedUser,getUserProfile);
router.route('/password/change').put(isAuthentivatedUser,changePassword);
router.route('/updateprofile').put(isAuthentivatedUser,updatePofile);

//Admin routes
router.route('/admin/users').get(isAuthentivatedUser,authorizeRoles('admin'),getAllUsers);
router.route('/admin/user/:id').get(isAuthentivatedUser,authorizeRoles('admin'),getUser)
                            .put(isAuthentivatedUser,authorizeRoles('admin'),updateUser)
                            .delete(isAuthentivatedUser,authorizeRoles('admin'),deleteUser)

module.exports = router;