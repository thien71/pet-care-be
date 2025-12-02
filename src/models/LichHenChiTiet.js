const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const LichHen = require("./LichHen");
const LichHenThuCung = require("./LichHenThuCung");

const LichHenChiTiet = sequelize.define(
  "LichHenChiTiet",
  {
    maChiTietLichHen: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    maLichHenThuCung: { type: DataTypes.INTEGER, allowNull: false },
    maDichVuCuaShop: { type: DataTypes.INTEGER, allowNull: false },
    gia: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  { tableName: "LichHenChiTiet", timestamps: false }
);

// Hooks cho trigger cập nhật tongTien
const updateTongTien = async (instance, options) => {
  const lichHenThuCung = await LichHenThuCung.findByPk(
    instance.maLichHenThuCung
  );
  if (lichHenThuCung) {
    const tongTien = await LichHenChiTiet.sum("gia", {
      where: { maLichHenThuCung: lichHenThuCung.maLichHenThuCung },
    });
    await LichHen.update(
      { tongTien: tongTien || 0 },
      { where: { maLichHen: lichHenThuCung.maLichHen } }
    );
  }
};

LichHenChiTiet.afterCreate(updateTongTien);
LichHenChiTiet.afterUpdate(updateTongTien);
LichHenChiTiet.afterDestroy(updateTongTien);

module.exports = LichHenChiTiet;
