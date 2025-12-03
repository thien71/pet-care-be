// src/controllers/customerController.js (Backend)
const { CuaHang, NguoiDung, VaiTro } = require("../models");
const bcrypt = require("bcrypt");

// Đăng ký cửa hàng
async function registerShop(req, res, next) {
  try {
    const { tenCuaHang, diaChi, soDienThoai, moTa, kinhDo, viDo } = req.body;
    const maNguoiDung = req.user.id;

    // Validate text fields
    if (!tenCuaHang || !diaChi || !soDienThoai) {
      return res.status(400).json({ message: "Missing required text fields" });
    }

    // Validate required files (sau multer)
    if (
      !req.files?.giayPhepKD ||
      !req.files?.cccdMatTruoc ||
      !req.files?.cccdMatSau
    ) {
      return res.status(400).json({ message: "Missing required documents" });
    }

    // Check xem user này có shop chưa
    const existingShop = await CuaHang.findOne({
      where: { nguoiDaiDien: maNguoiDung },
    });
    if (existingShop) {
      return res.status(400).json({ message: "You already have a shop" });
    }

    // Tạo cửa hàng
    const shop = await CuaHang.create({
      tenCuaHang,
      diaChi,
      soDienThoai,
      moTa,
      kinhDo,
      viDo,
      nguoiDaiDien: maNguoiDung,
      trangThai: "CHO_DUYET",
      ngayTao: new Date(),
      // Files sẽ được handle bởi upload middleware
      giayPhepKD: req.files.giayPhepKD[0].path || null, // Không cần ?.[0] vì đã validate
      cccdMatTruoc: req.files.cccdMatTruoc[0].path || null,
      cccdMatSau: req.files.cccdMatSau[0].path || null,
      anhCuaHang: req.files.anhCuaHang?.[0]?.path || null,
    });

    // Cập nhật user role thành CHU_CUA_HANG
    const ownerRole = await VaiTro.findOne({
      where: { tenVaiTro: "CHU_CUA_HANG" },
    });

    await NguoiDung.update(
      {
        maVaiTro: ownerRole.maVaiTro,
        maCuaHang: shop.maCuaHang,
      },
      { where: { maNguoiDung } }
    );

    res.status(201).json({
      message: "Shop registered successfully",
      data: shop,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  registerShop,
};
