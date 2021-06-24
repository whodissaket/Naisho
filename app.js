const express = require('express');
const ejs = require('ejs');
const app = express();
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");



app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "Secrethaiyehmeinnhibataunga";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });


const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {

    res.render("login");

});
app.get("/register", function(req, res) {

    res.render("register");

});


// Post Requests start here ....
//RegisterRequest
app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

//LoginRequest
app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ email: username }, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {

                if (foundUser.password === password) {
                    res.render("secrets");
                };
            };
        };
    });
});







//
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function() {
    console.log("Server started succesfully");
});