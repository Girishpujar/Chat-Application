const express = require('express');
const router= express.Router();
const User = require('../Controllers/usercontroller');
const validation= require('../Middlewares/uservalidation')



router.route('/signup').post(User.signup);
router.route('/login').post(User.signin);
router.route('/current').get(validation, User.currentUser);
router.route('/logout').post(validation, User.signout);


module.exports=router;




