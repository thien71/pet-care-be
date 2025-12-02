const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const LichHen = sequelize.define(
  "LichHen",
  {
    maLichHen: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    maCuaHang: { type: DataTypes.INTEGER, allowNull: false },
    maKhachHang: { type: DataTypes.INTEGER, allowNull: false },
    maNhanVien: { type: DataTypes.INTEGER },
    ngayHen: { type: DataTypes.DATE, allowNull: false },
    tongTien: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
    trangThai: {
      type: DataTypes.ENUM(
        "CHO_XAC_NHAN",
        "DA_XAC_NHAN",
        "DANG_THUC_HIEN",
        "HOAN_THANH",
        "HUY"
      ),
      defaultValue: "CHO_XAC_NHAN",
    },
    ghiChu: { type: DataTypes.TEXT },
    phuongThucThanhToan: {
      type: DataTypes.ENUM("TIEN_MAT", "CHUYEN_KHOAN", "THE", "KHAC"),
    },
    trangThaiThanhToan: {
      type: DataTypes.ENUM("CHUA_THANH_TOAN", "DA_THANH_TOAN", "HOAN_TIEN"),
      defaultValue: "CHUA_THANH_TOAN",
    },
    ngayThanhToan: { type: DataTypes.DATE },
    ngayTao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "LichHen", timestamps: false }
);

module.exports = LichHen;
