const express = require("express");
const router = express.Router();
const multer = require("multer"); // Thêm dòng này
const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");
const customerController = require("../controllers/customerController");

// Config multer: Lưu file vào folder 'uploads/' (tạo folder nếu chưa có, ở root project)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Tên file unique để tránh trùng
  },
});
const upload = multer({ storage });

// Middleware: Chỉ cho phép Customer
const customerOnly = (req, res, next) => {
  verifyToken(req, res, () => {
    checkRole(["KHACH_HANG"])(req, res, next);
  });
};

// Đăng ký cửa hàng - Apply multer trước controller
router.post(
  "/register-shop",
  customerOnly,
  upload.fields([
    // Xử lý các field file
    { name: "giayPhepKD", maxCount: 1 },
    { name: "cccdMatTruoc", maxCount: 1 },
    { name: "cccdMatSau", maxCount: 1 },
    { name: "anhCuaHang", maxCount: 1 },
  ]),
  customerController.registerShop
);

module.exports = router;
