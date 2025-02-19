const express=require('express');
const fs=require('fs');

const app=express();

const filename='a.txt';

app.use(express.json());

app.get('/',(req,res)=>{
    fs.readFile(filename,'utf8',(err,data)=>{
        if(err){
            console.log('error reading file',err);
        }
        else{
            res.status(200).json({content:data});
        }
    });
});

app.post('/new',(req,res)=>{
    const content=req.body.content;
    if(!content){
        return res.status(400).json({message:'task is required'});
    }
    fs.writeFile(filename,content,(err)=>{

        if(!filename){
         return   res.status(500).json({message:"error in file"});
        }
        if(err){
          return  res.status(500).json({message:"error writing file"})
        }
        else{
          return  res.status(404).json({message:"succesfully completed"});
        }
    })
})

app.put('/add',(req,res)=>{
    const newdata=req.body.newdata;
    if(!newdata){
        return res.status(500).json({message:"message is required"});
    }
    fs.appendFile(filename,newdata,(err)=>{
        if(err){
            return res.status(500).json({message:'error adding text to file'});
        }
        res.status(200).json({message:'file updated succesfully'});
    })
})

app.delete('/',(req,res)=>{
    fs.unlink(filename,(err)=>{
        if(err){
            return res.status(500).json({message:'error deleting the file....'})
        }
        res.status(200).json({message:"file deleted succesfully..."});
    })
})

app.listen(3000,()=>{
    console.log('Server Activated')
})