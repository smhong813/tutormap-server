const mongoose = require("mongoose");
const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const scheduleGroupSchema = new Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: Date,
  hourlyPay: {
    type: Number,
    required: true,
  },
  totalHours: {
    type: Number,
    required: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  schedules: [
    {
      days: [Number],
      hour: Number,
      min: Number,
      ampm: String,
      subject: String,
      minsInSession: Number,
    },
  ],
  memo: String,
  studentId: {
    type: ObjectId,
    required: true,
  },
  userId: {
    type: ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ScheduleGroup", scheduleGroupSchema);
