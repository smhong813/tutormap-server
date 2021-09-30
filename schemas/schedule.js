const mongoose = require("mongoose");
const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const scheduleSchema = new Schema({
  subject: {
    type: String,
    required: true,
  },
  startDateTime: {
    type: Date,
    required: true,
  },
  endDateTime: {
    type: Date,
    required: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
  skip: {
    type: Boolean,
    default: false,
  },
  changeHistories: [
    {
      originalStartDateTime: Date,
      originalEndDateTime: Date,
      updatedStartDateTime: Date,
      updatedEndDateTime: Date,
    },
  ],
  student: {
    type: ObjectId,
    ref: "Student",
    required: true,
  },
  memo: [
    {
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  groupId: {
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

module.exports = mongoose.model("Schedule", scheduleSchema);
