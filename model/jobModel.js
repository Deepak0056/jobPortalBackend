const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    jobType: {
      type: String,
    },
    number: {
      type: String,
    },
    industry: {
      type: String,
    },
    salary: {
      type: String,
    },
    description: {
      type: String,
    },
    deadLine: {
      type: String,
    },
    responsibilities: {
      type: String,
    },
    requirements: {
      type: String,
    },
    likes: {
      type: Array,
      ref: "User",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);
