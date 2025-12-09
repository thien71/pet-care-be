// src/routes/ownerRoutes.js (FIXED)
const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");
const ownerController = require("../controllers/ownerController");

// ⭐ Debug: Kiểm tra controller có đầy đủ functions không
console.log("🔍 Owner Controller functions:", Object.keys(ownerController));

// Middleware: Chỉ cho phép Owner hoặc Customer có shop
const ownerOnly = (req, res, next) => {
  verifyToken(req, res, () => {
    // ⭐ UPDATED: Cho phép cả KHACH_HANG nếu có shop
    checkRole(["CHU_CUA_HANG"])(req, res, next);
    // checkRole(["CHU_CUA_HANG", "KHACH_HANG"])(req, res, next);
  });
};

// Thông tin cửa hàng
router.get("/shop-info", ownerOnly, ownerController.getShopInfo);
router.put("/shop-info", ownerOnly, ownerController.updateShopInfo);

// Dịch vụ
router.get("/system-services", ownerOnly, ownerController.getSystemServices);
router.get("/shop-services", ownerOnly, ownerController.getShopServices);
router.post("/shop-services", ownerOnly, ownerController.addServiceToShop);
router.put("/shop-services/:id", ownerOnly, ownerController.updateShopService);
router.delete(
  "/shop-services/:id",
  ownerOnly,
  ownerController.deleteShopService
);
router.post("/propose-service", ownerOnly, ownerController.proposeNewService);

// Nhân viên
router.get("/employees", ownerOnly, ownerController.getEmployees);
router.post("/employees", ownerOnly, ownerController.addEmployee);
router.delete("/employees/:id", ownerOnly, ownerController.deleteEmployee);

// Ca làm
router.get("/shifts", ownerOnly, ownerController.getShifts);
router.post("/assign-shift", ownerOnly, ownerController.assignShift);
router.delete("/shifts/:id", ownerOnly, ownerController.removeShift);

// Thanh toán
router.get("/payment-packages", ownerOnly, ownerController.getPaymentPackages);
router.get("/my-payments", ownerOnly, ownerController.getMyPayments);
router.post("/purchase-package", ownerOnly, ownerController.purchasePackage);

module.exports = router;
