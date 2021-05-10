const passport = require("passport");
const bcrypt = require("bcrypt");

// middleware to check if the user is authenticated while requesting the profile url
const ensureAuthenticated = function (req, res, next) {
  console.log('****** passport ensureAuthenticated ******')
  if (req.isAuthenticated()) {
    console.log("authenticated");
    return next();
  }
  res.redirect("/");
};

module.exports = function (app, myDataBase) {
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
    // console.log(req.user.username);
    console.log('sessionID',req.session.id)
    console.log('****************************************************')
    res.render(__dirname + "/views/pug/profile.pug", {
      username: req.user.username || req.user.name,
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
    function (req, res, next) {
      myDataBase.findOne({ username: req.body.username }, function (err, doc) {
        if (err) {
          console.log("error :", err.message);
          // res.redirect("/");
          next(err, null);
        } else if (doc) {
          console.log("user is already exist");
          res.redirect("/");
        } else {
          const hash = bcrypt.hashSync(req.body.password, 12);
          myDataBase.insertOne(
            { username: req.body.username, password: hash },
            function (err, doc) {
              if (err) {
                console.log("error :", err.message);
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

  app.route('/auth/github').get(passport.authenticate('github'))

  app.route('/auth/github/callback').get(passport.authenticate('github',{failureRedirect:'/'}),function(req,res){
      res.redirect('/profile')
  })
};
