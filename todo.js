const express=require('express');
const jwt=require("jsonwebtoken");
const JWT_SECRETE="randomabc";

const app=express();

app.use(express.json());

const users=[];
const todos=[];

function signup(req,res,next){
    const username=req.body.username;
    const email=req.body.email;
    const password=req.body.password;
     
    const checkemail=users.find(f=>f.email===email);

    if(checkemail===undefined){
        users.push({
            username:username,
            email:email,
            password:password})
       res.json({message:"signed up"});
    }
    
}

function signin(req,res,next){
    const email=req.body.email;
    const password=req.body.password;

    const founduser=users.find(f=>f.email===email&&f.password===password);
    if(founduser){
        const token=jwt.sign({
            email:email
        },JWT_SECRETE);
        res.json({
            token:token,
            message:"signed in"
        })
    }
}

function showtodos(req,res,next){
    try{
    const token=req.headers.token;
    if(!token){
        return res.status(500).json({message:"Authorization: Token is required"});
    }
    const decodeInformation=jwt.verify(token,JWT_SECRETE);
    const email=decodeInformation.email;
   
    const founduser=todos.find(f=>f.email===email);

    if(founduser){
        res.json({todos:founduser});
    }
}
   catch(err){
    return res.status(401).json({message:"Token Invalid ",error:err.mesage});
   }
}

function createtodo(req,res,next){
    try{
    const token=req.headers.token;
    if(!token){
        return res.status(401).json({message:"Unauthorized:Token missing"})
    }
    const id=req.body.id;
    const task=req.body.task;
    
    if(!id ||!task){
        return res.status(400).json({message:"Bad requst :ID and task are required"})
    }

    const decodeInformation=jwt.verify(token,JWT_SECRETE);
    const email=decodeInformation.email;
    const founduser=todos.find(f=>f.email===email);

    if(founduser){
        const newtask={id:founduser.todos.length+1, task:task}
        founduser.todos.push(newtask);
    }
    else{
        todos.push({email:email,todos:[{id:1,task:task}]});
    }

    return res.json({message:"Added succesfully"});
}catch(err){
    return res.status(500).json({message:"Internal server error ", error:err.message})
}
}

app.post('/signup',signup);
app.post('/signin',signin);
app.get('/todos',showtodos);
app.post('/add',createtodo)

app.listen(3000,()=>{
    console.log("Server activated");
})