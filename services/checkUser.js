const User = require("../model/userModel");

exports.checkUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers["x-access-token"] || req.body.token;
  if (!token) {
    return res.json({
      status: 400,
      msg: "No token provided",
    });
  }
  const user = await User.findById(token);
  if (!user) {
    return res.status(401).json({ status: 401, msg: "Invalid token" });
  }
  res.json({
    status: 200,
    msg: "User is authenticated",
    auth: true,
  });
};
