const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { cloudinary, storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const {
  isLoggedIn,
  isOwner,
  validateListing,
} = require("../utils/middleware.js");

const Listing = require("../models/listing.js");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single("image"),
    wrapAsync(listingController.createListing)
  );

router.route("/category/:category").get(listingController.filterLists);

router
  .route("/search")
  .get(validateListing, wrapAsync(listingController.filterForm));

router.route("/new").get(isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .patch(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

router
  .route("/:id/edit")
  .get(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.renderEditForm)
  );

module.exports = router;
