https://mongoosejs.com/docs/queries.html#queries-are-not-promises

Mongoose queries are not promises. They have a .then() function for co and async/await as a convenience. However, unlike promises, calling a query's .then() can execute the query multiple times.

TO DO:

 GET /books/:bookId"
(Super Bonus) Functionality to filter books by min rating
- Modify route /books
- Use query string + method .filter()
- Provide a form so that users can search


- error cast???


[x] READ list of books

    - create a route: GET "/books"
      - Book.find()
    - create view: "books-list.hbs"

[x] READ details of a book

    - create a new route: GET "/books/:bookId"
      - req.params.bookId
      - Book.findById()
    - create view: "books/book-details.hbs"

[x] CREATE a book

    1. GET /books/create ---> DISPLAY FORM
        - view with a form (post)

    2. POST /books/create ---> PROCESS THE FORM
       - create a new route
         - req.body
         - Book.create(data)

[x] UPDATE a book

    1. GET /books/:bookId/edit ---> DISPLAY FORM
       Book.findById(id)
    2. POST /books/:bookId/edit ---> PROCESS THE FORM

[x] DELETE a book