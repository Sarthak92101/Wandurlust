const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingschema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

 

//Index Route
router.get(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
  })
);

//New Route
router.get("/new", isLoggedIn, (req, res) => {

  res.render("listings/new");
});

//Show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    id = id.trim();
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      res.redirect("/listings");
    }
    console.log(listing)
    res.render("listings/show", { listing });
  })
);

//Create Route
router.post(
  "/",
    isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id
    await newListing.save();
    req.flash("success", "Seccesfully created new listing!");
    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn, 
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
      if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      res.redirect("/listings");
    } 
    res.render("listings/edit.ejs", { listing });
  })
);

//Update route
router.put(
  "/:id",
    isLoggedIn,
    isOwner,
  validateListing, 
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
    isLoggedIn,
    isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success", "Listing Deleted!");

    res.redirect("/listings");
  })
);
module.exports = router;
