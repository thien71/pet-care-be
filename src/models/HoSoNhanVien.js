const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HoSoNhanVien = sequelize.define(
  "HoSoNhanVien",
  {
    maHoSo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    maNguoiDung: { type: DataTypes.INTEGER, allowNull: false },
    kinhNghiem: { type: DataTypes.INTEGER, defaultValue: 0 },
    chungChi: { type: DataTypes.TEXT },
    ngayVaoLam: { type: DataTypes.DATE },
    ghiChu: { type: DataTypes.TEXT },
  },
  { tableName: "HoSoNhanVien", timestamps: false }
);

module.exports = HoSoNhanVien;
