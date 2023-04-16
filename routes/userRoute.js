const {
  getContact,
  deleteContact,
} = require("../controllers/admin/adminController");
const {
  register,
  logIn,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth/authController");
const {
  createMessage,
  getMessages,
} = require("../controllers/chatController/chatController");
const { getSimilarJobs } = require("../controllers/job/jobController");
const {
  createProfile,
  getProfile,
  createCv,
  getCv,
  getUsers,
  deleteUser,
  bookMarkJob,
  getBookMarkedJobs,
  createContact,
} = require("../controllers/user/userController");
const { checkUser } = require("../services/checkUser");
const { isAuthenticated } = require("../services/isAuthenticated");
const { multer, storage } = require("./../services/multerConfig");
const upload = multer({ storage: storage });
const router = require("express").Router();

router.route("/register").post(register);
router.route("/login").post(logIn);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword").post(resetPassword);
router.route("/checkUser").post(checkUser);
router
  .route("/profile")
  .post(isAuthenticated, upload.single("picture"), createProfile)
  .get(isAuthenticated, getProfile);

router.route("/cv").post(isAuthenticated, createCv).get(isAuthenticated, getCv);
router.route("/getUsers").get(getUsers);
router.route("/message").post(isAuthenticated, createMessage);
router.route("/message/:userId1/:userId2").get(isAuthenticated, getMessages);
router.route("/deleteUser/:id").delete(deleteUser);
router.route("/bookMarkJob/:id").get(isAuthenticated, bookMarkJob);
router.route("/getBookMarkedJobs").get(isAuthenticated, getBookMarkedJobs);
router.route("/getSimilarJobs/:id").get(getSimilarJobs);

router.route("/contact").post(createContact).get(getContact);
router.route("/contact/:id").delete(deleteContact);

module.exports = router;
