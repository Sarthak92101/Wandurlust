const mongoose = require("mongoose");
const Review = require("./review.js");
const { urlencoded } = require("express");
const { string } = require("joi");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,

  image: {
    url: String,
    filename: String
  },

  price: Number,
  location: String, // corrected typo
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  //add for Google maps

});
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ reviews: { $in: listing.reviews } });
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
