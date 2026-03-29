let bcrypt = require("bcrypt");
const express = require("express");
let { UserModel, TodoModel } = require("./db");
const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRET;
const { z } = require("zod");

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL);

app.post("/signup", async function (req, res) {
  let user = z.object({
    username: z.string(),
    password: z.string().min(3).max(5),
    email: z.string().email(),
  });
  let { username, password, email } = req.body;
  let validateBody = user.safeParse(req.body);
  let hashPass = await bcrypt.hash(password, 5);
  try {
    if (validateBody.success) {
      await UserModel.create({
        username,
        password: hashPass,
        email,
      });
      res.json({
        message: "You are signed up!",
      });
    }else{
        res.json({
            error: validateBody.error.name
        })
    }
  } catch (e) {
    res.json({
      error: e.errorResponse.errmsg,
    });
    return;
  }
});

app.post("/login", async function (req, res) {
  let { password, email } = req.body;
  let user = await UserModel.findOne({
    email,
  });
  let authPass;
  if (user) {
    authPass = await bcrypt.compare(password, user.password);
  } else {
    res.json({
      message: "User does not exist",
    });
  }
  if (authPass) {
    let token = jwt.sign(
      {
        _id: user._id,
      },
      JWT_SECRET,
    );
    res.json({
      message: "You are logged in now!",
      token,
    });
  } else {
    res.json({
      message: "Incorrect Credientials",
    });
  }
});

app.use(function (req, res, next) {
  let token = req.headers.token;
  let deocdedUser = jwt.verify(token, JWT_SECRET);
  if (deocdedUser) {
    req._id = deocdedUser._id;
    next();
  } else {
    res.json({
      message: "You are not logged in!",
    });
  }
});

app.get("/todos", async function (req, res) {
  let _id = req._id;
  let user = await UserModel.findOne({
    _id,
  });
  res.json({
    user,
  });
});

app.post("/todo", function (req, res) {});

app.listen(3000);
