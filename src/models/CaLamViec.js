const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CaLamViec = sequelize.define(
  "CaLamViec",
  {
    maCa: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tenCa: { type: DataTypes.STRING(50), allowNull: false },
    gioBatDau: { type: DataTypes.TIME, allowNull: false },
    gioKetThuc: { type: DataTypes.TIME, allowNull: false },
  },
  { tableName: "CaLamViec", timestamps: false }
);

module.exports = CaLamViec;
