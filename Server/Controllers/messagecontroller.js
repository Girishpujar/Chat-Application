const message= require('../Models/MessageModel');
const user= require('../Models/UserModel');
const chat= require('../Models/ChatModel');


const allmessages= async(req, res)=>{
    try{
        const messages= await message.findById({chat:req.params.id})
        .populate("sender", "name, email")
        .populate("chat");
        res.status(200).json({message:"All Messages", messages});
    }catch(Error){
        console.log(Error);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const createmessage = async (req, res) => {
    const { content, chatId , readBy} = req.body;
  
    if (!content || !chatId ) {
      return res.status(404).json({message:"All Fields Are Mandatary"});
    }
  
    const newMessage = new message({
      sender: req.newUser,
      content: content,
      chat: chatId,
    });
  
    try {
        const Messages = await message.create(newMessage);
        await Messages.populate("sender", "name email");
        await Messages.populate("chat", "users");
        await user.populate(Messages, {
        path: "chat.users",
        select: "name pic email",
      });
  
      await chat.findByIdAndUpdate(req.body.chatId, { latestMessage: Messages });
  
      res.json(newMessage);
    }catch(Error){
        console.log(Error);
        res.status(500).json({message:"Internal Server Error"});
    }
};
  


module.exports= {allmessages, createmessage};