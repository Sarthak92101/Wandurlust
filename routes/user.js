const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../expressMiddleware.js");

const usersController = require("../controllers/users.js");

router.get("/saved", isLoggedIn, wrapAsync(usersController.showSavedListings));
router.post("/saved/:listingId", isLoggedIn, wrapAsync(usersController.saveListing));
router.delete("/saved/:listingId", isLoggedIn, wrapAsync(usersController.removeSavedListing));

router.route("/signup")
.get(usersController.rendersignUpform)
.post(wrapAsync(usersController.signUp))

router.route("/login")
.get(usersController.renderLogin)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  usersController.Login
)

// LOGOUT
router.get("/logout", usersController.logOut);

module.exports = router;
