// src/models/index.js (UPDATED)
const { Sequelize } = require("sequelize");
const sequelize = require("../config/db");

// Import ALL models FIRST
const VaiTro = require("./VaiTro");
const LoaiThuCung = require("./LoaiThuCung");
const GoiThanhToan = require("./GoiThanhToan");
const CuaHang = require("./CuaHang");
const NguoiDung = require("./NguoiDung");
const NguoiDungVaiTro = require("./NguoiDungVaiTro"); // ⭐ NEW
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

console.log("🔗 Defining model associations...");

// ⭐ VaiTro - NguoiDung (MANY-TO-MANY qua bảng trung gian)
NguoiDung.belongsToMany(VaiTro, {
  through: NguoiDungVaiTro,
  foreignKey: "maNguoiDung",
  otherKey: "maVaiTro",
  as: "VaiTros", // Đổi tên để rõ ràng là nhiều vai trò
});

VaiTro.belongsToMany(NguoiDung, {
  through: NguoiDungVaiTro,
  foreignKey: "maVaiTro",
  otherKey: "maNguoiDung",
  as: "NguoiDungs",
});

// CuaHang - NguoiDung
NguoiDung.belongsTo(CuaHang, { foreignKey: "maCuaHang" });
CuaHang.hasMany(NguoiDung, { foreignKey: "maCuaHang" });

CuaHang.belongsTo(NguoiDung, {
  foreignKey: "nguoiDaiDien",
  as: "NguoiDaiDien",
});

// HoSoNhanVien - NguoiDung
HoSoNhanVien.belongsTo(NguoiDung, { foreignKey: "maNguoiDung" });
NguoiDung.hasOne(HoSoNhanVien, { foreignKey: "maNguoiDung" });

// DichVuCuaShop associations
DichVuCuaShop.belongsTo(DichVuHeThong, { foreignKey: "maDichVuHeThong" });
DichVuHeThong.hasMany(DichVuCuaShop, { foreignKey: "maDichVuHeThong" });

DichVuCuaShop.belongsTo(CuaHang, { foreignKey: "maCuaHang" });
CuaHang.hasMany(DichVuCuaShop, { foreignKey: "maCuaHang" });

// DeXuatDichVu associations
DeXuatDichVu.belongsTo(CuaHang, { foreignKey: "maCuaHang" });
CuaHang.hasMany(DeXuatDichVu, { foreignKey: "maCuaHang" });

DeXuatDichVu.belongsTo(NguoiDung, {
  foreignKey: "maQuanTriVien",
  as: "QuanTriVien",
});

// LichHen associations
LichHen.belongsTo(CuaHang, { foreignKey: "maCuaHang" });
CuaHang.hasMany(LichHen, { foreignKey: "maCuaHang" });

LichHen.belongsTo(NguoiDung, { foreignKey: "maKhachHang", as: "KhachHang" });
LichHen.belongsTo(NguoiDung, { foreignKey: "maNhanVien", as: "NhanVien" });

// LichHenThuCung associations
LichHenThuCung.belongsTo(LichHen, { foreignKey: "maLichHen" });
LichHen.hasMany(LichHenThuCung, { foreignKey: "maLichHen" });

LichHenThuCung.belongsTo(LoaiThuCung, { foreignKey: "maLoai" });
LoaiThuCung.hasMany(LichHenThuCung, { foreignKey: "maLoai" });

// LichHenChiTiet associations
LichHenChiTiet.belongsTo(LichHenThuCung, { foreignKey: "maLichHenThuCung" });
LichHenThuCung.hasMany(LichHenChiTiet, { foreignKey: "maLichHenThuCung" });

LichHenChiTiet.belongsTo(DichVuCuaShop, { foreignKey: "maDichVuCuaShop" });
DichVuCuaShop.hasMany(LichHenChiTiet, { foreignKey: "maDichVuCuaShop" });

// GanCaLamViec associations
GanCaLamViec.belongsTo(NguoiDung, { foreignKey: "maNhanVien", as: "NhanVien" });
GanCaLamViec.belongsTo(CuaHang, { foreignKey: "maCuaHang" });
GanCaLamViec.belongsTo(CaLamViec, { foreignKey: "maCa" });

// ThongBao associations
ThongBao.belongsTo(NguoiDung, { foreignKey: "maNguoiDung" });
NguoiDung.hasMany(ThongBao, { foreignKey: "maNguoiDung" });

// ThanhToanShop associations
ThanhToanShop.belongsTo(CuaHang, { foreignKey: "maCuaHang" });
CuaHang.hasMany(ThanhToanShop, { foreignKey: "maCuaHang" });

ThanhToanShop.belongsTo(GoiThanhToan, { foreignKey: "maGoi" });
GoiThanhToan.hasMany(ThanhToanShop, { foreignKey: "maGoi" });

// DanhGia associations
DanhGia.belongsTo(LichHenChiTiet, { foreignKey: "maChiTietLichHen" });
LichHenChiTiet.hasOne(DanhGia, { foreignKey: "maChiTietLichHen" });

console.log("✅ Model associations defined successfully");

// Export
module.exports = {
  sequelize,
  VaiTro,
  LoaiThuCung,
  GoiThanhToan,
  CuaHang,
  NguoiDung,
  NguoiDungVaiTro, // ⭐ NEW
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
