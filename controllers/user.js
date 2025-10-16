const User = require("../models/user");

module.exports.renderSignupForm = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (e) => {
      if (e) {
        return next(e);
      }
      req.flash("success", "Welcome to TripZo!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.login = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.signup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.renderLoginForm = async (req, res) => {
  req.flash("success", "Welcome back to TripZo!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};
