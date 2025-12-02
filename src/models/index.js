const { Sequelize } = require("sequelize");
const sequelize = require("../config/db"); // Từ config/db.js

// Import models
const VaiTro = require("./VaiTro");
const LoaiThuCung = require("./LoaiThuCung");
const GoiThanhToan = require("./GoiThanhToan");
const CuaHang = require("./CuaHang");
const NguoiDung = require("./NguoiDung");
const HoSoNhanVien = require("./HoSoNhanVien");
const DichVuHeThong = require("./DichVuHeThong");
const DichVuCuaShop = require("./DichVuCuaShop");
const DeXuatDichVu = require("./DeXuatDichVu");
const LichHen = require("./LichHen");
const LichHenThuCung = require("./LichHenThuCung");
const LichHenChiTiet = require("./LichHenChiTiet");
const CaLamViec = require("./CaLamViec");
const GanCaLamViec = require("./GanCaLamViec");
const ThongBao = require("./ThongBao");
const ThanhToanShop = require("./ThanhToanShop");
const DanhGia = require("./DanhGia");

// Define associations
NguoiDung.belongsTo(VaiTro, { foreignKey: "maVaiTro" });
VaiTro.hasMany(NguoiDung, { foreignKey: "maVaiTro" });

NguoiDung.belongsTo(CuaHang, { foreignKey: "maCuaHang" });
CuaHang.hasMany(NguoiDung, { foreignKey: "maCuaHang" });

CuaHang.belongsTo(NguoiDung, {
  foreignKey: "nguoiDaiDien",
  as: "NguoiDaiDien",
});
NguoiDung.hasOne(CuaHang, { foreignKey: "nguoiDaiDien" });

HoSoNhanVien.belongsTo(NguoiDung, { foreignKey: "maNguoiDung" });
NguoiDung.hasOne(HoSoNhanVien, { foreignKey: "maNguoiDung" });

DichVuCuaShop.belongsTo(DichVuHeThong, { foreignKey: "maDichVuHeThong" });
DichVuHeThong.hasMany(DichVuCuaShop, { foreignKey: "maDichVuHeThong" });

DichVuCuaShop.belongsTo(CuaHang, { foreignKey: "maCuaHang" });
CuaHang.hasMany(DichVuCuaShop, { foreignKey: "maCuaHang" });

DeXuatDichVu.belongsTo(CuaHang, { foreignKey: "maCuaHang" });
CuaHang.hasMany(DeXuatDichVu, { foreignKey: "maCuaHang" });

DeXuatDichVu.belongsTo(NguoiDung, {
  foreignKey: "maQuanTriVien",
  as: "QuanTriVien",
});
NguoiDung.hasMany(DeXuatDichVu, { foreignKey: "maQuanTriVien" });

LichHen.belongsTo(CuaHang, { foreignKey: "maCuaHang" });
CuaHang.hasMany(LichHen, { foreignKey: "maCuaHang" });

LichHen.belongsTo(NguoiDung, { foreignKey: "maKhachHang", as: "KhachHang" });
NguoiDung.hasMany(LichHen, { foreignKey: "maKhachHang" });

LichHen.belongsTo(NguoiDung, { foreignKey: "maNhanVien", as: "NhanVien" });
NguoiDung.hasMany(LichHen, { foreignKey: "maNhanVien" });

LichHenThuCung.belongsTo(LichHen, { foreignKey: "maLichHen" });
LichHen.hasMany(LichHenThuCung, { foreignKey: "maLichHen" });

LichHenThuCung.belongsTo(LoaiThuCung, { foreignKey: "maLoai" });
LoaiThuCung.hasMany(LichHenThuCung, { foreignKey: "maLoai" });

LichHenChiTiet.belongsTo(LichHenThuCung, { foreignKey: "maLichHenThuCung" });
LichHenThuCung.hasMany(LichHenChiTiet, { foreignKey: "maLichHenThuCung" });

LichHenChiTiet.belongsTo(DichVuCuaShop, { foreignKey: "maDichVuCuaShop" });
DichVuCuaShop.hasMany(LichHenChiTiet, { foreignKey: "maDichVuCuaShop" });

GanCaLamViec.belongsTo(NguoiDung, { foreignKey: "maNhanVien" });
NguoiDung.hasMany(GanCaLamViec, { foreignKey: "maNhanVien" });

GanCaLamViec.belongsTo(CuaHang, { foreignKey: "maCuaHang" });
CuaHang.hasMany(GanCaLamViec, { foreignKey: "maCuaHang" });

GanCaLamViec.belongsTo(CaLamViec, { foreignKey: "maCa" });
CaLamViec.hasMany(GanCaLamViec, { foreignKey: "maCa" });

ThongBao.belongsTo(NguoiDung, { foreignKey: "maNguoiDung" });
NguoiDung.hasMany(ThongBao, { foreignKey: "maNguoiDung" });

ThanhToanShop.belongsTo(CuaHang, { foreignKey: "maCuaHang" });
CuaHang.hasMany(ThanhToanShop, { foreignKey: "maCuaHang" });

ThanhToanShop.belongsTo(GoiThanhToan, { foreignKey: "maGoi" });
GoiThanhToan.hasMany(ThanhToanShop, { foreignKey: "maGoi" });

DanhGia.belongsTo(LichHenChiTiet, { foreignKey: "maChiTietLichHen" });
LichHenChiTiet.hasOne(DanhGia, { foreignKey: "maChiTietLichHen" });

// Export
module.exports = {
  sequelize,
  VaiTro,
  LoaiThuCung,
  GoiThanhToan,
  CuaHang,
  NguoiDung,
  HoSoNhanVien,
  DichVuHeThong,
  DichVuCuaShop,
  DeXuatDichVu,
  LichHen,
  LichHenThuCung,
  LichHenChiTiet,
  CaLamViec,
  GanCaLamViec,
  ThongBao,
  ThanhToanShop,
  DanhGia,
};
