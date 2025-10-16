const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controllers/review.js");

const {
  validateReview,
  isLoggedIn,
  isReviewOwner,
} = require("../utils/middleware.js");
const Review = require("../models/review.js");

router
  .route("/")
  .post(isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

router
  .route("/:reviewId")
  .delete(isLoggedIn, isReviewOwner, wrapAsync(reviewController.deleteReview));

module.exports = router;
