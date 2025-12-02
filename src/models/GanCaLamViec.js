const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const GanCaLamViec = sequelize.define(
  "GanCaLamViec",
  {
    maGanCa: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    maNhanVien: { type: DataTypes.INTEGER, allowNull: false },
    maCuaHang: { type: DataTypes.INTEGER, allowNull: false },
    maCa: { type: DataTypes.INTEGER, allowNull: false },
    ngayLam: { type: DataTypes.DATEONLY, allowNull: false },
  },
  { tableName: "GanCaLamViec", timestamps: false }
);

module.exports = GanCaLamViec;
