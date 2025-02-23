const express=require('express');

const app=express();

app.use(express.json());

const memeory=[{
    user:"name",
    email:"email",
    passsword:"password"
}];

function signin(req,res,next){
    const email=req.body.email;
    const password=req.body.password
     memeory.map((memory)=>{
        if(memory.email===email){
           if(memory.password===password){
            res.status(200).json({message:"login suucessfully"});
           }
           else{
            res.status(201).json({message:"password incorrect"});
           }
        }});
        res.status(200).json({message:"email not found please signup"});
}

function signup(req,res,next){
    const username=req.body.username;
    const email=req.body.email;
    const password=req.body.password;
    if(username===undefined ||email===undefined ||password===undefined){
        res.status(201).json({message:"kindly fill all forms"});
    }
    memeory.map((memory)=>{
    if(memory.email===email){
        res.status(201).json({message:"email was already exist"});
    }
   })
   const newuser={username:username,
                email:email,
                password:password
      }
      memeory.push(newuser);
      console.log(memeory);
      res.status(200).json({message:"signup succesfully"});
}
app.post('/signin',signin);
app.post('/signup',signup);

app.listen(3000,()=>{
    console.log("server activated");
})