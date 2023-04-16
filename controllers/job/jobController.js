const commentModel = require("../../model/commentModel");
const jobModel = require("../../model/jobModel");
const reviewModel = require("../../model/reviewModel");

exports.createJob = async (req, res) => {
  const {
    title,
    designation,
    companyName,
    location,
    jobType,
    number,
    industry,
    salary,
    description,
    deadLine,
    responsibilities,
    requirements,
  } = req.body;

  const companyId = req.userId;

  //   console.log(req.file);
  const imagePath = req.file.filename;
  //   const image = req.file.path;

  try {
    const job = await jobModel.create({
      title,
      designation,
      companyName,
      location,
      jobType,
      number,
      industry,
      salary,
      description,
      deadLine,
      responsibilities,
      requirements,
      userId: companyId,
      image: `${process.env.BASE_URL}` + imagePath,
    });
    console.log(job);
    res.status(201).json({
      status: "success",
      data: {
        job,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await jobModel.find({ userId: req.userId });
    res.status(200).json({
      status: "success",
      data: {
        jobs,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getJob = async (req, res) => {
  try {
    const job = await jobModel.findById(req.params.id).populate("userId");
    console.log(job);
    console.log("from single get job ");
    res.status(200).json({
      status: "success",
      data: {
        job,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await jobModel.find();
    console.log(jobs);
    res.status(200).json({
      status: "success",

      jobs,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getJobByCategory = async (req, res) => {
  const { id } = req.params;
  const jobs = await jobModel.find({
    industry: id,
  });
  res.json({
    status: 200,
    message: "success",
    jobs,
  });
};

exports.getJobBySearch = async (req, res) => {
  const { search } = req.body;
  const jobs = await jobModel.find({
    $or: [{ title: search }, { salary: search }, { location: search }],
  });
  res.json({
    status: 200,
    message: "success",
    jobs,
  });
};

exports.deleteJob = async (req, res) => {
  const { id } = req.params;
  await jobModel.findByIdAndDelete(id);
  res.json({
    status: 200,
    message: "Job deleted successfully",
  });
};

exports.like = async (req, res) => {
  console.log("from like");
  const jobId = req.body.jobId;
  jobModel.findByIdAndUpdate(
    jobId,
    { $push: { likes: req.userId } },
    { new: true },
    (err, job) => {
      if (err) {
        res.json({
          err,
        });
      }
      res.json({
        status: 200,
        message: "Liked successfully",
        job,
      });
    }
  );
};

exports.getLikes = async (req, res) => {
  const likes = await jobModel.findById(req.userId).populate("like");
  res.json({
    status: 200,
    message: "Like fetched successfully",
    follower,
  });
};

exports.unLike = async (req, res) => {
  const jobId = req.body.jobId;
  jobModel.findByIdAndUpdate(
    jobId,
    { $pull: { likes: req.userId } },
    { new: true },
    (err, job) => {
      if (err) {
        res.json({
          err,
        });
      }
      res.json({
        status: 200,
        message: "Unfollowed successfully",
        job,
      });
    }
  );
};

exports.rate = async (req, res) => {
  const { rating, message, jobId } = req.body;
  const userId = req.userId;
  const review = await reviewModel.create({
    rating,
    message,
    userId,
    jobId,
  });
  res.json({
    status: 200,
    message: "Review added successfully",
    review,
  });
};

exports.getRate = async (req, res) => {
  const reviews = await reviewModel
    .find({ jobId: req.params.id })
    .populate("userId");
  res.json({
    status: 200,
    message: "Review fetched successfully",
    reviews,
  });
};

exports.createComment = async (req, res) => {
  req.body.userId = req.userId;

  const comments = await commentModel.create(req.body);
  res.json({
    status: 200,
    message: "Comment added successfully",
    comments,
  });
};

exports.getComments = async (req, res) => {
  const comments = await commentModel
    .find({ jobId: req.params.id })
    .populate("userId");
  res.json({
    status: 200,
    message: "Comment fetched successfully",
    comments,
  });
};

exports.getSimilarJobs = async (req, res) => {
  // const currentJob = req.body.currentJob;
  const { id } = req.params;
  const jobs = await jobModel.find().where("industry").equals(id).limit(3);
  res.json({
    status: 200,
    message: "success",
    jobs,
  });
};
