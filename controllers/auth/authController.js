const companyModel = require("../../model/companyModel");
const User = require("../../model/userModel");
const sendEmail = require("../../services/sendEmail");

exports.register = async (req, res) => {
  //   console.log(req.body);
  const { name, email, password, confirmPassword, role } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ msg: "Please fill all the fields" });
  }

  if (password.toLowerCase() !== confirmPassword.toLowerCase()) {
    return res.status(400).json({ msg: "Password does not match" });
  }
  try {
    const userExists = await User.findOne({
      email 
    })
    if(userExists) return res.json({
      status  : 400,
      message : "user with that email already registered"
    })
    const user = await User.create({
      name,
      email,
      password,
      confirmPassword,
      role,
    });
    if (user) {
      return res.status(200).json({
        status: 200,
        msg: "User registered successfully",
        user: user,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error occured",
      error: error,
    });
  }
};
exports.logIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please fill all the fields" });
  }

  try {
    const user =
      (await User.findOne({ email: email })) ||
      (await companyModel.findOne({ email: email }));

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    console.log(user, password);
    if (user.password == password) {
      const token = user.id;
      //   res.set("Set-Cookie", `token=${token}; Max-Age=60;`);

      res.cookie("token", user.id);
      res.status(200).json({
        status: 200,
        msg: "User logged in successfully",
        user: user,
        token,
      });
    } else {
      return res
        .status(400)
        .json({ status: 400, msg: "Password does not match" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error occured", error: error });
  }
};

exports.registerCompany = async (req, res) => {
  //   console.log(req.body);
  const { name, address, email, password, website, industry, size,phone } = req.body;
  if (
    !name ||
    !address ||
    !email ||
    !password ||
    !website ||
    !industry ||
    !size || 
    !phone
  ) {
    return res
      .status(400)
      .json({ status: 400, msg: "Please fill all the fields" });
  }

  try {
    const companyexists = await companyModel.findOne({
      phone :phone
    })
    const companyexistsemail = await companyModel.findOne({
      email 
    })
    if(companyexistsemail){
      return res.json({
        message : "email already registered",
        status : 400
      })
    }
    if(companyexists){
      return res.json({
        message : "phone already registered",
        status : 400
      })
    }
    const company = await companyModel.create({
      name,
      address,
      email,
      password,
      website,
      industry,
      companySize: size,
      phone
    });
    if (company) {
      return res.status(200).json({
        status: 200,
        msg: "Company registered successfully",
        company: company,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      msg: "Error occured",
      messsage: error.message,
      error: error,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ msg: "Please fill all the fields" });
  }
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    user.otp = otp;
    await user.save();
    await sendEmail({
      email: email,
      subject: "OTP for password reset",
      message: `Your OTP for password reset is ${otp}`,
    });
    res.status(200).json({
      status: 200,
      msg: "OTP sent successfully",
      otp: otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error occured", error: error });
  }
};

exports.resetPassword = async (req, res) => {
  const { otp, password, email } = req.body;
  if (!otp || !password) {
    return res.status(400).json({ msg: "Please fill all the fields" });
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    if (user.otp == otp) {
      user.password = password;
      user.otp = null;
      await user.save();
      res.status(200).json({
        status: 200,
        msg: "Password reset successfully",
      });
    } else {
      res.status(400).json({
        status: 400,
        msg: "OTP does not match",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error occured", error: error });
  }
};
