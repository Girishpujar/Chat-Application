require('dotenv').config();
const mongoose=require('mongoose');


const connectionDB=async(req,res)=>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully", connect.connection.host, connect.connection.name);
    } catch (err) {
        console.log(err);
        process.exit(1); 
    }
};


module.exports=connectionDB;