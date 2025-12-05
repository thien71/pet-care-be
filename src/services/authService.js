// src/services/authService.js (UPDATED)
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { NguoiDung, VaiTro, NguoiDungVaiTro } = require("../models");
const { JWT_SECRET, JWT_EXPIRY, REFRESH_EXPIRY } = require("../config/index");

/**
 * Đăng ký user mới
 * @param {Object} data - { email, matKhau, hoTen, vaiTros: [1] }
 */
async function registerUser(data) {
  const { email, matKhau, hoTen, vaiTros = [1] } = data; // Default: KHACH_HANG

  // Check email duplicate
  const existingUser = await NguoiDung.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email đã tồn tại");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(matKhau, 10);

  // Tạo user
  const user = await NguoiDung.create({
    email,
    matKhau: hashedPassword,
    hoTen,
  });

  // Gán vai trò cho user
  const roleAssignments = vaiTros.map((maVaiTro) => ({
    maNguoiDung: user.maNguoiDung,
    maVaiTro,
  }));

  await NguoiDungVaiTro.bulkCreate(roleAssignments);

  return user;
}

/**
 * Login user
 */
async function loginUser(email, matKhau) {
  const user = await NguoiDung.findOne({
    where: { email },
    include: [
      {
        model: VaiTro,
        as: "VaiTros", // ⭐ Đổi tên để rõ là nhiều vai trò
        through: { attributes: [] }, // Không lấy data từ bảng trung gian
      },
    ],
  });

  if (!user || !(await bcrypt.compare(matKhau, user.matKhau))) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }

  // ⭐ Lấy danh sách tên vai trò
  const roles = user.VaiTros.map((vt) => vt.tenVaiTro);

  if (!roles || roles.length === 0) {
    throw new Error("User chưa được gán vai trò");
  }

  console.log("🔐 User roles:", roles);

  // ⭐ Tạo JWT với DANH SÁCH vai trò
  const accessToken = jwt.sign(
    {
      id: user.maNguoiDung,
      roles, // Lưu array của các vai trò
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );

  const refreshToken = jwt.sign(
    {
      id: user.maNguoiDung,
      roles,
    },
    JWT_SECRET,
    { expiresIn: REFRESH_EXPIRY }
  );

  return { user, accessToken, refreshToken };
}

function refreshAccessToken(refreshToken) {
  const decoded = jwt.verify(refreshToken, JWT_SECRET);
  const accessToken = jwt.sign(
    {
      id: decoded.id,
      roles: decoded.roles, // ⭐ Giữ nguyên array roles
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
  return { accessToken };
}

module.exports = { registerUser, loginUser, refreshAccessToken };
