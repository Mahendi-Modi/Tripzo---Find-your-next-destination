const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id);
  let { rating, comment } = req.body;
  let newReview = new Review({ rating, comment });
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await listing.save();
  await newReview.save();
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
