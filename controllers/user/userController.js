const bookMarkedModel = require("../../model/bookMarkedModel");
const contactModel = require("../../model/contactModel");
const cvModel = require("../../model/cvModel");
const profileModel = require("../../model/profileModel");
const userModel = require("../../model/userModel");

exports.createProfile = async (req, res) => {
  console.log(req.body);
  const imagePath = req.file.filename;

  const userId = req.userId;
  req.body.userId = userId;
  req.body.picture = "http://localhost:4000/" + imagePath;
  const profile = await profileModel.create(req.body);
  console.log(profile);
  res.status(200).json({
    status: 200,
    messsage: "profile created successfully",
    profile,
  });
};

exports.editProfile = async (req, res) => {
  const profile = await profileModel.findOneAndUpdate(
    { userId: req.userId },
    req.body
  );
  res.status(200).json({
    status: 200,
    messsage: "profile updated successfully",
    profile,
  });
};

exports.getProfile = async (req, res) => {
  const profile = await profileModel.find({ userId: req.userId });
  const user = await userModel.findById(req.userId);

  res.json({
    status: 200,
    message: "profile fetched successfully",
    profile,
    user,
  });
};

exports.createCv = async (req, res) => {
  req.body.userId = req.userId;
  const cv = await cvModel.create(req.body);
  res.status(200).json({
    status: 200,
    messsage: "cv created successfully",
    cv,
  });
  console.log(cv);
};
exports.getCv = async (req, res) => {
  const cv = await cvModel.find({ userId: req.userId });
  res.status(200).json({
    status: 200,
    message: "cv fetched successfully",
    cv,
  });
};

exports.getUsers = async (req, res) => {
  const users = await userModel.find();
  res.status(200).json({
    status: 200,
    message: "users fetched successfully",
    users,
  });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log("from delete");
  const user = await userModel.findByIdAndDelete(id);
  res.status(200).json({
    status: 200,
    message: "user deleted successfully",
    user,
  });
};

exports.bookMarkJob = async (req, res) => {
  const bookmarked = await bookMarkedModel.create({
    userId: req.userId,
    jobId: req.params.id,
  });
  res.json({
    status: 200,
    message: "job bookmarked successfully",
    bookmarked,
  });
};

exports.getBookMarkedJobs = async (req, res) => {
  const bookmarked = await bookMarkedModel
    .find({ userId: req.userId })
    .populate("jobId");
  res.json({
    status: 200,
    message: "bookmarked jobs fetched successfully",
    bookmarked,
  });
};

exports.createContact = async (req, res) => {
  const contact = await contactModel.create(req.body);
  res.status(200).json({
    status: 200,
    messsage: "contact created successfully",
    contact,
  });
};
