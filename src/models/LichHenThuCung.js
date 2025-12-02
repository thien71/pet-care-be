const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const LichHenThuCung = sequelize.define(
  "LichHenThuCung",
  {
    maLichHenThuCung: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    maLichHen: { type: DataTypes.INTEGER, allowNull: false },
    maLoai: { type: DataTypes.INTEGER, allowNull: false },
    ten: { type: DataTypes.STRING(100) },
    tuoi: { type: DataTypes.INTEGER },
    anhThuCung: { type: DataTypes.STRING(255) },
    dacDiem: { type: DataTypes.TEXT },
  },
  { tableName: "LichHenThuCung", timestamps: false }
);

module.exports = LichHenThuCung;
