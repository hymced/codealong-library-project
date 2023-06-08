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

Languages Supported by Github Flavored Markdown

https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-and-highlighting-code-blocks

We use Linguist to perform language detection and to select third-party grammars for syntax highlighting. You can find out which keywords are valid in the languages YAML file.

https://github.com/github-linguist/linguist/blob/master/lib/linguist/languages.yml

Shell:
  - sh
  - shell-script
  - bash
  - zsh

  https://superuser.com/questions/531592/how-to-add-the-tree-command-to-git-bash-in-windows
You could also use "cmd //c tree" to use Windows' tree
```shell
cmd //c tree /F
```
```cmd
excluse:
dir /B /AD /S | findstr /V /I /C:"node_modules"
include:
dir /B /AD /S | findstr /I /C:"views"
```
C:\Windows\SysWOW64\tree.com
but tree does not accept piped input for its <path> parameter, it only use current folder
https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/tree
https://stackoverflow.com/questions/43810090/print-directory-tree-but-exclude-a-folder-on-windows-cmd/43810460#43810460

or:
https://gnuwin32.sourceforge.net/packages/tree.htm
Version
1.5.2.2
Binaries
http://downloads.sourceforge.net/gnuwin32/tree-1.5.2.2-bin.zip
Complete package, except sources
http://downloads.sourceforge.net/gnuwin32/tree-1.5.2.2-setup.exe
https://sourceforge.net/projects/gnuwin32/files/tree/
https://sourceforge.net/projects/gnuwin32/files/tree/1.5.2.2/
tree-1.5.2.2-src-setup.exe --> tree-1.5.2.2-src.zip
(includes all the necessary files and instructions to compile and build the software from its source code)
tree-1.5.2.2-setup.exe --> tree-1.5.2.2-bin.zip
https://sourceforge.net/projects/gnuwin32/files/tree/1.5.2.2/tree-1.5.2.2-setup.exe/download

install manually the binary here: C:\Program Files\Git\usr\bin
or use the installer (C:\Program Files (x86)\GnuWin32\bin\tree.exe) 
add to profile
export PATH="$PATH:/usr/local/bin"
C:\Program Files\Git\usr\bin

cmd Run as Admin
C:\Program Files\Git\usr\bin>mklink tree "C:\Program Files (x86)\GnuWin32\bin\tree.exe"
symbolic link created for tree <<===>> C:\Program Files (x86)\GnuWin32\bin\tree.exe
https://www.howtogeek.com/16226/complete-guide-to-symbolic-links-symlinks-on-windows-or-linux/
https://www.geeksforgeeks.org/difference-between-hard-link-and-soft-link/
https://stackoverflow.com/questions/185899/what-is-the-difference-between-a-symbolic-link-and-a-hard-link

```shell
tree -I 'node_modules|cache|test_*'
tree -I 'node_modules|cache|test_*' | sed 's/[`]/|/g; s/[-]/_/g'
```

> chatPGT:
> differences:
> Representation:
> Soft Link: A soft link is a separate file that contains the path to the original file or directory. It is essentially a shortcut or reference to another file or directory. Soft links are represented by a separate inode (index node).
> Hard Link: A hard link, on the other hand, is a direct reference to the original file or directory. It is an additional name (link) for the same file or directory. Hard links are represented by the same inode as the original file or directory.
> Target Update:
> Soft Link: If the original file or directory is moved or renamed, the soft link will still point to the original target, even if it no longer exists. Soft links can even point to files or directories on different filesystems.
> Hard Link: If the original file or directory is moved or renamed, the hard link will still refer to the original target. All hard links point to the same underlying data on the filesystem. If the original file or directory is deleted, the data is not immediately removed as long as at least one hard link exists.
> File Size:
> Soft Link: A soft link has its own file size and occupies additional space on the filesystem, as it stores the path to the target file or directory.
> Hard Link: A hard link does not have its own file size. It points directly to the original file or directory, and both links share the same storage on the filesystem.
> Removal:
> Soft Link: Deleting a soft link does not affect the original file or directory. The original file or directory remains intact.
> Hard Link: Deleting a hard link does not affect the original file or directory unless it is the last remaining hard link. In that case, deleting the last hard link will remove the file or directory and free up the associated storage.
> Cross-Filesystem Support:
> Soft Link: Soft links can point to files or directories on different filesystems.
> Hard Link: Hard links can only be created for files or directories within the same filesystem.
> In summary, soft links are independent files that reference another file or directory by their path, while hard links are additional names pointing directly to the original file or directory. Soft links provide more flexibility in terms of target updates and cross-filesystem support, but they occupy additional space on the filesystem. Hard links, on the other hand, directly reference the original file or directory and share the same data storage, making them efficient in terms of space utilization.