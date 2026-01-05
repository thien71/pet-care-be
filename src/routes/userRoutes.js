// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { verifyToken, checkRole } = require("../middlewares/authMiddlewares");
const userController = require("../controllers/userController");

const avatarsDir = path.join(__dirname, "../../uploads/avatars");
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, "_");
    cb(null, "avatar-" + safeName + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG) are allowed!"));
    }
  },
});

const allRoles = ["KHACH_HANG", "QUAN_TRI_VIEN", "CHU_CUA_HANG", "LE_TAN", "KY_THUAT_VIEN"];

// ==================== PROFILE ====================
router.get("/profile", verifyToken, checkRole(allRoles), userController.getProfile);
router.put("/profile", verifyToken, checkRole(allRoles), upload.single("avatar"), userController.updateProfile);
router.put("/change-password", verifyToken, checkRole(allRoles), userController.changePassword);

// ==================== ADMIN ====================
router.get("/", verifyToken, checkRole(["QUAN_TRI_VIEN"]), userController.getUsers);
router.get("/:id", verifyToken, checkRole(["QUAN_TRI_VIEN"]), userController.getUserById);
router.put("/:id", verifyToken, checkRole(["QUAN_TRI_VIEN"]), userController.updateUser);
router.delete("/:id", verifyToken, checkRole(["QUAN_TRI_VIEN"]), userController.deleteUser);
router.post("/add-role", verifyToken, checkRole(["QUAN_TRI_VIEN"]), userController.addRoleToUser);
router.post("/remove-role", verifyToken, checkRole(["QUAN_TRI_VIEN"]), userController.removeRoleFromUser);

module.exports = router;
