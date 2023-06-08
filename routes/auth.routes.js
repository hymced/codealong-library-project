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
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/; // using positive lookahead // https://regex101.com/
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
                res.status(400).render('auth/signup', {errorMessage: e.message});
            } else if (e instanceof MongoServerError && e.code === 11000) {
                res.status(400).render('auth/signup', {errorMessage: 'Email needs to be unique.'});
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

// ABOUT: THENABLE QUERIES / PROMISES / EXEC / RETURNS
// router.post("/login", (req, res, next) => {
//     UserModel.findOne({email: req.body.email}, user => {
//         // MongooseError: Model.findOne() no longer accepts a callback
//     })
// })
// router.post("/login", (req, res, next) => {
//     const query = UserModel.findOne({email: req.body.email})
//     const promise = query.exec((user) => {
//         // MongooseError: Query.prototype.exec() no longer accepts a callback
//     })
// })
// router.post("/login", (req, res, next) => {
//     const query = UserModel.findOne({email: req.body.email})
//     const promise = query.exec()
//     console.log(promise) // Promise { <pending> }
// })
// router.post("/login", async (req, res, next) => {
//     const query = UserModel.findOne({email: req.body.email})
//     const promise = query.exec()
//     console.log(promise) // Promise { <pending> }
//     const user = await promise
//     // const user = await query.exec()
// })
// router.post("/login", async (req, res, next) => {
//     const query = UserModel.updateOne({email: req.body.email}, {email: req.body.email + "2"})
//     const promise = query.exec('updateMany')
//     const updateResult = await promise
//     console.log(updateResult)
// })
// router.post("/login", (req, res, next) => {
//     const query = UserModel.updateMany({email: req.body.email}, {email: req.body.email + "2"}, (error, writeOpResult) => {
//         // executed because of the callback
//         // MongooseError: Query.prototype.exec() no longer accepts a callback
//     })
// })
// router.post("/login", (req, res, next) => {
//     const query = UserModel.updateOne({email: req.body.email}, {email: req.body.email + "2"})
//     // never executed
// })
// router.post("/login", async (req, res, next) => {
//     const query = UserModel.updateOne({email: req.body.email}, {email: req.body.email + "2"})
//     updateResult = await query // execute the query
// })
// https://mongoosejs.com/docs/api/query.html#Query.prototype.updateOne()
// https://mongoosejs.com/docs/api/model.html#Model.updateOne()
// https://mongodb.github.io/node-mongodb-native/5.5/classes/Collection.html#updateOne
// https://mongodb.github.io/node-mongodb-native/5.5/interfaces/UpdateResult.html
// https://www.mongodb.com/docs/manual/reference/command/update/#update-command-output
// router.post("/login", async (req, res, next) => {
//     const query = UserModel.findOneAndUpdate({email: req.body.email}, {email: req.body.email + "2"}, {new: true})
//     // never executed, only declare the query, but does not issue the corresponding mongodb findOneAndUpdate() command, mongoose API reference is wrong
// })
// router.post("/login", async (req, res, next) => {
//     const query = UserModel.findOneAndUpdate({email: req.body.email}, {email: req.body.email + "2"}, {new: true})
//     const document = await query // execute the query and issue the mongodb findOneAndUpdate() command
// })
// .then() executes the query and returns a promise (as does async/await)
// https://mongoosejs.com/docs/models.html
// https://mongoosejs.com/docs/api/model.html
// https://mongoosejs.com/docs/queries.html
// https://mongoosejs.com/docs/api/query.html
// https://mongoosejs.com/docs/queries.html#queries-are-not-promises
// router.post("/login", async (req, res, next) => {
//     const query = UserModel.findOneAndUpdate(
//         {email: req.body.email}, 
//         {email: req.body.email + "2"}, 
//         {new: 'true'} // or {returnDocument: 'after'} or {returnOriginal: false}
//     )
//     const document = await query
// })
// mongoose 7.2.2 --> mongodb 5.5.0
// https://mongoosejs.com/docs/api/query.html#Query.prototype.findOneAndUpdate()
// https://mongoosejs.com/docs/6.x/docs/api/query.html#query_Query-findOneAndUpdate
// https://mongoosejs.com/docs/5.x/docs/api/query.html#query_Query-findOneAndUpdate
// https://mongoosejs.com/docs/api/model.html#Model.findOneAndUpdate()
// https://mongoosejs.com/docs/6.x/docs/api/model.html#model_Model-findOneAndUpdate
// https://mongoosejs.com/docs/5.x/docs/api/model.html#model_Model.findOneAndUpdate
// https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/
// https://mongodb.github.io/node-mongodb-native/
// https://mongodb.github.io/node-mongodb-native/5.5/classes/Collection.html#findOneAndUpdate
// https://mongodb.github.io/node-mongodb-native/5.5/interfaces/ModifyResult.html
// https://mongodb.github.io/node-mongodb-native/4.16/interfaces/ModifyResult.html
// deprecated
// This type will be completely removed in 5.0 and findOneAndUpdate, findOneAndDelete, and findOneAndReplace will then return the actual result document.
// router.post("/login", async (req, res, next) => {
//     const query = UserModel.findByIdAndDelete("6480a651870e782b9403712a")
//     const documentDeleted = await query
// })
// findByIdAndDelete(id) is a shorthand for findOneAndDelete({ _id: id })
// https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndDelete/
// https://mongoosejs.com/docs/api/query.html#Query.prototype.findOneAndDelete()
// https://mongoosejs.com/docs/api/model.html#Model.findOneAndDelete()

// W10 SCREEN RECORDER / GAME BAR --> WIN+ALT+G

router.post("/login", (req, res, next) => {
    const {email, password} = req.body;
    if (email === '' || password === '') {
        res.status(400).render('auth/login', {errorMessage: 'Please enter both, email and password to login.'});
        return;
    }
    
    // ABOUT: LEAN
    // https://mongoosejs.com/docs/tutorials/lean.html
    // The lean option tells Mongoose to skip hydrating the result documents.
    // By default, Mongoose queries return an instance of the Mongoose Document class. 
    // Documents are much heavier than vanilla JavaScript objects, because they have a lot of internal state for change tracking. 
    // Enabling the lean option tells Mongoose to skip instantiating a full Mongoose document and just give you the POJO (Plain Old JavaScript Object).
    // https://mongoosejs.com/docs/api/model.html#Model.findOne()
    // https://mongoosejs.com/docs/api/query.html#Query.prototype.setOptions()
    // The following options are only for:
    // - find(), 
    // - findOne(), 
    // - findById(), 
    // - findOneAndUpdate(), 
    // - findOneAndReplace(), 
    // - findOneAndDelete(), 
    // - findByIdAndUpdate(): 
    //      - lean
    //      - populate
    //      - projection
    // https://mongoosejs.com/docs/api/query.html#Query.prototype.lean()
    // new Query().lean() // true
    // new Query().lean(true)
    // new Query().lean(false)
    // const docs = await Model.find().lean();
    // docs[0] instanceof mongoose.Document; // false
    // UserModel.findOneAndUpdate({email}, null, {lean: true}) // the option is only listed in the mongoose API reference for findOneAndUpdate(), but it is also available for findOne()
    //     .then(user => console.log({...user})) // POJO document only, not nested in _doc anymore
    // UserModel.findOneAndUpdate({email}, {lean: true}) // this syntax does not exist
    //     .then(user => console.log({...user})) // POJO document still nested in _doc
    // UserModel.findOneAndUpdate({email})
    //     .then(user => console.log({...user.toObject()})) // ok using .toObject() because mongoose wraps an object and adds getters/setters for the properties
    // UserModel.findOneAndUpdate({email})
    //     .lean()
    //     .lean({lean: true})
    //     .lean({}) // any object (all are truthy) works
    //     .then(user => console.log({...user})) // ok too
    // UserModel.findOneAndUpdate({email})
    //     .setOptions({lean: true})
    //     .then(user => console.log({...user})) // ok too
    
    UserModel.findOne({email: email}, null, {lean: true})
        .then(user => {
            if (!user) {
                // user doesn't exist (mongoose returns "null")
                res.status(400).render('auth/login', {errorMessage: 'Email is not registered. Try with other email.'});
                return;
            } else if (bcryptjs.compareSync(password, user.passwordHash)){
                // login sucessful
                req.session.favFood = "pizza"
                req.session.currentUser = user; // store info in req.session (will be available in further requests)
                res.render("auth/user-profile", {user})
            } else {
                //login failed
                res.status(400).render('auth/login', {errorMessage: 'Incorrect credentials.'});
            }
        })
        .catch(error => {
            console.log("error trying to login", error);
            next(error);
        });
});

// GET /user-profile
router.get('/user-profile', (req, res) => {
    const food = req.session.favFood;
    console.log({food})
    res.render("auth/user-profile", {user: req.session.currentUser});
});

// POST /logout
router.post("/logout", (req, res, next) => {
    req.session.destroy(e => {
        if (e) next(e);
        res.redirect('/');
    });
})

module.exports = router;