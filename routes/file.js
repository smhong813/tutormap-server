const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

try {
  fs.readdirSync("uploads");
} catch (error) {
  fs.mkdirSync("uploads");
  console.error("A folder named Upload has been created.");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
});

router.post("/", upload.single("photo"), async (req, res, next) => {
  try {
    console.log(req.file);
    res.json({
      url: `/img/${req.file.filename}`,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
