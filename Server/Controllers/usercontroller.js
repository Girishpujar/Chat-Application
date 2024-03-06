const user = require('../Models/UserModel');
const multer= require('multer');
const path=require('path');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');


const signup = async(req, res)=>{
    try{
        const { name, email, password, is_online } = req.body

        const isStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(password);
        if (!isStrongPassword) {
            return res.status(400).json({ message: "Password is not strong enough" });
        }

        const existinguser= await user.findOne({email});
        if(existinguser){
            console.log("This Email Id is Already Exists");
            return res.status(400).json({message:"This Email Id is Already Exists"});
        }

        const ispassword = await bcrypt.hash(password, 10);
        const newUser= new user({
        name, 
        email,
        password:ispassword,
        is_online
        });
        await newUser.save().then((newUser) =>{
            console.log(newUser);
            return res.status(200).json({message:"Registered Sucessfully",newUser});
        });
    }catch(Error){
        console.log(Error);
        return res.status(500).json({message:"Internal Server Error"});
    }
};


const signin =async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
  
    const existinguser = await user.findOne({email});
    if (!existinguser) {
      return res.status(400).json({message: "User Not Found Please Register"});
    }
  
    const newUser = await user.findOne({ email });
    const isPassword = await bcrypt.compare(password, newUser.password);
    if (!isPassword) {
        return res.status(400).json({message: "Incorrect Email id or Password......."});
      }
      const accesstoken = jwt.sign(
        {
          id: newUser._id,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: '15m',
        }
      );
     console.log("Token is generated:\n", accesstoken);
     
      if (req.cookies[`${newUser._id}`]) {
        req.cookies[`${newUser._id}`] = " ";
      }
     
      res.cookie(String(newUser._id), accesstoken, {
        path: "/",
        expires: new Date(Date.now() + 1000 *9600),
        httpOnly: true,
        sameSite: "lax",
      });
      return res.status(200).json({message: "successfully logged in",newUser,accesstoken});
};


const currentUser = async(req, res)=>{
   const Users=req.newUser;
   try{
    const current = await user.findById(Users, "-Password");
    if(!current){
        return res.status(404).json({message:"User Not Found"});
    }
    else{
        res.status(200).json(current);
    }
   }
   catch(Error){
    console.log(Error);
    return res.status(500).json({message:"Internal Server Error",Error});
   }
};


const signout = async(req, res)=>{
    try{
    const cookie = req.headers.cookie;
    const accesstoken =cookie?.split("=")[1];

    if(!accesstoken){
        return res.status(404).json({message:"Accesstoken Not Foound"});
    }

    jwt.verify(accesstoken, process.env.JWT_SECRET_KEY,( Error, newUser)=>{
        if(Error){
            return res.status(400).json({message:"Invalid Token or Empty Token"});
        }

        res.clearCookie(`${newUser.id}`);
        req.cookies[`${newUser.id}`] = "";
        return res.status(200).json({message:"Sucessfully Logout"});
    });
   }catch(Error){
    console.log(Error);
    return res.status(500).json({message:"Internal Server Error",Error})
   }
};


module.exports={signup, signin, currentUser, signout};