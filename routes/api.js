const express = require("express");
const passport = require("passport");
const router = express.Router();

const indexRouter = require("./index");
const authRouter = require("./auth");
const userRouter = require("./user");
const studentRouter = require("./student");
const scheduleRouter = require("./schedule");
const statisticsRouter = require("./statistics");
const fileRouter = require("./file");

router.use("/", indexRouter);
router.use("/auth", authRouter);

router.use("/users", userRouter);
router.use(
  "/students",
  passport.authenticate("jwt", { session: false }),
  studentRouter
);
router.use(
  "/schedules",
  passport.authenticate("jwt", { session: false }),
  scheduleRouter
);
router.use(
  "/statistics",
  passport.authenticate("jwt", { session: false }),
  statisticsRouter
);

router.use(
  "/files",
  passport.authenticate("jwt", { session: false }),
  fileRouter
);

module.exports = router;
