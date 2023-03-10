const express = require("express");
const { connect } = require("mongoose");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
require("dotenv/config");

const authRoute = require("./routes/auth");
const videoRoute = require("./routes/videos");
const commentRoute = require("./routes/comments");
const userRoute = require("./routes/users");
const subcribedRoute = require("./routes/subscribed");

app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(
  cors({
    origin: process.env.CORS,
  })
);
const db = async () => {
  connect(process.env.MONGO)
    .then(() => {
      console.log("connected to database");
    })
    .catch((err) => {
      throw err;
    });
};

app.use("/api/auth", authRoute);
app.use("/api/videos", videoRoute);
app.use("/api/comment", commentRoute);
app.use("/api/users", userRoute);
app.use("/api/subcribed", subcribedRoute);

const Port = process.env.PORT || 3001;

app.listen(Port, () => {
  db();
  console.log(`api running at Port ${Port}`);
});
