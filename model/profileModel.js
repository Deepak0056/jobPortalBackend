const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  name: {
    type: String,
  },
  experience: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  address: {
    type: String,
  },
  age: {
    type: String,
  },
  designation: {
    type: String,
  },
  level: {
    type: String,
  },
  picture: {
    type: String,
  },
  description: {
    type: String,
  },
  projects: {
    type: Array || String,
  },
});
module.exports = mongoose.model("Profile", profileSchema);
