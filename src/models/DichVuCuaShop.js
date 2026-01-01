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

    // ========== CÁC TRƯỜNG MỚI ==========
    hinhAnh: { type: DataTypes.STRING(255), allowNull: true },
    soLanDat: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    moTaShop: { type: DataTypes.TEXT, allowNull: true },
    thoiLuongShop: { type: DataTypes.INTEGER, allowNull: true },
    danhGiaTrungBinh: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.0,
      allowNull: false, // Getter để format đẹp khi trả về JSON
      get() {
        const rawValue = this.getDataValue("danhGiaTrungBinh");
        return rawValue ? parseFloat(rawValue).toFixed(2) : "0.00";
      },
    },
    soLuotDanhGia: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    tableName: "DichVuCuaShop",
    timestamps: false,
    uniqueKeys: { unique_key: { fields: ["maCuaHang", "maDichVuHeThong"] } },
  }
);

module.exports = DichVuCuaShop;
