const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const GoiThanhToan = sequelize.define(
  "GoiThanhToan",
  {
    maGoi: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tenGoi: { type: DataTypes.STRING(100), allowNull: false },
    soTien: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    thoiGian: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "GoiThanhToan", timestamps: false }
);

module.exports = GoiThanhToan;
