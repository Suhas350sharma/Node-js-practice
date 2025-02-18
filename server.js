const express=require('express');
const fs=require("fs");


const filename="a.txt";
fs.writeFile(filename,"hello itzz me",(err)=>{
    if(err){
        console.log("Error writeng file:",err);
    }
    else{
        console.log("file written succesfully");

        fs.readFile(filename,'utf8',(err,data)=>{
            if(err){
                console.log("error reading file:",err);
            }
            else{
                console.log("file data :",data);

                fs.appendFile(filename,'hello again itzz meee!',(err,data)=>{
                    if(err){
                        console.log("error for appending file:",err);
                    }
                    else{
                        console.log("file updated successfully");

                        fs.readFile(filename,'utf8',(err,ud)=>{
                            if(err){
                                console.log("error reading file");
                            }
                            else{
                                console.log("updated data",ud);
                            }
                        })
                    }
                })
            }
        })
    }
})