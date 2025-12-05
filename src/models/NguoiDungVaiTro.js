// src/models/NguoiDungVaiTro.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const NguoiDungVaiTro = sequelize.define(
  "NguoiDungVaiTro",
  {
    maNguoiDung: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    maVaiTro: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    ngayGan: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "NguoiDungVaiTro",
    timestamps: false,
  }
);

module.exports = NguoiDungVaiTro;
