const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");
const userController = require("../controllers/userController");

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
module.exports = router;
