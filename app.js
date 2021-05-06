// Important: In MongoDB, a database is not created until it gets content!

require("dotenv").config();
const myDb = require("./connection");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

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

// middleware to check if the user is authenticated while requesting the profile url
const ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    console.log('authenticated')
    return next();
  }
  res.redirect("/");
};

myDb(async (client) => {
  const myDatabase = await client.db("charApp").collection("users");

  //rendering the home page from the response.
  app.route("/").get(function (req, res) {
    res.render(__dirname + "/views/pug/home.pug", {
      message_1: "Hello there, nice to meet you",
      message_2: "please log in",
      showlogin: true,
      showRegisterForm: true,
    });
  });

  //If the authentication (passport.authenticate) is successful, the user object will be saved in req.user
  app
    .route("/login")
    .post(
      passport.authenticate("local", { failureRedirect: "/" }),
      function (req, res) {
        res.redirect("/profile");
      }
    );

  app.route("/profile").get(ensureAuthenticated, function (req, res) {
    //calling passport's isAuthenticated method on the request which, in turn, checks if req.user is defined
    console.log(req.user.username)
    res.render(__dirname + "/views/pug/profile.pug", {
      username: req.user.username
    });
  });

  // logout : In passport, unauthenticating a user is done by calling req.logout()
  app.route("/logout").get(function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // registraion route
  // The logic of the registration route should be as follows:
  // Register the new user >
  // Authenticate the new user >
  // Redirect to /profile

  app.route("/register").post(
    function (req, res) {
      myDatabase.findOne({ username: req.body.username }, function (err, doc,next) {
        if (err) {
          console.log("error", err.message);
          // res.redirect("/");
          next(err, null);
        } else if (doc) {
          console.log("user is already exist");
          res.redirect('/')
        } else {
          myDatabase.insertOne(
            { username: req.body.username, password: req.body.password },
            function (err, doc) {
              if (err) {
                console.log("error", err.message);
                res.redirect("/");
              } else {
                console.log("registration processing...");
                console.log(doc.ops[0]);
                // res.redirect("/profile");
                next(null, doc.ops[0]);
              }
            }
          );
        }
      });
    },
    passport.authenticate("local", { failureRedirect: "/" }),
    function (req, res) {
      res.redirect("/profile");
    }
  );

  //handling errors (missing pages)
  app.use(function (req, res, next) {
    res.status = (404).type("text").send("Not found");
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
  // authentication strategy: local strategy
  passport.use(
    new LocalStrategy(function (username, password, done) {
      myDatabase.findOne({ username: username }, function (err, user) {
        console.log("User " + username + " attempted to log in.");
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (password !== user.password) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );
}).catch((error) => {
  app.get("/", (req, res) => {
    res.render(__dirname + "/views/pug/home.pug", {
      message_1: "error",
      message_2: "unable log in",
    });
  });
});

app.listen(8000, () => {
  console.log("Listening on port 8000");
});
