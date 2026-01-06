// src/routes/shopRoutes.js - UPDATED
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");
const shopController = require("../controllers/shopController");

const uploadsDir = path.join(__dirname, "../../uploads");
const shopsDir = path.join(__dirname, "../../uploads/shops");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(shopsDir)) {
  fs.mkdirSync(shopsDir, { recursive: true });
}

// ==================== MULTER CONFIG FOR SHOP REGISTRATION ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, "_");
    cb(null, safeName + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images (JPEG, PNG) and PDF files are allowed!"));
    }
  },
});

// ==================== MULTER CONFIG FOR SHOP IMAGE UPDATE ====================
const shopImageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, shopsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, "_");
    cb(null, "shop-" + safeName + "-" + uniqueSuffix + ext);
  },
});

const uploadShopImage = multer({
  storage: shopImageStorage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG, WebP) are allowed!"));
    }
  },
});

// ==================== PUBLIC ROUTES ====================
router.get("/public", shopController.getPublicShops);
router.get("/public/top", shopController.getTopShops);
router.get("/public/:shopId", shopController.getShopProfile);

// ==================== CUSTOMER ====================
router.post(
  "/register",
  verifyToken,
  checkRole(["KHACH_HANG"]),
  upload.fields([
    { name: "giayPhepKD", maxCount: 1 },
    { name: "cccdMatTruoc", maxCount: 1 },
    { name: "cccdMatSau", maxCount: 1 },
    { name: "anhCuaHang", maxCount: 1 },
  ]),
  shopController.registerShop
);

// ==================== ADMIN ====================
router.get("/", verifyToken, checkRole(["QUAN_TRI_VIEN"]), shopController.getShops);
router.get("/approvals", verifyToken, checkRole(["QUAN_TRI_VIEN"]), shopController.getShopApprovals);
router.get("/:id", verifyToken, checkRole(["QUAN_TRI_VIEN"]), shopController.getShopById);
router.put("/:id", verifyToken, checkRole(["QUAN_TRI_VIEN"]), shopController.updateShop);
router.delete("/:id", verifyToken, checkRole(["QUAN_TRI_VIEN"]), shopController.deleteShop);
router.put("/:id/approve", verifyToken, checkRole(["QUAN_TRI_VIEN"]), shopController.approveShop);
router.put("/:id/reject", verifyToken, checkRole(["QUAN_TRI_VIEN"]), shopController.rejectShop);

// ==================== OWNER ====================
router.get("/my/status", verifyToken, checkRole(["CHU_CUA_HANG"]), shopController.getShopStatus);
router.get("/my/info", verifyToken, checkRole(["CHU_CUA_HANG"]), shopController.getShopInfo);
router.put("/my/info", verifyToken, checkRole(["CHU_CUA_HANG"]), uploadShopImage.single("anhCuaHang"), shopController.updateShopInfo);

// ==================== STAFF ====================
router.get("/my/customers", verifyToken, checkRole(["LE_TAN", "CHU_CUA_HANG"]), shopController.getShopCustomers);

module.exports = router;
