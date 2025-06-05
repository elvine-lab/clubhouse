const passport = require("passport");
const User = require("../models/User");

exports.getLogin = (req, res) => {
  res.render("auth/login", { title: "Login" });
};

exports.postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

exports.getSignup = (req, res) => {
  res.render("auth/signup", { title: "Sign Up" });
};

exports.postSignup = async (req, res) => {
  const { firstName, lastName, username, password, confirmPassword, isAdmin } = req.body;

  try {
    // Validation
    if (password !== confirmPassword) {
      req.flash("error_msg", "Passwords do not match");
      return res.redirect("/signup");
    }

    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      req.flash("error_msg", "Username already exists");
      return res.redirect("/signup");
    }

    const newUser = await User.create({
      firstName,
      lastName,
      username,
      password,
      isMember: false,
      isAdmin: isAdmin === "on",
    });

    req.flash("success_msg", "You are now registered and can log in");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Registration failed");
    res.redirect("/signup");
  }
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    req.flash("success_msg", "You are logged out");
    res.redirect("/login");
  });
};