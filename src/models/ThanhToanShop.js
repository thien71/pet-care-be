const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ThanhToanShop = sequelize.define(
  "ThanhToanShop",
  {
    maThanhToan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    maCuaHang: { type: DataTypes.INTEGER, allowNull: false },
    maGoi: { type: DataTypes.INTEGER, allowNull: false },
    soTien: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    thoiGianBatDau: { type: DataTypes.DATEONLY, allowNull: false },
    thoiGianKetThuc: { type: DataTypes.DATEONLY, allowNull: false },
    trangThai: {
      type: DataTypes.ENUM("DA_THANH_TOAN", "CHUA_THANH_TOAN", "QUA_HAN"),
      defaultValue: "CHUA_THANH_TOAN",
    },
    ngayTao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "ThanhToanShop", timestamps: false }
);

module.exports = ThanhToanShop;
