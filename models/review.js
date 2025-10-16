const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  comment: String,
  rating: {
    type: Number,
    default: 1,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
