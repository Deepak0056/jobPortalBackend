const appliedJobModel = require("../../model/appliedJobModel");
const sendEmail = require("../../services/sendEmail");

exports.createAppliedJob = async (req, res) => {
  const { jobId, experience } = req.body;
  const companyId = req.body.companyId || 1;
  const userId = req.userId;
  const imagePath = req.file.filename;
  console.log(req.file);

  try {
    const appliedJob = await appliedJobModel.create({
      userId,
      companyId,
      jobId,

      experience,
      cv: `${process.env.BASE_URL}` + imagePath,
    });
    res.status(200).json({
      status: "success",
      appliedJob,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
exports.getAppliedJobs = async (req, res) => {
  try {
    const appliedJobs = await appliedJobModel.find({ userId: req.userId }).populate("companyId").populate("jobId")
    res.status(200).json({
      status: 200,
      appliedJobs,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
exports.getAppliedJob = async (req, res) => {
  try {
    const appliedJob = await appliedJobModel
      .findById(req.params.id)
      .populate("userId");
    res.status(200).json({
      status: "success",
      appliedJob,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getApplicants = async (req, res) => {
  try {
    const applicants = await appliedJobModel
      .find({ companyId: req.userId })
      .populate("userId").populate("jobId")
      console.log("app",applicants)
    res.status(200).json({
      status: "success",
      applicants,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    if (req.body.status === "rejected") {
      const applicant = await appliedJobModel.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
      });
      try{
        await sendEmail({
          email: req.body.email,
          subject: "Application Rejected",
          message: "Your application has been rejected",
        });
      }catch(e){
        console.log(e)
      }
      res.status(200).json({
        status: 200,
        applicant,
      });
    } else if (req.body.status === "accepted") {
      const applicant = await appliedJobModel.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
      });
      await sendEmail({
        email: req.body.email,
        subject: "Application Accepted",
        message: "Your application has been accepted",
      });

      res.status(200).json({
        status: 200,
        applicant,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Invalid status",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error,
    });
  }
};
