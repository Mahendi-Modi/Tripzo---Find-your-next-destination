const Listing = require("../models/listing.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exists!");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();

  let { path, filename } = req.file;
  let { title, description, image, price, location, country, category } =
    req.body;
  console.log(req.body);
  await Listing.insertOne({
    title: title,
    description: description,
    image: { url: path, filename },
    price: price,
    location: location,
    category: category,
    country: country,
    owner: req.user._id,
    geometry: response.body.features[0].geometry,
  });

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exists!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

  res.render("listings/edit", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let { title, description, price, location, country, category } = req.body;
  let listing = await Listing.findByIdAndUpdate(
    id,
    {
      title,
      description,
      price,
      location,
      country,
      category,
    },
    { new: true }
  );

  if (req.file) {
    let { path, filename } = req.file;
    listing.image = { url: path, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect("/listings");
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports.filterForm = async (req, res) => {
  const searchInput = req.query.searchInput;
  let allListings;
  if (searchInput) {
    allListings = await Listing.find({
      country: { $regex: new RegExp(searchInput, "i") },
    });

    if (allListings.length > 0) {
      res.render("listings/index", { allListings });
    } else {
      req.flash("error", "No Airbnb found in this country");
      res.redirect("/listings");
    }
  }
};

module.exports.filterLists = async (req, res) => {
  let { category } = req.params;
  const allListings = await Listing.find({ category });
  if (allListings.length > 0) {
    res.render("listings/index", { allListings });
  } else {
    req.flash("error", "No listings found in this category");
    res.redirect("/listings");
  }
};
