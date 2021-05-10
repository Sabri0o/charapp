require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GitHubStrategy = require("passport-github").Strategy;
const bcrypt = require("bcrypt");
// To make a query search for a Mongo _id, you will have to create
//const ObjectID = require('mongodb').ObjectID;, and then to use it you call new ObjectID(THE_ID)
const ObjectID = require("mongodb").ObjectID;

module.exports = function (app, myDataBase) {
  //Serialization
  passport.serializeUser((user, done) => {
    console.log('****** passport serializeUser ******')
    console.log('user: ',user)
    done(null, user._id);
  });
  //deserialization
  passport.deserializeUser((id, done) => {
    console.log('****** passport deserializeUser ******')
    console.log('id: ',id)
    myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
      done(null, doc);
    });
  });
  // authentication strategy: local strategy
  passport.use(
    new LocalStrategy(function (username, password, done) {
      console.log('****** passport LocalStrategy ******')
      myDataBase.findOne({ username: username }, function (err, user) {
        console.log("User " + username + " attempted to log in.");
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );

  //configure passport github strategy
  // useful link https://github.com/jaredhanson/passport-github
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8000/auth/github/callback",
      },
      function (accessToken, refreshToken, profile, cb) {
        // this function is called when a user is successfully authenticated,
        // which will determine if the user is new 
        // and what fields to save initially in the user's database object
        // console.log(profile);
        // Database logic here with callback containing our user object
        // https://database.guide/mongodb-setoninsert/
        myDataBase.findOneAndUpdate(
          { id: profile.id },
          {
            $setOnInsert: {
              id: profile.id,
              name: profile.displayName || "Tony Stark",
              photo: profile.photos[0].value || "",
              email: Array.isArray(profile.emails)
                ? profile.emails[0].value
                : "No public email",
              created_on: new Date(),
              provider: profile.provider || "",
            },
            $set: {
              last_login: new Date(),
            },
            $inc: {
              login_count: 1,
            },
          },
          { upsert: true, new: true },
          function (err, doc) {
            console.log(doc.value)
            return cb(null, doc.value);
          }
        );
      }
    )
  );
};
