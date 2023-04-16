const mongoose = require("mongoose");
const userModel = require("../model/userModel");

// Database connection
function mongoConnection(url) {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(async () => {
      console.log("Database connected");
      userModel.findOne({ role: "admin" }).then((admin) => {
        if (admin) {
          console.log(admin)
          // delete
          console.log("Admin already seeded");
          return;
        } else {
          userModel
            .create({
              name: "admin",
              email: "admin@gmail.com",
              password: "password",
              confirmPassword: "password",
              role: "admin",
            })
            .then((admin) => {
              console.log(admin);
              console.log("Admin seeded");
            });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = mongoConnection;
