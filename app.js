const express = require("express");
const app = express();
const mongoConnection = require("./config/dbConfig");
const userRoute = require("./routes/userRoute");
const companyRoute = require("./routes/companyRoute");
const jobRoute = require("./routes/jobRoute");
const appliedJobRoute = require("./routes/appliedJobRoute");
const categoryRoute = require("./routes/categoryRoute");
const socket = require("socket.io");
const path = require("path");

const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
mongoConnection(process.env.MONGO_URI);

/*  PASSPORT SETUP  */
const passport = require("passport");
const userModel = require("./model/userModel");
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
// Cors

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOption = {
  origin: "http://127.0.0.1:5173",
  credentials: true,
  preflightContinue: false,
};
app.use(cors(corsOption));
// Middlewares

// Database connection

// api
app.use(express.static(path.join(__dirname, "uploads")));
app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);
app.use("/api/appliedJob", appliedJobRoute);
app.use("/api/admin", categoryRoute);
app.get("/success", (req, res) => {
  res.send("success");
});



const PORT = process.env.PORT || 3000;
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

/*  Google AUTH  */

var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://127.0.0.1:5173/login",
  }),
  async function (req, res) {
    const findUserByEmail = await userModel.findOne({
      email: userProfile.emails[0].value,
    });
    let token;
    if (findUserByEmail) {
      token = findUserByEmail.id;
    } else {
      const user = await userModel.create({
        name: userProfile.displayName,
        email: userProfile.emails[0].value,
        password: userProfile.id,
        confirmPassword: userProfile.id,
        role: "user",
      });
      token = user.id;
    }
  

    // Successful authentication, redirect success.
    res.redirect("http://127.0.0.1:5173/google/" + token);
  }
);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://127.0.0.1:5173",

    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("addUser", (id) => {
    console.log("user added", id);
    onlineUsers.set(id, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });
});
