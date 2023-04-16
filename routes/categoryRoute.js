const {
  createCategory,
  getCategory,
  getCompanies,
  deleteCompany,
  getJobs,
  deleteCategory,
  massNotification,
} = require("../controllers/admin/adminController");
const { isAuthenticated } = require("../services/isAuthenticated");

const router = require("express").Router();

router
  .route("/category")
  .post(isAuthenticated, createCategory)
  .get(getCategory);
router.route("/companies").get(getCompanies);
router.route("/companies/:id").delete(deleteCompany);
router.route("/jobs").get(getJobs);
router.route("/category/:id").delete(isAuthenticated, deleteCategory);
router.route("/notification").post(massNotification)

module.exports = router;
