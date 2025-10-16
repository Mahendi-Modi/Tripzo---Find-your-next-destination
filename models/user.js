const { required } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

// automatically set username, hashing, salting & hash password
userSchema.plugin(passportLocalMongoose);

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
