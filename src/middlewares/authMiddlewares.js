const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
}

function checkRole(roles) {
  // roles: ['KHACH_HANG', 'QUAN_TRI_VIEN']
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

module.exports = { verifyToken, checkRole };
