const express= require('express');
const app = express();
const path= require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectionDB =require('./db');
const user= require('./Routers/userrouter');
const chat= require('./Routers/chatrouter');
const message= require('./Routers/messagerouter');
const Port= 5000;




app.use(express.json());
app.use(cors({
    credentials: true, 
  origin: "http://localhost:3000"
 }));

app.use((req, res, next) => {
res.locals.path = req.path;
next();
});
app.use(cookieParser());
connectionDB();

app.use('/api/user', user);

app.use('/api/chat', chat);

app.use('/api/messages', message);


app.use(express.static(path.join(__dirname,'User')));

app.listen(Port, function(){
    console.log('Server Connected Sucesssfully',Port);
});