const express = require("express")
let {UserModel, TodoModel} = require("./db")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const JWT_SECRET = "dfghjk"
require("dotenv").config()

const app = express()
app.use(express.json())

mongoose.connect(process.env.MONGO_URL)

app.post("/signup", async function(req, res){
    let {username, password, email} = req.body;
    await UserModel.create({
        username,
        password,
        email
    })
    res.json({
        message: "You are signed up!"
    })
})

app.post("/login", async function(req, res){
    let {password, email} = req.body;
    let user = await UserModel.findOne({
        password, email
    })
    if(user){
        let token = jwt.sign({
            _id: user._id
        }, JWT_SECRET)
        res.json({
            message: "You are logged in now!",
            token
        })
    }else{
        res.json({
            message: "Incorrect Credientials"
        })
    }
})

app.use(function(req, res, next){
    let token = req.headers.token;
    let deocdedUser = jwt.verify(token, JWT_SECRET)
    if(deocdedUser){
        req._id = deocdedUser._id;
        next()
    }else{
        res.json({
            message: "You are not logged in!"
        })
    }
})

app.get("/todos", async function(req, res){
    let _id = req._id;
    let user = await UserModel.findOne({
        _id
    })
    res.json({
        user
    })
})

app.post("/todo", function(req, res){

})

app.listen(3000);