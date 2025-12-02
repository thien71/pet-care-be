const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DanhGia = sequelize.define(
  "DanhGia",
  {
    maDanhGia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    maChiTietLichHen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    soSao: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    binhLuan: { type: DataTypes.TEXT },
    ngayDanhGia: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "DanhGia", timestamps: false }
);

module.exports = DanhGia;
