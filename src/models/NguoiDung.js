// src/models/NguoiDung.js (UPDATED - COMPLETE)
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const NguoiDung = sequelize.define(
  "NguoiDung",
  {
    maNguoiDung: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // ==================== CÁC TRƯỜNG CƠ BẢN ====================
    hoTen: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    matKhau: {
      type: DataTypes.STRING(255),
      allowNull: true, // ✅ Cho phép null cho Google OAuth users
    },
    soDienThoai: { type: DataTypes.STRING(20) },
    diaChi: { type: DataTypes.STRING(255) },
    avatar: {
      type: DataTypes.TEXT, // ✅ Đổi từ VARCHAR thành TEXT để lưu URL dài
      allowNull: true,
    },

    // ==================== CỦA HÀNG ====================
    maCuaHang: { type: DataTypes.INTEGER },

    // ==================== EMAIL VERIFICATION ====================
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: "Trạng thái xác thực email",
    },
    emailVerificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Token xác thực email (hết hạn sau 24 giờ)",
    },
    emailVerificationExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Thời gian hết hạn token xác thực",
    },

    // ==================== OAUTH & AUTH METHOD ====================
    googleId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      comment: "Google ID cho OAuth login",
    },
    authProvider: {
      type: DataTypes.ENUM("local", "google"),
      defaultValue: "local",
      allowNull: false,
      comment: "Phương thức đăng ký: local (email/password) hoặc google",
    },

    // ==================== RESET PASSWORD ====================
    resetPasswordToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Token reset mật khẩu (hết hạn sau 1 giờ)",
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Thời gian hết hạn token reset",
    },

    // ==================== STATUS ====================
    trangThai: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: "1: Hoạt động, 0: Bị khóa",
    },
    ngayTao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "NguoiDung",
    timestamps: false,
    indexes: [
      {
        fields: ["email"],
        name: "idx_nguoi_dung_email",
      },
      {
        fields: ["googleId"],
        name: "idx_nguoi_dung_google_id",
      },
      {
        fields: ["emailVerificationToken"],
        name: "idx_email_verification_token",
      },
      {
        fields: ["resetPasswordToken"],
        name: "idx_reset_password_token",
      },
    ],
  }
);

module.exports = NguoiDung;
