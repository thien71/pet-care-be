// src/services/authService.js (UPDATED)
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { NguoiDung, VaiTro, NguoiDungVaiTro, CuaHang } = require("../models");
const emailService = require("./emailService");

const { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } = process.env;

/**
 * Tạo token xác thực email
 */
function generateVerificationToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Đăng ký người dùng mới
 */
async function registerUser({ email, matKhau, hoTen, maVaiTro = 1 }) {
  // Kiểm tra email đã tồn tại
  const existingUser = await NguoiDung.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email đã được sử dụng");
  }

  // Hash mật khẩu
  const hashedPassword = await bcrypt.hash(matKhau, 10);

  // Tạo verification token
  const verificationToken = generateVerificationToken();
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  // Tạo user mới
  const user = await NguoiDung.create({
    email,
    matKhau: hashedPassword,
    hoTen,
    authProvider: "local",
    emailVerified: false,
    emailVerificationToken: verificationToken,
    emailVerificationExpires: verificationExpires,
  });

  // Gán vai trò mặc định
  await NguoiDungVaiTro.create({
    maNguoiDung: user.maNguoiDung,
    maVaiTro: maVaiTro,
  });

  // Gửi email xác thực
  try {
    await emailService.sendVerificationEmail(email, verificationToken);
  } catch (error) {
    console.error("❌ Failed to send verification email:", error);
    // Không throw error để user vẫn đăng ký được
  }

  return {
    maNguoiDung: user.maNguoiDung,
    email: user.email,
    hoTen: user.hoTen,
    message:
      "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
  };
}

/**
 * Xác thực email
 */
async function verifyEmail(token) {
  const user = await NguoiDung.findOne({
    where: {
      emailVerificationToken: token,
    },
  });

  if (!user) {
    throw new Error("Token không hợp lệ");
  }

  // Kiểm tra token đã hết hạn chưa
  if (user.emailVerificationExpires < new Date()) {
    throw new Error("Token đã hết hạn");
  }

  // Cập nhật trạng thái xác thực
  await user.update({
    emailVerified: true,
    emailVerificationToken: null,
    emailVerificationExpires: null,
  });

  return { message: "Xác thực email thành công!" };
}

/**
 * Gửi lại email xác thực
 */
async function resendVerificationEmail(email) {
  const user = await NguoiDung.findOne({ where: { email } });

  if (!user) {
    throw new Error("Email không tồn tại");
  }

  if (user.emailVerified) {
    throw new Error("Email đã được xác thực");
  }

  // Tạo token mới
  const verificationToken = generateVerificationToken();
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await user.update({
    emailVerificationToken: verificationToken,
    emailVerificationExpires: verificationExpires,
  });

  await emailService.sendVerificationEmail(email, verificationToken);

  return { message: "Email xác thực đã được gửi lại" };
}

/**
 * Đăng nhập
 */
async function loginUser(email, matKhau) {
  const user = await NguoiDung.findOne({
    where: { email },
    include: [
      {
        model: VaiTro,
        through: { attributes: [] },
      },
      {
        model: CuaHang,
        attributes: ["maCuaHang", "tenCuaHang", "trangThai"],
      },
    ],
  });

  if (!user) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }

  // Kiểm tra provider
  if (user.authProvider === "google") {
    throw new Error(
      "Tài khoản này được đăng ký bằng Google. Vui lòng đăng nhập bằng Google."
    );
  }

  // Kiểm tra mật khẩu
  const isMatch = await bcrypt.compare(matKhau, user.matKhau);
  if (!isMatch) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }

  // Cảnh báo nếu email chưa xác thực (nhưng vẫn cho đăng nhập)
  const emailWarning = !user.emailVerified
    ? "Lưu ý: Email của bạn chưa được xác thực. Vui lòng kiểm tra hộp thư."
    : null;

  // Lấy danh sách vai trò
  const roles = user.VaiTros.map((vt) => vt.tenVaiTro);

  // Tạo tokens
  const accessToken = jwt.sign({ id: user.maNguoiDung, roles }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign({ id: user.maNguoiDung }, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });

  return {
    accessToken,
    refreshToken,
    user: {
      maNguoiDung: user.maNguoiDung,
      email: user.email,
      hoTen: user.hoTen,
      avatar: user.avatar,
      soDienThoai: user.soDienThoai,
      diaChi: user.diaChi,
      emailVerified: user.emailVerified,
      maCuaHang: user.maCuaHang,
      CuaHang: user.CuaHang,
      VaiTros: user.VaiTros,
    },
    warning: emailWarning,
  };
}

