const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ThongBao = sequelize.define(
  "ThongBao",
  {
    maThongBao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    maNguoiDung: { type: DataTypes.INTEGER, allowNull: false },
    tieuDe: { type: DataTypes.STRING(255) },
    noiDung: { type: DataTypes.TEXT },
    loaiThongBao: {
      type: DataTypes.ENUM("DON_HANG", "HE_THONG", "KHAC"),
      defaultValue: "KHAC",
    },
    daXem: { type: DataTypes.TINYINT, defaultValue: 0 },
    ngayGui: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "ThongBao", timestamps: false }
);

module.exports = ThongBao;
