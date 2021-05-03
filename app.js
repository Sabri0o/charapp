// Important: In MongoDB, a database is not created until it gets content!

require("dotenv").config();
const myDatabase = require("./connection");
const express = require("express");
const session = require("express-session");
const passport = require("passport");

// To make a query search for a Mongo _id, you will have to create
//const ObjectID = require('mongodb').ObjectID;, and then to use it you call new ObjectID(THE_ID)
const ObjectID = require("mongodb").ObjectID;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//using the set method to assign pug as the view engine property's value of express
app.set("view engine", "pug");

// serving static assets
app.use("/public", express.static(__dirname + "/public"));

const mySecret = process.env["SESSION_SECRET"];

// set up the session settings
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

//passport.initialize() is a middle-ware that initialises Passport.
app.use(passport.initialize());

//passport.session() is middleware that alters the request object and change the session id (from the client cookie)
//into the true deserialized user object.

app.use(passport.session());

myDatabase(async (client) => {
  const myDatabase = await client.db("charApp").collection("users");

  //rendering the home page from the response.
  app.get("/", function (req, res) {
    // console.log(__dirname)
    res.render(__dirname + "/views/pug/home.pug", {
      message_1: "Hello there, nice to meet you",
      message_2: "please log in",
    });
  });
  //Serialization
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  //deserialization
  passport.deserializeUser((id, done) => {
    myDatabase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
      done(null, doc);
    });
  });
}).catch(error=>{
  app.get('/',(req,res)=>{
    res.render(__dirname + "/views/pug/home.pug", {
      message_1: "error",
      message_2: "unable log in",
    });
  })
})

app.listen(8000, () => {
  console.log("Listening on port 8000");
});
