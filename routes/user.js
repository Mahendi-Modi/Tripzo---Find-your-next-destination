const { render } = require("ejs");
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const flash = require("connect-flash");
const { saveRedirectUrl } = require("../utils/middleware.js");
const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(userController.signup)
  .post(wrapAsync(userController.renderSignupForm));

router
  .route("/login")
  .get(userController.login)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.renderLoginForm
  );

router.route("/logout").get(userController.logout);

module.exports = router;
