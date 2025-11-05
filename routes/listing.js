const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingschema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// ✅ Cloudinary + Multer setup
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// ✅ All Listings
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"), //  handles image upload
    validateListing,                 // validate after upload
    wrapAsync(listingController.createListing)
  );

//  New Listing Form (keep before :id route)
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Individual Listing Routes
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),  //  allow image update
    validateListing,
    wrapAsync(listingController.updateListings)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//  Edit Form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editForm));

module.exports = router;
