const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// SIGNUP FORM
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// SIGNUP LOGIC
router.post("/signup", wrapAsync(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome ${registeredUser.username}`);
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
}));

// LOGIN FORM
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// LOGIN LOGIC
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", `Welcome ${req.user.username}`);
    res.redirect(res.locals.redirectUrl || "/listings");
  }
);

// LOGOUT
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Goodbye!");
    res.redirect("/listings");
  });
});

module.exports = router;
