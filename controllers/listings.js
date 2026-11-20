const Listing = require("../models/listing.js");
const moodTerms = {
  coast: ["beach", "ocean", "coast", "sea", "island", "bali"],
  mountains: ["mountain", "alps", "ski", "lake", "cabin", "treetop"],
  city: ["city", "urban", "downtown", "loft", "apartment", "miami", "boston"],
  quiet: ["quiet", "secluded", "peaceful", "retreat", "cottage", "unplug", "hideaway"]
};
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports.index = async (req, res) => {
  const searchQuery = String(req.query.q || "").trim().slice(0, 80);
  const selectedMood = Object.hasOwn(moodTerms, req.query.mood) ? req.query.mood : "";
  const requestedBudget = Number(req.query.budget);
  const budget = Number.isFinite(requestedBudget) && requestedBudget >= 500 && requestedBudget <= 15000
    ? Math.round(requestedBudget / 500) * 500
    : 15000;
  const filters = [];
  if (searchQuery) {
    const queryRegex = escapeRegex(searchQuery);
    filters.push({ $or: ["title", "description", "location", "country"].map((field) => ({ [field]: { $regex: queryRegex, $options: "i" } })) });
  }
  if (selectedMood) {
    filters.push({ $or: moodTerms[selectedMood].map((term) => {
      const regex = escapeRegex(term);
      return { $or: ["title", "description", "location", "country"].map((field) => ({ [field]: { $regex: regex, $options: "i" } })) };
    }) });
  }
  if (req.query.budget) filters.push({ price: { $lte: budget } });
  const filter = filters.length ? { $and: filters } : {};
  const alllistings = await Listing.find(filter).sort({ _id: -1 });
  res.render("listings/index.ejs", { alllistings, searchQuery, selectedMood, budget, savedOnly: false, returnTo: req.originalUrl });
};

module.exports.surpriseMe = async (req, res) => {
  const listings = await Listing.find({}, "_id");
  if (!listings.length) {
    req.flash("error", "No stays to surprise you with yet.");
    return res.redirect("/listings");
  }
  const choice = listings[Math.floor(Math.random() * listings.length)];
  res.redirect(`/listings/${choice._id}`);
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  if (req.file) {
    newListing.image = { url: req.file.path, filename: req.file.filename };
  }
  await newListing.save();
  req.flash("success", "Successfully created a new listing!");
  res.redirect("/listings");
};

module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }
  let originalImage = listing.image && listing.image.url;
  if (originalImage && originalImage.includes("/upload")) {
    originalImage = originalImage.replace("/upload", "/upload/h_300,w_250");
  }
  res.render("listings/edit.ejs", { listing, originalImage });
};

module.exports.updateListings = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }
  Object.assign(listing, req.body.listing);
  if (req.file) listing.image = { url: req.file.path, filename: req.file.filename };
  await listing.save();
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }
  req.flash("success", "Listing deleted!");

  res.redirect("/listings");
};
