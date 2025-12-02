const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DeXuatDichVu = sequelize.define(
  "DeXuatDichVu",
  {
    maDeXuat: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    maCuaHang: { type: DataTypes.INTEGER, allowNull: false },
    tenDichVu: { type: DataTypes.STRING(100), allowNull: false },
    moTa: { type: DataTypes.TEXT },
    gia: { type: DataTypes.DECIMAL(10, 2) },
    trangThai: {
      type: DataTypes.ENUM("CHO_DUYET", "DA_DUYET", "TU_CHOI"),
      defaultValue: "CHO_DUYET",
    },
    lyDoTuChoi: { type: DataTypes.TEXT },
    maQuanTriVien: { type: DataTypes.INTEGER },
    ngayGui: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    ngayDuyet: { type: DataTypes.DATE },
  },
  { tableName: "DeXuatDichVu", timestamps: false }
);

module.exports = DeXuatDichVu;
