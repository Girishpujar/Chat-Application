const express = require('express');
const router= express.Router();
const Chat = require('../Controllers/chatconrtoller');
const validation= require('../Middlewares/uservalidation');


router.route('/chat').post(validation, Chat.chatting);
router.route('/allchat').get(validation, Chat.fetchChats);

module.exports=router;