/**
 * Đăng nhập bằng Google
 */
async function loginWithGoogle(googleProfile) {
  const { id: googleId, email, name, picture } = googleProfile;

  // Tìm user theo googleId hoặc email
  let user = await NguoiDung.findOne({
    where: {
      [require("sequelize").Op.or]: [{ googleId }, { email }],
    },
    include: [
      {
        model: VaiTro,
        through: { attributes: [] },
      },
      {
        model: CuaHang,
        attributes: ["maCuaHang", "tenCuaHang", "trangThai"],
      },
    ],
  });

  if (user) {
    // Nếu user đã tồn tại nhưng chưa có googleId, cập nhật
    if (!user.googleId) {
      await user.update({
        googleId,
        avatar: picture || user.avatar,
        emailVerified: true, // Google đã verify email
      });
    }
  } else {
    // Tạo user mới
    user = await NguoiDung.create({
      email,
      hoTen: name,
      googleId,
      avatar: picture,
      authProvider: "google",
      emailVerified: true,
      matKhau: null, // Google users không có password
    });

    // Gán vai trò mặc định KHACH_HANG
    await NguoiDungVaiTro.create({
      maNguoiDung: user.maNguoiDung,
      maVaiTro: 1, // KHACH_HANG
    });

    // Load lại để có đầy đủ thông tin
    user = await NguoiDung.findByPk(user.maNguoiDung, {
      include: [
        {
          model: VaiTro,
          through: { attributes: [] },
        },
        {
          model: CuaHang,
          attributes: ["maCuaHang", "tenCuaHang", "trangThai"],
        },
      ],
    });
  }

  // Lấy danh sách vai trò
  const roles = user.VaiTros.map((vt) => vt.tenVaiTro);

  // Tạo tokens
  const accessToken = jwt.sign({ id: user.maNguoiDung, roles }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign({ id: user.maNguoiDung }, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });

  return {
    accessToken,
    refreshToken,
    user: {
      maNguoiDung: user.maNguoiDung,
      email: user.email,
      hoTen: user.hoTen,
      avatar: user.avatar,
      soDienThoai: user.soDienThoai,
      diaChi: user.diaChi,
      emailVerified: user.emailVerified,
      maCuaHang: user.maCuaHang,
      CuaHang: user.CuaHang,
      VaiTros: user.VaiTros,
    },
  };
}

/**
 * Quên mật khẩu - Gửi email reset
 */
async function forgotPassword(email) {
  const user = await NguoiDung.findOne({ where: { email } });

  if (!user) {
    // Không báo lỗi để tránh lộ thông tin user có tồn tại không
    return {
      message: "Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu",
    };
  }

  if (user.authProvider === "google") {
    throw new Error(
      "Tài khoản Google không thể đặt lại mật khẩu bằng cách này"
    );
  }

  // Tạo reset token
  const resetToken = generateVerificationToken();
  const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h

  await user.update({
    resetPasswordToken: resetToken,
    resetPasswordExpires: resetExpires,
  });

  await emailService.sendResetPasswordEmail(email, resetToken);

  return {
    message: "Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu",
  };
}

/**
 * Đặt lại mật khẩu
 */
async function resetPassword(token, newPassword) {
  const user = await NguoiDung.findOne({
    where: {
      resetPasswordToken: token,
    },
  });

  if (!user) {
    throw new Error("Token không hợp lệ");
  }

  // Kiểm tra token đã hết hạn chưa
  if (user.resetPasswordExpires < new Date()) {
    throw new Error("Token đã hết hạn");
  }

  // Hash mật khẩu mới
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Cập nhật mật khẩu
  await user.update({
    matKhau: hashedPassword,
    resetPasswordToken: null,
    resetPasswordExpires: null,
  });

  // Gửi email thông báo
  try {
    await emailService.sendPasswordChangedEmail(user.email);
  } catch (error) {
    console.error("❌ Failed to send password changed email:", error);
  }

  return { message: "Đặt lại mật khẩu thành công!" };
}

/**
 * Refresh access token
 */
function refreshAccessToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const accessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    return { accessToken };
  } catch (err) {
    throw new Error("Invalid refresh token");
  }
}

module.exports = {
  registerUser,
  verifyEmail,
  resendVerificationEmail,
  loginUser,
  loginWithGoogle,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
};
