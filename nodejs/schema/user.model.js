const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    firstname: String,
    lastname: String,
    phone: Number,
    wallet: String,
  })
);

module.exports = User;