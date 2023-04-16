const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookMarkedSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
});
// test

module.exports = mongoose.model("BookMarked", bookMarkedSchema);
