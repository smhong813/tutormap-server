const express = require("express");
const passport = require("passport");
const router = express.Router();

const indexRouter = require("./index");
const authRouter = require("./auth");
const userRouter = require("./user");
const studentRouter = require("./student");
const scheduleRouter = require("./schedule");
const statisticsRouter = require("./statistics");

router.use("/", indexRouter);
router.use("/auth", authRouter);

router.use("/users", userRouter);
router.use(
  "/students",
  passport.authenticate("jwt", { session: false }),
  studentRouter
);
router.use("/schedules", scheduleRouter);
router.use("/statistics", statisticsRouter);

module.exports = router;
