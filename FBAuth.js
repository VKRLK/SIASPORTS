const express = require("express");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const expressSession = require("express-session");

const app = express();

const FACEBOOK_CLIENT_ID = "177640258699785";
const FACEBOOK_CLIENT_SECRET = "3266117f8c45abbb494e38f1f430b8f9";

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      callbackURL: "/facebook",
      profileFields: ["emails", "displayName", "name", "picture"],
    },
    (accessToken, refreshToken, profile, callback) => {
      callback(null, profile);
    }
  )
);

passport.serializeUser((user, callback) => {
  callback(null, user);
});

passport.deserializeUser((user, callback) => {
  callback(null, user);
});

app.use(
  expressSession({
    secret: "testapp",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/login/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
app.get("/facebook", passport.authenticate("facebook"), (req, res) => {
  res.redirect("/");
});
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/", (req, res) => {
  res.send(
    req.user
      ? req.user
      : "Please use  http://localhost:3000/login/facebook or http://localhost:3000/facebook"
  );
});

app.listen(3000, () => {
  console.log("server listening on localhost:3000");
});
