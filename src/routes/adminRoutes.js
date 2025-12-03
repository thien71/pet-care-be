// src/routes/adminRoutes.js (Backend)
const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");
const adminController = require("../controllers/adminController");

// Middleware: Chỉ cho phép Admin
const adminOnly = (req, res, next) => {
  verifyToken(req, res, () => {
    checkRole(["QUAN_TRI_VIEN"])(req, res, next);
  });
};

// Người dùng
router.get("/users", adminOnly, adminController.getUsers);
router.get("/users/:id", adminOnly, adminController.getUserById);
router.put("/users/:id", adminOnly, adminController.updateUser);
router.delete("/users/:id", adminOnly, adminController.deleteUser);

// Vai Trò
router.get("/roles", adminOnly, adminController.getRoles);
router.post("/roles", adminOnly, adminController.createRole);
router.put("/roles/:id", adminOnly, adminController.updateRole);
router.delete("/roles/:id", adminOnly, adminController.deleteRole);

// Loại Thú Cưng
router.get("/pet-types", adminOnly, adminController.getPetTypes);
router.post("/pet-types", adminOnly, adminController.createPetType);
router.put("/pet-types/:id", adminOnly, adminController.updatePetType);
router.delete("/pet-types/:id", adminOnly, adminController.deletePetType);

// Dịch Vụ Hệ Thống
router.get("/services", adminOnly, adminController.getServices);
router.post("/services", adminOnly, adminController.createService);
router.put("/services/:id", adminOnly, adminController.updateService);
router.delete("/services/:id", adminOnly, adminController.deleteService);

// Cửa Hàng
router.get("/shops", adminOnly, adminController.getShops);
router.get("/shops/:id", adminOnly, adminController.getShopById);
router.put("/shops/:id", adminOnly, adminController.updateShop);
router.delete("/shops/:id", adminOnly, adminController.deleteShop);
router.put("/shops/:id/approve", adminOnly, adminController.approveShop);
router.put("/shops/:id/reject", adminOnly, adminController.rejectShop);

// Đề Xuất Dịch Vụ
router.get(
  "/service-proposals",
  adminOnly,
  adminController.getServiceProposals
);
router.put(
  "/service-proposals/:id/approve",
  adminOnly,
  adminController.approveServiceProposal
);
router.put(
  "/service-proposals/:id/reject",
  adminOnly,
  adminController.rejectServiceProposal
);

// Gói Thanh Toán
router.get("/payment-packages", adminOnly, adminController.getPaymentPackages);
router.post(
  "/payment-packages",
  adminOnly,
  adminController.createPaymentPackage
);
router.put(
  "/payment-packages/:id",
  adminOnly,
  adminController.updatePaymentPackage
);
router.delete(
  "/payment-packages/:id",
  adminOnly,
  adminController.deletePaymentPackage
);

// Xác Nhận Thanh Toán
router.get(
  "/payment-confirmations",
  adminOnly,
  adminController.getPaymentConfirmations
);
router.put(
  "/payment-confirmations/:id/confirm",
  adminOnly,
  adminController.confirmPayment
);
router.put(
  "/payment-confirmations/:id/reject",
  adminOnly,
  adminController.rejectPayment
);

module.exports = router;
