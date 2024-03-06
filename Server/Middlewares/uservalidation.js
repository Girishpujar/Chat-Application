const jwt=require('jsonwebtoken');

const validation = async(req, res, next)=>{
    const cookie= req.headers.cookie;
    const token= cookie?.split("=")[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY,(Error, newUser)=>{
        if(Error){
            if (Error.name === 'TokenExpiredError') {
                return res.status(400).json({message: "Token has expired",newUser});
              }
            return res.status(404).json({message:" Signin Please"});
        }
        console.log("Decoded User:",newUser.id);
        req.newUser = newUser.id;
        next();
    });
}

module.exports=validation;