const express = require('express');
const router = express.Router();

const BookModel = require('../models/Book.model');
const AuthorModel = require('../models/Author.model');

const { ObjectId } = require('mongodb');

// READ: display all books
router.get("/books", (req, res, next) => {
  
  BookModel.find()
    // .then((books) => {
    //   // res.send(`books in db: ${booksFromDB.length}`)
    //   res.render("books/books-list", {books: books}) // same as {books}
    // })
    .populate("author") // replace new ObjectId() references by corresponding documents
    .then((booksFromDB) => {
      // res.send(`books in db: ${booksFromDB.length}`)
      res.render("books/books-list", {books: booksFromDB})
      // console.log(booksFromDB[0]._id) // returns new ObjectId("<ID>") where <ID> is 24 character hexadecimal string value 
      // console.log(typeof booksFromDB[0]._id) // returns object
      // console.log(booksFromDB[0]._id.toString())
      // console.log(Object.prototype.toString(booksFromDB[0]._id))
    })
    .catch( e => {
      console.log("error getting list of books from DB", e);
      next(e);
    })
});

// CREATE: display form
// MUST BE BEFORE GET /books/:bookId !!!
// otherwise:
// CastError: Cast to ObjectId failed for value "create" (type string) at path "_id" for model "Book"
router.get("/books/create", (req, res, next) => {
  AuthorModel.find()
    .then( authorsFromDB => {
        res.render("books/book-create", {authorsArr: authorsFromDB});
    })
    .catch( e => {
        console.log("error displaying book create form", e);
        next(e);
    });
})

// CREATE: process form
router.post("/books/create", (req, res, next) => {

  // do not pass req.body directly to create new book in case user has added extra properties...

  // const newBook = {
  //   title: req.body.title,
  //   description: req.body.description,
  //   author: req.body.author,
  //   rating: req.body.rating
  // }
  // BookModel.create(newBook);

  const {title, description, author, rating} = req.body
  BookModel.create({title, description, author, rating})
    .then((newBook) => {
      console.log(newBook);
      // res.locals to pass information
      res.redirect("/books")
    })
    .catch( e => {
        console.log("error creating new book", e);
        next(e);
    });
});

// UPDATE: display form
router.get("/books/:bookId/edit", (req, res, next) => {

  //BookModel.find({_id: req.params.bookId})
  // BookModel.findById(req.params.bookId)
  //   .then((bookFromDB) => {
  //     res.render("books/book-edit", bookFromDB)
  //   })
  //   .catch( e => {
  //     console.log("error getting book from DB", e);
  //     next(e);
  //   })

  // using book-edit2.hbs
  const { bookId } = req.params;
  let authors;
  AuthorModel.find()
    .then((authorsFromDB) => {
      authors = authorsFromDB;
      return BookModel.findById(bookId)
    })
    .then((bookFromDB) => {
      res.render('books/book-edit2.hbs', { book: bookFromDB, authors: authors });
    })
    .catch(error => next(error));
});

// // UPDATE: display form (**ASYNC**)
// router.get('/books/:bookId/edit', async (req, res, next) => {
//   const { bookId } = req.params;
//   try {
//     const authors = await AuthorModel.find();
//     const bookFromDB = await BookModel.findById(bookId);
//     res.render('books/book-edit2.hbs', { book: bookFromDB, authors: authors });
//   } catch (e) {
//     next(e);
//   }
// });

// UPDATE: process form
router.post("/books/:bookId/edit", (req, res, next) => {
  const {title, description, author, rating} = req.body
  BookModel.findByIdAndUpdate(req.params.bookId, {title, description, author, rating}, {new: true})
    .then((book) => {
      res.redirect("/books/" + book._id)
    })
    .catch( e => {
        console.log("error updating book", e);
        next(e);
    });
});

// DELETE: delete book
router.post("/books/:bookId/delete", (req, res, next) => {
  // BookModel.findByIdAndDelete(req.params.bookId)

  BookModel.deleteOne({_id: req.params.bookId})
    .then((bookFromDB) => {
      console.log("book deleted, id was: " + req.params.bookId)
      res.redirect("/books")
    })
    .catch( e => {
      console.log("error deleting book from DB", e);
      next(e);
    })
});

// READ: display details of one book
router.get("/books/:bookId", (req, res, next) => {

  BookModel.find({_id: req.params.bookId})
    .then((bookFromDB) => {
      // res.render("books/book-details", bookFromDB[0])

      // console.log({...bookFromDB[0]}) // /!\ not the same as console.log(bookFromDB[0]);
      // returns 
      // {
      //   '$__': InternalCache {...},
      //   '$isNew': false,
      //   _doc: {
      //     _id: ...,
      //     title: ...,
      //     ...
      //   }
      // }

      // console.log({...bookFromDB[0]})
      // spread operator has almost the lowest precedence
      // res.render("books/book-details", {...{...bookFromDB[0]}._doc, id2: bookFromDB[0]._id.toString()})
      // _doc is a hidden property visible after the spread, but accessible even before the spread
      // console.log(bookFromDB[0]._doc)
      res.render("books/book-details", {...bookFromDB[0]._doc, id2: bookFromDB[0]._id.toString()})
    })
    .catch( e => {
      console.log("error getting book details from DB", e);
      next(e);
    })
});

// // READ: display details of one book
// router.get("/books/:bookId", (req, res, next) => {
//   BookModel.findById(req.params.bookId)
//       .populate("author")
//       .then(bookFromDB => {
//           res.render("books/book-details", bookFromDB);
//       })
//       .catch(e => {
//           console.log("error getting book details from DB", e);
//           next(e);
//       });
// });

// -- //

module.exports = router;
