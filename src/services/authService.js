const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const NguoiDung = require("../models/NguoiDung");
const VaiTro = require("../models/VaiTro");
const { JWT_SECRET, JWT_EXPIRY, REFRESH_EXPIRY } = require("../config/index");

async function registerUser(data) {
  const { email, matKhau, hoTen, maVaiTro } = data;
  const hashedPassword = await bcrypt.hash(matKhau, 10);
  const user = await NguoiDung.create({
    email,
    matKhau: hashedPassword,
    hoTen,
    maVaiTro,
  });
  return user;
}

async function loginUser(email, matKhau) {
  const user = await NguoiDung.findOne({ where: { email }, include: [VaiTro] }); // Thêm include VaiTro
  if (!user || !(await bcrypt.compare(matKhau, user.matKhau))) {
    throw new Error("Invalid credentials");
  }
  const role = user.VaiTro ? user.VaiTro.tenVaiTro : null; // Check an toàn nếu VaiTro null
  if (!role) {
    throw new Error("Role not found for user");
  }
  const accessToken = jwt.sign(
    { id: user.maNguoiDung, role: role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
  const refreshToken = jwt.sign(
    { id: user.maNguoiDung, role: role },
    JWT_SECRET,
    { expiresIn: REFRESH_EXPIRY }
  ); // Bỏ nếu không dùng refresh
  return { user, accessToken, refreshToken };
}

function refreshAccessToken(refreshToken) {
  const decoded = jwt.verify(refreshToken, JWT_SECRET);
  const accessToken = jwt.sign(
    { id: decoded.id, role: decoded.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
  return { accessToken };
}

module.exports = { registerUser, loginUser, refreshAccessToken };
