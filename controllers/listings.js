const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const searchQuery = String(req.query.q || "").trim().slice(0, 80);
  const filter = searchQuery
    ? {
        $or: ["title", "location", "country"].map((field) => ({
          [field]: { $regex: searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" }
        }))
      }
    : {};
  const alllistings = await Listing.find(filter).sort({ _id: -1 });
  res.render("listings/index.ejs", { alllistings, searchQuery });
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
