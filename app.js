// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");
// require("./db/index"); // equivalent
// require("./db/index.js"); // equivalent

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

require('./config/session.config')(app);

// default value for title local
const capitalize = require("./utils/capitalize");
const projectName = "library-project";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

app.use((req, res, next) => {
    // console.log("saving request session in response locals")
    res.locals.session = req.session;
    next()
});

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);
app.use("/", require("./routes/book.routes"));
app.use("/", require("./routes/author.routes"));
app.use("/", require("./routes/auth.routes"));

/****************/
/* mount routes */
/****************/

// [	
// 	require("./routes/index.routes"),
// 	require("./routes/book.routes")
// ].forEach(router => {
// 	app.use("/", router);
// })

/* */

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
