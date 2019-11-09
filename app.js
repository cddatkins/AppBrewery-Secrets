//jshint esversion:6

//Requirements
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

//Application
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//Database
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/userDB");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("user", userSchema);

//Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({email: userName}, (err, foundUser) =>{
    if(err) {
      res.send(err);
    }
    else {
      if(foundUser) {
        if(foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  const newUser = new User({email: req.body.username, password: req.body.password});
  newUser.save((err) =>{
    if(err){
      res.send(err);
    }
    else {
      res.render("secrets");
    }
  });
});

var port = 3000;
app.listen(port, () => {
  console.log("Successfully Started App");
});
