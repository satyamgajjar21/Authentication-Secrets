//jshint esversion:6
//use of dotenv for environment variables
require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose"); //import mongoose to connect with database
const encrypt = require("mongoose-encryption");

const app = express();

//env
console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

//use mongoose to connect to the database
mongoose.connect("mongodb://localhost:27017/userDB");

//create a new schema
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

//create a secret string for mongoose encryption

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

//use the schema to create the model
const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});
 
// REGISTER //post the data which the user has entered
app.post("/register", function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if (err) {
            console.log(err);
        } else {
            //if there is no error then save the new user and render the secrets page.
            res.render("secrets");
        }
});
});

// LOGIN //post the data which the user has entered
app.post("/login", function(req, res){
    const username =  req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            if (foundUser){ 
               if (foundUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    })
})
 
app.listen(4000, function(){
    console.log("Server is running on port 4000");
});
