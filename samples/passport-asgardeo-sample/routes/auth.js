var passport = require("passport");
var AsgardeoStrategy = require("@asgardeo/passport-asgardeo");
const BASE_URL = "https://api.asgardeo.io/t/orgkavinda";

passport.use(
  new AsgardeoStrategy(
    {
      issuer:
        BASE_URL + "/oauth2/token",
      authorizationURL:
        BASE_URL + "/oauth2/authorize",
      tokenURL:
        BASE_URL + "/oauth2/token",
      userInfoURL:
        BASE_URL + "/oauth2/userinfo",
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/oauth2/redirect",
      scope: ["profile"],
    },
    function verify(
      issuer,
      uiProfile,
      idProfile,
      context,
      idToken,
      accessToken,
      refreshToken,
      params,
      verified
    ) {
      return verified(null, {
        uiProfile: uiProfile,
      });
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, {
      id: user?.uiProfile?.id,
      username: user?.uiProfile?._json?.username,
      givenName: user?.uiProfile?.name?.givenName,
      familyName: user?.uiProfile?.name?.familyName,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

var express = require("express");
var qs = require("querystring");
var router = express.Router();

router.get("/login", passport.authenticate("asgardeo"));

router.get(
  "/oauth2/redirect",
  passport.authenticate("asgardeo", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    var params = {
      post_logout_redirect_uri: "http://localhost:3000",
      client_id: process.env.CLIENT_ID,
    };
    res.redirect(
      BASE_URL + "/oidc/logout?" +
        qs.stringify(params)
    );
  });
});

module.exports = router;