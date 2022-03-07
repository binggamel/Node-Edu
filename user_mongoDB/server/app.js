var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
require("dotenv").config();
var userCtrl = require("./api/user/user.ctrl");

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();
mongoose.connect(process.env.MONGO_URL, {});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log(process.env.MONGO_URL);
  console.log("Database connected!!");
});

// view engine setup
// reat로 작업시 필요 없는 부분
/**
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
 */

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(userCtrl.checkAuth);

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/api", require("./api"));

//-------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
//----------------------

//api모듈 설정
app.use("/api", require("./api"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
