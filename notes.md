# TO DIG / QUESTION

https://mongoosejs.com/docs/queries.html#queries-are-not-promises

> Mongoose queries are not promises. They have a .then() function for co and async/await as a convenience. However, unlike promises, calling a query's .then() can execute the query multiple times.

# FIX

```localhost ECONNREFUSED ::1:27017```

> This connection refused message indicates an attempted connection via the IPv6 localhost alias ::1 (0:0:0:0:0:0:0:1).  
> By default mongod does not bind to IPv6 addresses: you would have to set net.ipv6 to true and add appropriate IPv6 addresses in net.bindIp.  
> If you are using the default mongod configuration you should be able to connect to localhost:27017 or the equivalent IPv4 address 127.0.0.1:27017.

```C:\Program Files\MongoDB\Server\6.0\bin\mongod.cfg```

default:
```
# network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1
```

change to:
```
# network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1, localhost
  ipv6: true
```

then restart MongoDB Server (Mongo DB) service (mongod) in services.msc

default path to executable:

```
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --config "C:\Program Files\MongoDB\Server\6.0\bin\mongod.cfg" --service
```

- or make a new config file and run mongod --config mongod.dev.cfg
- or just pass in the command line argument mongod --ipv6

## Sources:

- https://stackoverflow.com/questions/46523321/mongoerror-connect-econnrefused-127-0-0-127017
- https://www.mongodb.com/community/forums/t/econnrefused-27017/131911/6
- https://github.com/Automattic/mongoose/issues/10917

# TO DO:

 GET /books/:bookId" 
 
 (Super Bonus) Functionality to filter books by min rating
- Modify route /books
- Use query string + method .filter()
- Provide a form so that users can search

- error cast???

# CRUD ROADMAP

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