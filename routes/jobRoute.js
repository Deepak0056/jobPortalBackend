const {
  createJob,
  getJobs,
  getJob,
  getAllJobs,
  getJobByCategory,
  getJobBySearch,
  deleteJob,
  like,
  unLike,
  rate,
  getRate,
  createComment,
  getComments,
  getSimilarJobs,
} = require("../controllers/job/jobController");
const { isAuthenticated } = require("../services/isAuthenticated");

const router = require("express").Router();
const { multer, storage } = require("./../services/multerConfig");
const upload = multer({ storage: storage });

router
  .route("/")
  .post(isAuthenticated, upload.single("image"), createJob)
  .get(isAuthenticated, getJobs);

router.route("/alljobs").get(getAllJobs);

router.route("/:id").get(getJob).delete(isAuthenticated, deleteJob);
router.route("/category/:id").get(getJobByCategory);
router.route("/search/").post(getJobBySearch);
router.route("/like").post(isAuthenticated, like);
router.route("/unLike").post(isAuthenticated, unLike);
router.route("/rate").post(isAuthenticated, rate);
router.route("/rate/:id").get(getRate);
router.route("/comment").post(isAuthenticated, createComment);
router.route("/getSimilarJobs/:id").get(getSimilarJobs);

router.route("/comment/:id").get(getComments);
module.exports = router;
