const express = require('express');
const bcryptjs = require("bcryptjs");

const router = express.Router();

const UserModel = require("../models/User.model")

const saltRounds = 12; // default is 10

// GET /signup
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

// POST /signup
router.post("/signup", (req, res, next) => {
    const {email, password} = req.body;
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
        })
		.then(user => {
			res.redirect("/user-profile")
		})
        .catch(e => {
            next(e)
        });
})

// GET /user-profile
router.get('/user-profile', (req, res) => res.send("user profile"));

module.exports = router;