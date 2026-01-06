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
    maGoi: {
      type: DataTypes.INTEGER,
      allowNull: true, // Cho phép null cho TRIAL period
    },
    soTien: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    thoiGianBatDau: { type: DataTypes.DATEONLY, allowNull: false },
    thoiGianKetThuc: { type: DataTypes.DATEONLY, allowNull: false },
    trangThai: {
      type: DataTypes.ENUM(
        "TRIAL", // NEW: Grace period 7 ngày
        "CHUA_THANH_TOAN",
        "CHO_XAC_NHAN",
        "DA_THANH_TOAN",
        "TU_CHOI",
        "QUA_HAN"
      ),
      defaultValue: "CHUA_THANH_TOAN",
    },
    bienLaiThanhToan: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Đường dẫn ảnh biên lai",
    },
    ghiChu: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ngayThanhToan: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Ngày chủ shop upload biên lai",
    },
    ngayXacNhan: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Ngày admin xác nhận",
    },
    nguoiXacNhan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Admin ID",
    },
    ngayTao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "ThanhToanShop", timestamps: false }
);

module.exports = ThanhToanShop;
