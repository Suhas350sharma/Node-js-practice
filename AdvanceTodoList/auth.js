require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const JWT_SECRET = 'Rohitsharma' 
const { UserModel, TodoModel } = require("./db");

console.log(JWT_SECRET);

mongoose.connect("mongodb+srv://suhas:Fordmustang1969@suhas.cbbha.mongodb.net/Advance-todo-List");

const app = express();
app.use(express.json());

function Validate(req, res, next) {
    const Schema = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(6)
    });

    const parsedData = Schema.safeParse(req.body);console.log(parsedData)
    if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid format" });
    }
    next();
}

app.post('/signup', async function (req, res) {
    try {
        const requiredBody = z.object({
            Username: z.string().min(3).max(100),
            email: z.string().min(3).max(100).email(),
            password: z.string().min(6)
        });

        const parsedatawithsucess = requiredBody.safeParse(req.body);
        if (!parsedatawithsucess.success) {
            return res.json({ message: "Incorrect format" });
        }

        const { Username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        await UserModel.create({ Username, email, password: hashedPassword });

        res.json({ message: "You signed up successfully" });

    } catch (error) {
        res.status(500).json({ message: "Signup failed", error: error.message });
    }
});


app.post('/signin', Validate, async function (req, res) {
    try {
        const { email, password } = req.body;
   
        const findUser = await UserModel.findOne({ email });
        
        if (!findUser) {
            return res.status(403).json({ message: "Invalid credentials" });
        }

        const passwordMatch = await bcrypt.compare(password, findUser.password);
        if (!passwordMatch) {
            return res.status(403).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: findUser._id.toString() }, JWT_SECRET, { expiresIn: "1h" });
        console.log(token);

        res.json({ message: "You signed in", token });

    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
});


async function auth(req, res, next) {
    try {
        // console.log("Headers received:", req.headers); 

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided or incorrect format" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token missing from Authorization header" });
        }

        let userdetails;
        try {
            userdetails = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token has expired, please log in again" });
            } else {
                return res.status(401).json({ message: "Invalid token" });
            }
        }

        const user =userdetails.id;
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        // console.log(req.user);
        next();
    } catch (error) {
        res.status(500).json({ message: "Auth error", error: error.message });
    }
}

app.get("/me", auth, (req, res) => {
    res.json({ user: req.user });
});

app.post("/addtodos",auth,async function (req,res,){
     try{
        const { Title, done}=req.body;

        if(!Title || !done){
            return res.status(400).json({messsage:"Title/field is empty"})
        }
        userId=req.user;
       console.log(typeof userId);
        const newUser=await TodoModel.create({Title,done,UserId:userId});
        return res.json({message:"Added Successfully"});
     }
     catch(error){
        return res.status(400).json({message:"unable to add todos",error:error.message})
     }
})

app.get("/todos",auth,async function(req,res,){
    try{
    const userId=new mongoose.Types.ObjectId(req.user);
    const todos=await TodoModel.find({UserId:userId});
    res.json({
        todos:todos
    })
}
catch(error){
    res.status(400).json({
              message:"error while accessing todos",error:error.message
    })
}
})

app.put('/updatetodos/:id',auth,async function(req,res){
    try{
    const {id}=req.params;
    const update= await TodoModel.findByIdAndUpdate(id,req.body);
    if(!update){
        return res.status(404).json({message:`cannot find any product with ID ${id}`});
    }
    const updatetodos=await TodoModel.findById(id);;
    res.json(updatetodos);
}
catch(error){
    return res.status(500).json({message:error.message});
}
})
app.delete('/deletetodos/:id',auth,async function(req,res){
    const {id}=req.params;
    const todo=await TodoModel.findByIdAndDelete(id);
    if(!todo){
        return res.status(404).json({message:`id not found ${id}`});
    }
    const userID=req.user;
    const remainingTodos=await TodoModel.find({UserId:userID});
    res.json({message:"Todo deleted successfully",
        remainingtodos:remainingTodos
    });
})
app.listen(3000, () => {
    console.log("Server Activated on Port 3000");
});
