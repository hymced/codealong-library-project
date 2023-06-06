const express = require('express');
const router = express.Router();

const BookModel = require('../models/Book.model');
const AuthorModel = require('../models/Author.model');

const { ObjectId } = require('mongodb');

// GET /authors
router.get("/authors", (req, res, next) => {
  
	AuthorModel.find()
	  .then((authorsFromDB) => {
		res.render("authors/authors-list", {authors: authorsFromDB})
	  })
	  .catch( e => {
		console.log("error getting list of authors from DB", e);
		next(e);
	  })
  });

  module.exports = router;