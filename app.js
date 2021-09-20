const express = require("express");
const path = require("path");
const morgan = require("morgan");
const dotenv = require("dotenv");
const passport = require("passport");
const cors = require("cors");

dotenv.config();
const passportConfig = require("./passport");
const connect = require("./schemas");

const apiRouter = require("./routes/api");

const app = express();
passportConfig();
app.set("port", process.env.PORT || 8080);

connect();

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cors());

/* routes */
app.use("/api", apiRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} router doesn't exist`);
  error.status = 404;
  next(error);
});

// app.use((err, req, res, next) => {
//   res.locals.message = err.message;
//   res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
//   res.status(err.status || 500);
//   res.send(err);
// });

app.listen(app.get("port"), () => {
  console.log(`Server on: ${app.get("port")}`);
});
