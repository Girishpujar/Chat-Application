const chat= require('../Models/ChatModel');
const user= require('../Models/UserModel');



const chatting = async (req, res) => {
    const { userId } = req.body;
    const Userss= await user.findById(userId);
    if (!Userss) {
      return res.status(400).json({message:"User Not Found"});
    }
  
    const isChat = await chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.newUser } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    }).populate("users", "-password")
      .populate("latestMessage");
  
    isChat = await user.populate(isChat, {
      path: "latestMessage.sender",
      select: "name email",
    });
  
    if (isChat.length > 0) {
      res.send(isChat[0]);
    }else{
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.newUser, userId],
      };
  
      try {
        const createdChat = await chat.create(chatData).populate(
          "users",
          "-password"
        );
        res.status(200).json({createdChat});
     // const FullChat = await chat.findOne({ _id: createdChat._id }).populate(
      //   "users",
      //   "-password"
      // );
      }catch(error){
        console.log(error)
        res.status(400).json({message:"Internal Server Error"})
      }
    }
};


const fetchChats = async (req, res) => {
  // try {
  //   chat.find({ users: { $elemMatch: { $eq: req.newUser } } })
  //     .populate("users", "-password")
  //     .populate("groupAdmin", "-password")
  //     .populate("latestMessage")
  //     .sort({ updatedAt: -1 })
  //     .then(async (results) => {
  //       results = await user.populate(results, {
  //         path: "latestMessage.sender",
  //         select: "name pic email",
  //       });
  //       res.status(200).send(results);
  //     });
  // } catch (error) {
  //   res.status(400);
  //   throw new Error(error.message);
  // }
  try{
  const allchats= await chat.find({ users: { $elemMatch: { $eq: req.newUser } } })
  .populate("users", "-password")
  .populate("groupAdmin", "-password")
  .populate("latestMessage")
  .sort({ updatedAt: -1 });
   res.status(200).json({allchats});
  }catch(Error){
    console.log(Error);
    res.status(404).json({message:"Internal Server Error",Error});
  }
};


module.exports={chatting, fetchChats};