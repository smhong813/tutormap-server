const express = require("express");
const router = express.Router();
const Student = require("../schemas/student");

// List
router.get("/", async (req, res) => {});

// add
router.post("/", (req, res) => {});

// update
router.patch("/", (req, res) => {});

// delete
router.delete("/", (req, res) => {});

module.exports = router;
