const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CuaHang = sequelize.define(
  "CuaHang",
  {
    maCuaHang: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tenCuaHang: { type: DataTypes.STRING(150), allowNull: false },
    diaChi: { type: DataTypes.STRING(255) },
    soDienThoai: { type: DataTypes.STRING(20) },
    moTa: { type: DataTypes.TEXT },
    nguoiDaiDien: { type: DataTypes.INTEGER },
    giayPhepKD: { type: DataTypes.STRING(255) },
    cccdMatTruoc: { type: DataTypes.STRING(255) },
    cccdMatSau: { type: DataTypes.STRING(255) },
    anhCuaHang: { type: DataTypes.TEXT },
    kinhDo: { type: DataTypes.DECIMAL(10, 6) },
    viDo: { type: DataTypes.DECIMAL(10, 6) },
    trangThai: {
      type: DataTypes.ENUM("CHO_DUYET", "HOAT_DONG", "BI_KHOA"),
      defaultValue: "CHO_DUYET",
    },
    ngayTao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "CuaHang", timestamps: false }
);

module.exports = CuaHang;
