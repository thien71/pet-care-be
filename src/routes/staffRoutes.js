// src/routes/staffRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");
const staffController = require("../controllers/staffController");

// ==================== SCHEDULE ====================
router.get("/schedule", verifyToken, checkRole(["LE_TAN", "KY_THUAT_VIEN"]), staffController.getMySchedule);

// ==================== EMPLOYEE MANAGEMENT ====================
router.get("/employees", verifyToken, checkRole(["CHU_CUA_HANG"]), staffController.getEmployees);
router.post("/employees", verifyToken, checkRole(["CHU_CUA_HANG"]), staffController.addEmployee);
router.delete("/employees/:id", verifyToken, checkRole(["CHU_CUA_HANG"]), staffController.deleteEmployee);
router.put("/employees/:id/toggle-status", verifyToken, checkRole(["CHU_CUA_HANG"]), staffController.toggleEmployeeStatus);

// ==================== SHIFT MANAGEMENT ====================
router.get("/shifts", verifyToken, checkRole(["CHU_CUA_HANG"]), staffController.getShifts);
router.post("/shifts", verifyToken, checkRole(["CHU_CUA_HANG"]), staffController.assignShift);
router.post("/shifts/bulk", verifyToken, checkRole(["CHU_CUA_HANG"]), staffController.bulkAssignShifts);
router.delete("/shifts/:id", verifyToken, checkRole(["CHU_CUA_HANG"]), staffController.removeShift);

module.exports = router;
