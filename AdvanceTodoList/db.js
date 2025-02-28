const mongoose=require('mongoose');
const { boolean, object } = require('zod');
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;


const User=new Schema({
    Username:String,
    email:{type:String,unique:true},
    password:String
});

const todos=new Schema({
    Title:String,
    done:Boolean,
    UserId:ObjectId
});

const UserModel=mongoose.model("Users",User);
const TodoModel=mongoose.model("Todos",todos);

module.exports={
    UserModel,
    TodoModel
}