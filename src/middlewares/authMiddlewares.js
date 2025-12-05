// src/middlewares/authMiddlewares.js (UPDATED)
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    // req.user = { id: 1, roles: ['KHACH_HANG', 'CHU_CUA_HANG'] }
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
}

/**
 * Kiểm tra user có ít nhất một trong các vai trò được phép
 * @param {Array<string>} allowedRoles - ['KHACH_HANG', 'QUAN_TRI_VIEN']
 */
function checkRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: "No roles found" });
    }

    // ⭐ Kiểm tra xem user có ít nhất 1 vai trò trong allowedRoles không
    const hasAllowedRole = req.user.roles.some((role) =>
      allowedRoles.includes(role)
    );

    if (!hasAllowedRole) {
      return res.status(403).json({
        message: "Access denied",
        required: allowedRoles,
        userRoles: req.user.roles,
      });
    }

    next();
  };
}

/**
 * Middleware mới: Kiểm tra user có TẤT CẢ các vai trò yêu cầu
 */
function requireAllRoles(requiredRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: "No roles found" });
    }

    const hasAllRoles = requiredRoles.every((role) =>
      req.user.roles.includes(role)
    );

    if (!hasAllRoles) {
      return res.status(403).json({
        message: "You need all required roles",
        required: requiredRoles,
        userRoles: req.user.roles,
      });
    }

    next();
  };
}

module.exports = { verifyToken, checkRole, requireAllRoles };
