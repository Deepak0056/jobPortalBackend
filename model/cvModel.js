const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cvSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  designation: {
    type: String,
  },
  location: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  career_objective: {
    type: String,
  },
  workHistory: {
    type: Array,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Cv", cvSchema);
