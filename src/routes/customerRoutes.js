const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");
const customerController = require("../controllers/customerController");

// ⭐ Đảm bảo folder uploads tồn tại
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads directory:", uploadsDir);
}

// Config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Sử dụng đường dẫn tuyệt đối
  },
  filename: (req, file, cb) => {
    // Tạo tên file an toàn hơn
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, "_");
    cb(null, safeName + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images (JPEG, PNG) and PDF files are allowed!"));
    }
  },
});

// Middleware: Chỉ cho phép Customer
const customerOnly = (req, res, next) => {
  verifyToken(req, res, () => {
    checkRole(["KHACH_HANG"])(req, res, next);
  });
};

// Đăng ký cửa hàng
router.post(
  "/register-shop",
  customerOnly,
  upload.fields([
    { name: "giayPhepKD", maxCount: 1 },
    { name: "cccdMatTruoc", maxCount: 1 },
    { name: "cccdMatSau", maxCount: 1 },
    { name: "anhCuaHang", maxCount: 1 },
  ]),
  (req, res, next) => {
    console.log("📤 Files uploaded:", req.files);
    next();
  },
  customerController.registerShop
);

module.exports = router;
