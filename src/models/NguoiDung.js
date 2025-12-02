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
    hoTen: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    matKhau: { type: DataTypes.STRING(255), allowNull: false },
    soDienThoai: { type: DataTypes.STRING(20) },
    diaChi: { type: DataTypes.STRING(255) },
    avatar: { type: DataTypes.STRING(255) },
    maVaiTro: { type: DataTypes.INTEGER, allowNull: false },
    maCuaHang: { type: DataTypes.INTEGER },
    trangThai: { type: DataTypes.TINYINT, defaultValue: 1 },
    ngayTao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "NguoiDung", timestamps: false }
);

module.exports = NguoiDung;
