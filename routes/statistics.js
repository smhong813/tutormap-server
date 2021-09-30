const express = require("express");
const router = express.Router();
const Student = require("../schemas/student");
const ScheduleGroup = require("../schemas/scheduleGroup");
const Schedule = require("../schemas/schedule");

router.get("/", async (req, res, next) => {
  try {
    // 1
    console.log(req.query);
    console.log(req.user._id);
    if (req.query.type === "progress") {
      const groups = await ScheduleGroup.find({
        $and: [
          { userId: req.user._id },
          //   {
          //     startDate: {
          //       $lte: new Date(),
          //     },
          //   },
          //   {
          //     endDate: {
          //       $gte: new Date(),
          //     },
          //   },
        ],
      });
      console.log(groups);
      //   console.log("now:", new Date());
      const schedulesList = [];
      for (let i = 0; i < groups.length; i++) {
        const schedules = await Schedule.find({
          groupId: groups[i]._id,
        }).populate("student");
        schedulesList.push({
          group: groups[i],
          schedules,
        });
      }
      // console.log(schedulesList);
      res.json(schedulesList);
    }
    // 2
    else if (req.query.type === "income") {
      const year = +req.query.year;
      const month = +req.query.month;

      const schedules = await Schedule.find({
        $and: [
          { userId: req.user._id },
          //   { $eq: [{ $year: "$startDateTime" }, year] },
          //   { $eq: [{ $month: "$startDateTime" }, month] },
        ],
      });
      //   console.log(schedules);

      const filteredSchedules = schedules.filter((item) => {
        const startDateTime = new Date(item.startDateTime);
        return (
          startDateTime.getFullYear() === year &&
          startDateTime.getMonth() + 1 === month
        );
      });

      if (filteredSchedules.length > 0) {
        const group = await ScheduleGroup.findOne({
          _id: filteredSchedules[0].groupId,
        });

        res.json({
          hourlyPay: group.hourlyPay,
          schedules: filteredSchedules,
        });
      } else {
        res.json({
          hourlyPay: 0,
          schedules: [],
        });
      }
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
