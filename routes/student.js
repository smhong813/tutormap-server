const express = require("express");
const router = express.Router();
const Student = require("../schemas/student");

// Get a list of all students
router.get("/", async (req, res, next) => {
  try {
    const students = await Student.find({ userId: req.user._id });
    res.json(students);
  } catch (err) {
    next(err);
  }
});

// Add a new student
router.post("/", async (req, res, next) => {
  try {
    req.body.userId = req.user._id;
    const student = await Student.findOne({ email: req.body.email });
    if (student) {
      res.json({
        error: "The student is already registered",
      });
    }
    delete req.body._id;
    const newStudent = await Student.create(req.body);
    res.json(newStudent);
  } catch (err) {
    next(err);
  }
});

// Get a student's information
router.get("/:id", async (req, res, next) => {
  try {
    const student = await Student.findOne({ _id: req.params.id });
    res.json(student);
  } catch (err) {
    next(err);
  }
});

// Update a student's information
router.patch("/", async (req, res, next) => {
  try {
    req.body.userId = req.user._id;
    const student = await Student.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      { new: true }
    );
    res.json(student);
  } catch (err) {
    next(err);
  }
});

// Delete a student
router.delete("/", async (req, res, next) => {
  try {
    // TODO: It could be deleted only if it has no schedules added before.
    const result = await Student.deleteOne(req.body);
    res.json(result.deletedCount !== 1 ? { error: "error" } : {});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
