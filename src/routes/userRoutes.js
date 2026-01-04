// src/routes/userRoutes.js - FIX COMPLETE

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");
const userController = require("../controllers/userController");

// ⭐ Đảm bảo folder avatars tồn tại
const avatarsDir = path.join(__dirname, "../../uploads/avatars");
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
  console.log("📁 Created avatars directory:", avatarsDir);
}

// ⭐ CONFIG MULTER - Chi tiết hơn
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("📂 Multer destination called");
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = "avatar-" + safeName + "-" + uniqueSuffix + ext;
    console.log("📄 Multer filename:", filename);
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    console.log(
      "🔍 Multer fileFilter - file:",
      file.originalname,
      file.mimetype
    );

    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      console.log("✅ File type OK");
      return cb(null, true);
    } else {
      console.log("❌ File type rejected");
      cb(new Error("Only image files (JPEG, PNG) are allowed!"));
    }
  },
});

// ==================== GET PROFILE ====================
router.get(
  "/profile",
  verifyToken,
  checkRole([
    "KHACH_HANG",
    "QUAN_TRI_VIEN",
    "CHU_CUA_HANG",
    "LE_TAN",
    "KY_THUAT_VIEN",
  ]),
  userController.getProfile
);

// ==================== UPDATE PROFILE - WITH DETAILED LOGGING ====================
router.put(
  "/profile",
  verifyToken,
  checkRole([
    "KHACH_HANG",
    "QUAN_TRI_VIEN",
    "CHU_CUA_HANG",
    "LE_TAN",
    "KY_THUAT_VIEN",
  ]),
  // ⭐ MULTER MUST BE HERE - Before controller
  upload.single("avatar"),
  // ⭐ DEBUG MIDDLEWARE - Check req.body and req.file
  (req, res, next) => {
    console.log("🔍 === AFTER MULTER ===");
    console.log("📋 req.body:", req.body);
    console.log("📁 req.file:", req.file);
    console.log("📝 req.headers['content-type']:", req.headers["content-type"]);

    // Validate
    if (!req.body.hoTen) {
      console.log("❌ hoTen is missing!");
      return res.status(400).json({ message: "hoTen is required" });
    }

    console.log("✅ All fields present");
    next();
  },
  userController.updateProfile
);

// ==================== CHANGE PASSWORD ====================
router.put(
  "/change-password",
  verifyToken,
  checkRole([
    "KHACH_HANG",
    "QUAN_TRI_VIEN",
    "CHU_CUA_HANG",
    "LE_TAN",
    "KY_THUAT_VIEN",
  ]),
  userController.changePassword
);

module.exports = router;
