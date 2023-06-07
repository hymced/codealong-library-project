const express = require('express');
const bcryptjs = require("bcryptjs");

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
    bcryptjs
        // .genSalt() // uses default
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(password, salt);
        })
        .then(hash => {
            // const {email} = req.body.email
            // return UserModel.create({email, passwordHash: hash})
            // return UserModel.create({email: req.body.email, passwordHash: hash})
            return UserModel.create({email: req.body.email}) // generate a mongoose.Error.ValidationError 
            // (one can also copy as fetch the request from chrome dev tools > network, tamper the data, then paste in console)
        })
        .then(user => {
            res.redirect("/user-profile")
        })
        .catch(e => {
            if (e instanceof mongoose.Error.ValidationError) {
                res.status(400).render('auth/signup', { errorMessage: e.message });
            } else {
                next(e)
            }
        });
})

// GET /user-profile
router.get('/user-profile', (req, res) => res.send("user profile"));

module.exports = router;