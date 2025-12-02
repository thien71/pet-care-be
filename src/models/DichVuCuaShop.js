const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DichVuCuaShop = sequelize.define(
  "DichVuCuaShop",
  {
    maDichVuShop: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    maDichVuHeThong: { type: DataTypes.INTEGER, allowNull: false },
    maCuaHang: { type: DataTypes.INTEGER, allowNull: false },
    gia: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    trangThai: { type: DataTypes.TINYINT, defaultValue: 1 },
  },
  {
    tableName: "DichVuCuaShop",
    timestamps: false,
    uniqueKeys: { unique_key: { fields: ["maCuaHang", "maDichVuHeThong"] } },
  }
);

module.exports = DichVuCuaShop;
