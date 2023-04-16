const companyModel = require("../model/companyModel");
const User = require("../model/userModel");

exports.isAuthenticated = async (req, res, next) => {
  console.log(req.headers)
  const token = req.cookies.token || req.headers["x-access-token"];
  console.log('Token',token)
  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }
  const user =
    (await User.findById(token)) || (await companyModel.findById(token));
  if (!user) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  req.userId = token;
  req.user = user;
  next();
};
