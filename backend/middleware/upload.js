const multer = require("multer");
const path = require("path");
const fs = require("fs");

// All uploaded images land in /uploads at the project root.
// Make sure server.js does: app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "-")
      .toLowerCase();
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExt = /\.(jpe?g|png|webp|gif)$/i;
  const allowedMime = /^image\/(jpeg|png|webp|gif)$/;

  if (allowedExt.test(file.originalname) && allowedMime.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, jpeg, png, webp, gif) are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;