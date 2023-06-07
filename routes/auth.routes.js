const express = require('express');
const bcryptjs = require("bcryptjs");
const { MongoServerError } = require('mongodb');

const router = express.Router();

const UserModel = require("../models/User.model");
const { default: mongoose } = require('mongoose');

const saltRounds = 12; // default is 10

// GET /signup
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

// POST /signup
router.post("/signup", (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your email and password.' });
        return; 
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/; // https://regex101.com/
    if (!regex.test(password)) {
        res.status(400).render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }
    bcryptjs
        // .genSalt() // uses default
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(password, salt);
        })
        .then(hash => {
            // const {email} = req.body.email
            // return UserModel.create({email, passwordHash: hash})
            return UserModel.create({email: req.body.email, passwordHash: hash})
            // return UserModel.create({email: req.body.email}) // generate a mongoose.Error.ValidationError 
            // (or change input tag attribute type from email to text) 
            // (one can also copy as fetch the request from chrome dev tools > network, tamper the data, then paste in console)
        })
        .then(user => {
            res.redirect("/user-profile")
        })
        .catch(e => {
            if (e instanceof mongoose.Error.ValidationError) {
                res.status(400).render('auth/signup', { errorMessage: e.message });
            } else if (e instanceof MongoServerError && e.code === 11000) {
                res.status(400).render('auth/signup', { errorMessage: 'Email needs to be unique.' });
            } else {
                console.log("other error of class " + e.constructor.name)
                next(e)
            }
        });
})

//GET /login
router.get("/login", (req, res, next) => {
    res.render("auth/login");
});

//POST /login
router.post("/login", (req, res, next) => {
    const { email, password } = req.body;
    if (email === '' || password === '') {
        res.status(400).render('auth/login', { errorMessage: 'Please enter both, email and password to login.' });
        return;
    }
    // UserModel.findOne({email: email})
    UserModel.findOne({email})
        .then( user => {
            if (!user) {
                // user doesn't exist (mongoose returns "null")
                res.status(400).render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
                return;
            } else if (bcryptjs.compareSync(password, user.passwordHash)){
                res.send("login sucessful")
            } else {
                res.send("login failed")
            }
        })
        .catch(error => {
            console.log("error trying to login", error);
            next(error);
        });
});

// GET /user-profile
router.get('/user-profile', (req, res) => {
    res.render("auth/user-profile")
});

module.exports = router;