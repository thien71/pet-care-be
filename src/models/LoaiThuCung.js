const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const LoaiThuCung = sequelize.define(
  "LoaiThuCung",
  {
    maLoai: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tenLoai: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  },
  { tableName: "LoaiThuCung", timestamps: false }
);

module.exports = LoaiThuCung;
