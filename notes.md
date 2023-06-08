# TO DIG / QUESTION

https://mongoosejs.com/docs/queries.html#queries-are-not-promises

> Mongoose queries are not promises. They have a .then() function for co and async/await as a convenience. However, unlike promises, calling a query's .then() can execute the query multiple times.

For example, the below code will execute 3 updateMany() calls, one because of the callback, and two because .then() is called twice.

```
const q = MyModel.updateMany({}, { isDeleted: true }, function() {
  console.log('Update 1');
});

q.then(() => console.log('Update 2'));
q.then(() => console.log('Update 3'));
```

Don't mix using callbacks and promises with queries, or you may end up with duplicate operations. That's because passing a callback to a query function immediately executes the query, and calling then() executes the query again.

https://mongoosejs.com/docs/promises.html
## Queries are not promises
Mongoose queries are not promises. They have a .then() function for co and async/await as a convenience. If you need a fully-fledged promise (*), use the .exec() function.
## Queries are thenable
Although queries are not promises, queries are thenables. That means they have a .then() function, so you can use queries as promises with either promise chaining or async await.
## Should You Use exec() With await?
There are two alternatives for using await with queries:
```js
await Band.findOne();
await Band.findOne().exec();
```
As far as functionality is concerned, these two are equivalent. However, we recommend using .exec() because that gives you better stack traces.

(*)
https://stackoverflow.com/questions/53470299/what-is-fully-fledged-promise
That means that the values returned by queries are thenables per the definition of the Promises/A+ spec, but not actual Promise instances. That means they may not have all of the features of promises (for instance, catch and finally methods).

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

 (Super Bonus) Functionality to filter books by min rating
- Modify route /books
- Use query string + method .filter()
- Provide a form so that users can search

Implement header with:
- If user is logged-in: display the message "Welcome ${username}" + Logout button
- If user is logged-out: display "Register" + "Login" links
Hint: https://expressjs.com/en/api.html#res.locals
```js
  res.locals.pizza = true;
  app.use((req, res, next) => {
    res.locals.session = req.session; // allow access to session data from layout.hbs
    next()
  });
```
https://expressjs.com/en/guide/using-middleware.html
This example shows a middleware function with no mount path. The function is executed every time the app receives a request.
```js
  const express = require('express')
  const app = express()
  app.use((req, res, next) => {
    console.log('Time:', Date.now())
    next()
  })
```
This example shows a middleware function mounted on the /user/:id path. The function is executed for any type of HTTP request on the /user/:id path.
```js
  app.use('/user/:id', (req, res, next) => {
    console.log('Request Type:', req.method)
    next()
  })
```