const User=require("../models/user.js");
const Listing = require("../models/listing.js");

module.exports.rendersignUpform=(req, res) => {
  res.render("users/signup.ejs");
}
module.exports.signUp = async (req, res, next) => {
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
};

module.exports.renderLogin=(req, res) => {
  res.render("users/login.ejs");
}
module.exports.Login=(req, res) => {
    req.flash("success", `Welcome ${req.user.username}`);
    res.redirect(res.locals.redirectUrl || "/listings");
  }
  module.exports.logOut=(req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Goodbye!");
    res.redirect("/listings");
  });
}

const safeReturnTo = (value) => {
  if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/listings";
};

module.exports.saveListing = async (req, res) => {
  const { listingId } = req.params;
  const listing = await Listing.findById(listingId);
  if (!listing) {
    req.flash("error", "That stay could not be found.");
    return res.redirect("/listings");
  }
  await User.updateOne({ _id: req.user._id }, { $addToSet: { savedListings: listing._id } });
  req.flash("success", "Saved to your travel shortlist.");
  res.redirect(safeReturnTo(req.body.returnTo));
};

module.exports.removeSavedListing = async (req, res) => {
  await User.updateOne({ _id: req.user._id }, { $pull: { savedListings: req.params.listingId } });
  req.flash("success", "Removed from your shortlist.");
  res.redirect(safeReturnTo(req.body.returnTo));
};

module.exports.showSavedListings = async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "savedListings",
    populate: { path: "owner" }
  });
  const alllistings = (user?.savedListings || []).filter(Boolean).reverse();
  res.render("listings/index.ejs", {
    alllistings,
    searchQuery: "",
    selectedMood: "",
    budget: 15000,
    savedOnly: true,
    returnTo: req.originalUrl
  });
};

