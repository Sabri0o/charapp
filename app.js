// Important: In MongoDB, a database is not created until it gets content!

require("dotenv").config();
const myDb = require("./connection");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const routes = require("./routes");
const auth = require("./auth");
const app = express();
// creating http server
const http = require('http').createServer(app)
 // creating a new socket.io instance attached to the http server.
const io = require('socket')(http)

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

//passport.session() is middleware that alters the request object 
// and change the 'user' value that is currently the session id (from the client cookie) 
// into the true deserialized user object.
app.use(passport.session());

myDb(async (client) => {
  const myDatabase = await client.db("charApp").collection("users");

  // listening for a new connection from the client
  // a socket here is an individual client who is connected.
  let currentUsers = 0
  io.on('connection', socket => {
    currentUsers += 1
    console.log('A user has connected');
    // emitting the count to socket
    io.on('user count',currentUsers)
    // listening for disconnection for each socket
    socket.on('disconnect',()=>{
      console.log('A user has disconnected')
      currentUsers -= 1
      io.emit('user count',currentUsers)
    })
  });

  routes(app, myDatabase);
  auth(app, myDatabase);
  //handling errors (missing pages)
  app.use(function (req, res, next) {
    res.status(404).type("text").send("Not found");
  });
}).catch((error) => {
  app.get("/", (req, res) => {
    res.render(__dirname + "/views/pug/home.pug", {
      message_1: "error",
      message_2: "unable log in",
    });
  });
});

// since http server is mounted on the express app, we need to listen from the http server not app
http.listen(8000, () => {
  console.log("Listening on port 8000");
});
