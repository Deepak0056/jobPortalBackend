const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const category = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    name: {
      type: String,
    },
    jobId : {
      type : Schema.Types.ObjectId,
      ref : "Job"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", category);
