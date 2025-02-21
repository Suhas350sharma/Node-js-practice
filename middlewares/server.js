const express=require('express');

const app=express();

let count=0;

app.use(function(req,res,next){//this runs on any http methods will executes
 console.log(`method:${req.method},url:${req.url}`);
 if(req.method==="GET"){
 res.json({message:"responce sent for get method "});
 }
 count++;
 console.log(`count:${count}`);
 next();
})

function middleware(req,res,next){ //this runs when we use this function in our http method 
  res.json({message:"responce sent by middleware"});
  next()
}
app.get('/');
app.post('/post',(req,res)=>{
  res.json('from post method')
})
app.put('/put',middleware);

app.listen(3000,()=>{
  console.log("server activated");
})