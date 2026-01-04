// src/services/authService.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { NguoiDung, VaiTro, NguoiDungVaiTro, CuaHang } = require("../models");
const emailService = require("./emailService");

const { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } = process.env;

/**
 * Tạo mã OTP 6 số
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Tạo token reset password
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

  // Tạo OTP 6 số
  const otpCode = generateOTP();
  const otpExpires = new Date(Date.now() + 3 * 60 * 1000); // 3 phút

  console.log("🔑 Generated OTP:", otpCode, "for email:", email);

  // Tạo user mới
  const user = await NguoiDung.create({
    email,
    matKhau: hashedPassword,
    hoTen,
    authProvider: "local",
    emailVerified: false,
    emailVerificationToken: otpCode, // Lưu OTP vào trường này
    emailVerificationExpires: otpExpires,
  });

  // Gán vai trò mặc định
  await NguoiDungVaiTro.create({
    maNguoiDung: user.maNguoiDung,
    maVaiTro: maVaiTro,
  });

  // Gửi email OTP
  try {
    await emailService.sendVerificationOTP(email, otpCode);
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    // Không throw error để user vẫn đăng ký được
  }

  return {
    maNguoiDung: user.maNguoiDung,
    email: user.email,
    hoTen: user.hoTen,
    message: "Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.",
  };
}

/**
 * Xác thực email bằng OTP
 */
async function verifyEmailWithOTP(email, otpCode) {
  const user = await NguoiDung.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("Email không tồn tại");
  }

  if (user.emailVerified) {
    throw new Error("Email đã được xác thực");
  }

  // Kiểm tra OTP có khớp không
  if (user.emailVerificationToken !== otpCode) {
    throw new Error("Mã OTP không đúng");
  }

  // Kiểm tra OTP đã hết hạn chưa
  if (user.emailVerificationExpires < new Date()) {
    throw new Error("Mã OTP đã hết hạn");
  }

  // Cập nhật trạng thái xác thực
  await user.update({
    emailVerified: true,
    emailVerificationToken: null,
    emailVerificationExpires: null,
  });

  console.log("✅ Email verified successfully for:", email);

  return { message: "Xác thực email thành công!" };
}

/**
 * Gửi lại mã OTP
 */
async function resendVerificationOTP(email) {
  const user = await NguoiDung.findOne({ where: { email } });

  if (!user) {
    throw new Error("Email không tồn tại");
  }

  if (user.emailVerified) {
    throw new Error("Email đã được xác thực");
  }

  // Tạo OTP mới
  const otpCode = generateOTP();
  const otpExpires = new Date(Date.now() + 3 * 60 * 1000);

  console.log("🔑 Resend OTP:", otpCode, "for email:", email);

  await user.update({
    emailVerificationToken: otpCode,
    emailVerificationExpires: otpExpires,
  });

  await emailService.sendVerificationOTP(email, otpCode);

  return { message: "Mã OTP mới đã được gửi đến email của bạn" };
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
        as: "VaiTros",
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

  // Kiểm tra email đã xác thực chưa
  if (!user.emailVerified) {
    throw new Error("Vui lòng xác thực email trước khi đăng nhập");
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
 * Đăng nhập bằng Google
 */
async function loginWithGoogle(googleProfile) {
  const { id: googleId, email, name, picture } = googleProfile;

  console.log("🔐 Google Login:", { email, googleId });

  let user = await NguoiDung.findOne({
    where: {
      [require("sequelize").Op.or]: [{ googleId }, { email }],
    },
    include: [
      {
        model: VaiTro,
        as: "VaiTros",
        through: { attributes: [] },
      },
      {
        model: CuaHang,
        attributes: ["maCuaHang", "tenCuaHang", "trangThai"],
      },
    ],
  });

  if (user) {
    if (!user.googleId || user.authProvider !== "google") {
      await user.update({
        googleId,
        avatar: picture || user.avatar,
        emailVerified: true,
        authProvider: "google",
      });

      user = await user.reload({
        include: [
          {
            model: VaiTro,
            as: "VaiTros",
            through: { attributes: [] },
          },
          {
            model: CuaHang,
            attributes: ["maCuaHang", "tenCuaHang", "trangThai"],
          },
        ],
      });
    }
  } else {
    user = await NguoiDung.create({
      email,
      hoTen: name,
      googleId,
      avatar: picture,
      authProvider: "google",
      emailVerified: true,
      matKhau: null,
    });

    await NguoiDungVaiTro.create({
      maNguoiDung: user.maNguoiDung,
      maVaiTro: 1,
    });

    user = await NguoiDung.findByPk(user.maNguoiDung, {
      include: [
        {
          model: VaiTro,
          as: "VaiTros",
          through: { attributes: [] },
        },
        {
          model: CuaHang,
          attributes: ["maCuaHang", "tenCuaHang", "trangThai"],
        },
      ],
    });
  }

  const roles = user.VaiTros.map((vt) => vt.tenVaiTro);

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
      authProvider: user.authProvider,
      maCuaHang: user.maCuaHang,
      CuaHang: user.CuaHang,
      VaiTros: user.VaiTros,
    },
  };
}

/**
 * Quên mật khẩu
 */
async function forgotPassword(email) {
  const user = await NguoiDung.findOne({ where: { email } });

  if (!user) {
    return {
      message: "Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu",
    };
  }

  if (user.authProvider === "google") {
    throw new Error(
      "Tài khoản Google không thể đặt lại mật khẩu bằng cách này"
    );
  }

  const resetToken = generateVerificationToken();
  const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

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
    where: { resetPasswordToken: token },
  });

  if (!user) {
    throw new Error("Token không hợp lệ");
  }

  if (user.resetPasswordExpires < new Date()) {
    throw new Error("Token đã hết hạn");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await user.update({
    matKhau: hashedPassword,
    resetPasswordToken: null,
    resetPasswordExpires: null,
  });

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
  verifyEmailWithOTP,
  resendVerificationOTP,
  loginUser,
  loginWithGoogle,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
};
