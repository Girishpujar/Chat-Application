const express = require('express');
const router= express.Router();
const Message = require('../Controllers/messagecontroller');
const validation= require('../Middlewares/uservalidation');


router.route('/message').post(validation, Message.createmessage);
router.route('/allmessages/:id').get(validation, Message.allmessages);

module.exports=router;