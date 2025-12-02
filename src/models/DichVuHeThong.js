const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DichVuHeThong = sequelize.define(
  "DichVuHeThong",
  {
    maDichVu: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tenDichVu: { type: DataTypes.STRING(100), allowNull: false },
    moTa: { type: DataTypes.TEXT },
    thoiLuong: { type: DataTypes.INTEGER },
    trangThai: { type: DataTypes.TINYINT, defaultValue: 1 },
  },
  { tableName: "DichVuHeThong", timestamps: false }
);

module.exports = DichVuHeThong;
