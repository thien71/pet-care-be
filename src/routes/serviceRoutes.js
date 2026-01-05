// src/routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");
const serviceController = require("../controllers/serviceController");

// ==================== PUBLIC ROUTES ====================
router.get("/public/pet-types", serviceController.getPublicPetTypes);
router.get("/public/system", serviceController.getPublicServices);
router.get("/public/system/:serviceId", serviceController.getServiceDetail);
router.get("/public/shops", serviceController.getAllShopServices);
router.get("/public/shops/:shopServiceId", serviceController.getShopServiceDetail);
router.get("/shops/:shopId/pet-type/:petTypeId", verifyToken, checkRole(["KHACH_HANG"]), serviceController.getShopServicesByPetType);

// ==================== ADMIN - ROLES ====================
router.get("/roles", verifyToken, checkRole(["QUAN_TRI_VIEN"]), serviceController.getRoles);
router.post("/roles", verifyToken, checkRole(["QUAN_TRI_VIEN"]), serviceController.createRole);
router.put("/roles/:id", verifyToken, checkRole(["QUAN_TRI_VIEN"]), serviceController.updateRole);
router.delete("/roles/:id", verifyToken, checkRole(["QUAN_TRI_VIEN"]), serviceController.deleteRole);

// ==================== ADMIN - PET TYPES ====================
router.get("/pet-types", verifyToken, checkRole(["QUAN_TRI_VIEN"]), serviceController.getPetTypes);
router.post("/pet-types", verifyToken, checkRole(["QUAN_TRI_VIEN"]), serviceController.createPetType);
router.put("/pet-types/:id", verifyToken, checkRole(["QUAN_TRI_VIEN"]), serviceController.updatePetType);
router.delete("/pet-types/:id", verifyToken, checkRole(["QUAN_TRI_VIEN"]), serviceController.deletePetType);

// ==================== ADMIN - SYSTEM SERVICES ====================
router.get("/system", verifyToken, checkRole(["QUAN_TRI_VIEN", "CHU_CUA_HANG"]), serviceController.getSystemServices);
router.post("/system", verifyToken, checkRole(["QUAN_TRI_VIEN"]), serviceController.createSystemService);
router.put("/system/:id", verifyToken, checkRole(["QUAN_TRI_VIEN"]), serviceController.updateSystemService);
router.delete("/system/:id", verifyToken, checkRole(["QUAN_TRI_VIEN"]), serviceController.deleteSystemService);

// ==================== OWNER - SHOP SERVICES ====================
router.get("/shop", verifyToken, checkRole(["CHU_CUA_HANG"]), serviceController.getShopServices);
router.post("/shop", verifyToken, checkRole(["CHU_CUA_HANG"]), serviceController.addServiceToShop);
router.put("/shop/:id", verifyToken, checkRole(["CHU_CUA_HANG"]), serviceController.updateShopService);
router.delete("/shop/:id", verifyToken, checkRole(["CHU_CUA_HANG"]), serviceController.deleteShopService);

// ==================== SERVICE PROPOSALS ====================
router.post("/proposals", verifyToken, checkRole(["CHU_CUA_HANG"]), serviceController.proposeNewService);
router.get("/proposals", verifyToken, checkRole(["QUAN_TRI_VIEN"]), serviceController.getServiceProposals);
router.put("/proposals/:id/approve", verifyToken, checkRole(["QUAN_TRI_VIEN"]), serviceController.approveServiceProposal);
router.put("/proposals/:id/reject", verifyToken, checkRole(["QUAN_TRI_VIEN"]), serviceController.rejectServiceProposal);

module.exports = router;
