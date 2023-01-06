require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://0.0.0.0:27017/userDB");

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("user", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/secrets", function(req, res){
    res.render("secrets");
});

app.post("/register", function(req, res){
    const user = new User({
        email: req.body.username,
        password: req.body.password
    });

    User.findOne({email: req.body.username}, function(err, foundUser){
        if(!err){
            if(!foundUser){
                user.save(function(err){
                    if(!err){
                        res.render("secrets");
                    }
                });
            } else{
                console.log("User already exists");
            }
        }
    });
    
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if(!err){
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }else{
                    console.log("Incorrect password");
                }
            } else{
                console.log("Incorrect username");
            }
        }
    });
});

app.listen(3000, function(){
    console.log("Server is running on port 3000.");
});