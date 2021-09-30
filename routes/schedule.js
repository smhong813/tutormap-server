const express = require("express");
const router = express.Router();
const Schedule = require("../schemas/schedule");
const ScheduleGroup = require("../schemas/scheduleGroup");
const dateUtils = require("../utils/date");

router.get("/", async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    const schedules = await Schedule.find({
      userId: req.user._id,
      startDateTime: {
        $gte: today,
      },
    })
      .sort({ startDateTime: "asc" })
      .populate("student");
    const unconfirmedSchedules = await Schedule.find({
      userId: req.user._id,
      done: false,
      startDateTime: {
        $lte: today,
      },
    })
      .sort({ startDateTime: "asc" })
      .populate("student");
    res.json({
      schedules,
      unconfirmedSchedules,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const schedules = req.body.schedules;
    const data = req.body;
    data.userId = req.user._id;

    const scheduleGroup = await ScheduleGroup.create(data);
    const groupId = scheduleGroup._id;

    const startDate = new Date(data.startDate);
    const newSchedules = [];
    let remainingMinutes = data.totalHours * 60;

    while (remainingMinutes > 0) {
      for (let i = 0; i < schedules.length; i++) {
        for (let j = 0; j < schedules[i].days.length; j++) {
          if (startDate.getDay() === schedules[i].days[j]) {
            const startDateTime = dateUtils.setTime(
              startDate,
              schedules[i].hour,
              schedules[i].min,
              schedules[i].ampm
            );

            const endDateTime = dateUtils.addHours(startDateTime, 2);
            newSchedules.push({
              subject: schedules[i].subject,
              startDateTime,
              endDateTime,
              student: data.studentId,
              groupId: groupId,
              userId: req.user._id,
            });
            remainingMinutes -= schedules[i].minsInSession;
          }
        }
      }

      startDate.setDate(startDate.getDate() + 1);
    }

    const updatedScheduleGroup = await ScheduleGroup.updateOne(
      { _id: groupId },
      {
        startDate: newSchedules[0].startDateTime,
        endDate: newSchedules[newSchedules.length - 1].endDateTime,
      }
    );

    const schedulesInsertResult = await Schedule.insertMany(newSchedules);
    console.log(schedulesInsertResult);
    res.json({});
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const schedule = await Schedule.findOne({ _id: req.params.id }).populate(
      "student"
    );
    // available
    const schedules = await Schedule.find({ groupId: schedule.groupId }).sort({
      startDateTime: "asc",
    });
    const index = schedules.findIndex(
      (item) =>
        item.startDateTime.toDateString() ===
        schedule.startDateTime.toDateString()
    );
    let availableStartDate = new Date(schedule.startDateTime.valueOf());
    let availableEndDate = new Date(schedule.endDateTime.valueOf());
    if (index === 0) {
      availableStartDate.setDate(availableStartDate.getDate() - 5);
    } else {
      availableStartDate = new Date(
        schedules[index - 1].startDateTime.valueOf()
      );
      availableStartDate.setDate(availableStartDate.getDate() + 1);
    }

    if (index === schedules.length - 1) {
      availableEndDate.setDate(availableEndDate.getDate() + 5);
    } else {
      availableEndDate = new Date(schedules[index + 1].endDateTime.valueOf());
      availableEndDate.setDate(availableEndDate.getDate() - 1);
    }

    const schd = schedule.toObject();
    const availableDates = [];
    const diffInTime =
      availableEndDate.getTime() - availableStartDate.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    for (let i = 0; i <= diffInDays; i++) {
      const d = new Date(availableStartDate.valueOf());
      d.setDate(d.getDate() + i);
      availableDates.push({
        // text: `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${(
        //   "0" + d.getDate()
        // ).slice(-2)}`,
        text: d.toLocaleDateString(undefined, {
          weekday: "short",
          day: "numeric",
        }),
        value: d,
      });
    }
    schd.availableDates = availableDates;
    // console.log(schd);
    res.json(schd);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    if (req.body.schedule) {
      console.log("schedule:", req.body.schedule);
      if (req.body.type === "done") {
        const updated = await Schedule.findOneAndUpdate(
          { _id: req.params.id },
          { done: true },
          { new: true }
        );
        console.log(updated);
        res.json(updated);
        return;
      } else if (req.body.type === "skip") {
        // const updated = await Schedule.findOneAndUpdate(
        //   { _id: req.params.id },
        //   { skip: true },
        //   { new: true }
        // );
        // const group = await ScheduleGroup.findOne({_id: updated.groupId})
        // Calculate the date of the next session after the last session, and add the date
      }

      const updated = await Schedule.findOneAndUpdate(
        { _id: req.params.id },
        req.body.schedule,
        { new: true }
      );
      console.log(updated);
      res.json(updated);
    }

    if (req.body.memo) {
      console.log("memo:", req.body.memo);
      let result;
      if (req.body.memo.type === "add") {
        result = await Schedule.updateOne(
          { _id: req.params.id },
          { $push: { memo: { text: req.body.memo.text } } },
          { new: true }
        );
        console.log("updated:", result);
      } else if (req.body.memo.type === "delete") {
        result = await Schedule.updateOne(
          { _id: req.params.id },
          {
            $pull: {
              memo: {
                _id: req.body.memo._id,
              },
            },
          }
        );
        console.log("deleted:", result);
      }
      if (result.modifiedCount === 1) {
        const schedule = await Schedule.findOne({ _id: req.params.id }, "memo");
        console.log("RESULT:", schedule);
        res.json(schedule.memo);
      }
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
