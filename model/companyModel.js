const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  followers: {
    type: Array,
    ref: "User",
  },
  email: {
    type: String,
    required: true,
    lowerCase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  industry: {
    type: String,
  },
  companySize: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "company",
  },
  phone : {
    type : String,
    unique : true
  }
});

module.exports = mongoose.model("Company", companySchema);
