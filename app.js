require('dotenv').config()
const express = require("express");
const session = require("express-session")
const passport = require("passport")
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//using the set method to assign pug as the view engine property's value of express
app.set("view engine", "pug");

// serving static assets
app.use('/public', express.static(__dirname + '/public'));

const mySecret = process.env['SESSION_SECRET']

// set up the session settings
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

//passport.initialize() is a middle-ware that initialises Passport.
app.use(passport.initialize())

//passport.session() is middleware that alters the request object and change the session id (from the client cookie) 
//into the true deserialized user object.

app.use(passport.session())



//rendering the home page from the response.
app.get("/", function (req, res) {
  // console.log(__dirname)
  res.render(__dirname + "/views/pug/home.pug",{message_1:'Hello there',message_2:'nice to meet you'});
});

app.listen(8000, () => {
  console.log("Listening on port 3000");
});
