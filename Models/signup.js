const mongoose = require("mongoose");

const signUp = mongoose.Schema({
  first_name: String,
  phone_number: String,
  email: String,
  password: String,
  is_approved : Boolean,
});

const signUpForm = mongoose.model('user',signUp)

module.exports = signUpForm