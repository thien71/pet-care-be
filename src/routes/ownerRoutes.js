// src/routes/ownerRoutes.js (Backend)
const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");
const ownerController = require("../controllers/ownerController");

// Middleware: Chỉ cho phép Owner
const ownerOnly = (req, res, next) => {
  verifyToken(req, res, () => {
    checkRole(["CHU_CUA_HANG"])(req, res, next);
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

module.exports = router;
