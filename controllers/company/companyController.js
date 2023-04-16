const chatModel = require("../../model/chatModel");
const companyModel = require("../../model/companyModel");

exports.getProfile = async (req, res, next) => {
  const userId = req.userId;
  try {
    const company = await companyModel.findById(userId);
    res.status(200).json({
      status: 200,
      company,
    });
  } catch (error) {
    res.json({
      error,
    });
  }
};

exports.editProfile = async (req, res, next) => {
  const userId = req.userId;
  const { name, address, website, industry, companySize } = req.body;
  try {
    const company = await companyModel.findByIdAndUpdate(
      userId,
      {
        name,
        address,
        website,
        industry,
        companySize,
      },
      {
        new: true,
      }
    );
    console.log(company);
    res.status(200).json({
      status: 200,
      company,
      msg: "Profile updated successfully",
    });
  } catch (error) {
    res.json({
      error,
    });
  }
};

exports.follow = async (req, res) => {
  const companyId = req.body.companyId;
  companyModel.findByIdAndUpdate(
    companyId,
    { $push: { followers: req.userId } },
    { new: true },
    (err, company) => {
      if (err) {
        res.json({
          err,
        });
      }
      res.json({
        status: 200,
        message: "Followed successfully",
        company,
      });
    }
  );
};

exports.getFollower = async (req, res) => {
  const follower = await companyModel
    .findById(req.userId)
    .populate("followers");
  res.json({
    status: 200,
    message: "Follower fetched successfully",
    follower,
  });
};

exports.unFollow = async (req, res) => {
  const companyId = req.body.companyId;
  companyModel.findByIdAndUpdate(
    companyId,
    { $pull: { followers: req.userId } },
    { new: true },
    (err, company) => {
      if (err) {
        res.json({
          err,
        });
      }
      res.json({
        status: 200,
        message: "Unfollowed successfully",
        company,
      });
    }
  );
};

exports.getCompanyMessages = async (req, res) => {
  console.log(req.userId);
  const messages = await chatModel
    .find({
      chatUsers: { $all: [req.userId] },
    })
    .populate("sender");

  
  res.json({
    status: 200,
    messages,
  });
};

exports.deleteCompany = async (req, res) => {
  const { id } = req.params;
  const company = await companyModel.findByIdAndDelete(id);
  res.json({
    status: 200,
    message: "Company deleted successfully",
    company,
  });
};
