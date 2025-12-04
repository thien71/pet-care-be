// src/controllers/customerController.js
const { CuaHang, NguoiDung, VaiTro } = require("../models");

async function registerShop(req, res, next) {
  try {
    const { tenCuaHang, diaChi, soDienThoai, moTa, kinhDo, viDo } = req.body;
    const maNguoiDung = req.user.id;

    console.log("📝 Shop registration data:", {
      tenCuaHang,
      diaChi,
      soDienThoai,
    });
    console.log("📎 Uploaded files:", req.files);

    // Validate
    if (!tenCuaHang || !diaChi || !soDienThoai) {
      return res.status(400).json({ message: "Missing required text fields" });
    }

    if (
      !req.files?.giayPhepKD ||
      !req.files?.cccdMatTruoc ||
      !req.files?.cccdMatSau
    ) {
      return res.status(400).json({ message: "Missing required documents" });
    }

    // Check existing shop
    const existingShop = await CuaHang.findOne({
      where: { nguoiDaiDien: maNguoiDung },
    });
    if (existingShop) {
      return res.status(400).json({ message: "You already have a shop" });
    }

    const shopData = {
      tenCuaHang,
      diaChi,
      soDienThoai,
      moTa: moTa || null,
      kinhDo: kinhDo || null,
      viDo: viDo || null,
      nguoiDaiDien: maNguoiDung,
      trangThai: "CHO_DUYET",
      ngayTao: new Date(),
      giayPhepKD: `/uploads/${req.files.giayPhepKD[0].filename}`,
      cccdMatTruoc: `/uploads/${req.files.cccdMatTruoc[0].filename}`,
      cccdMatSau: `/uploads/${req.files.cccdMatSau[0].filename}`,
      anhCuaHang: req.files.anhCuaHang?.[0]?.filename
        ? `/uploads/${req.files.anhCuaHang[0].filename}`
        : null,
    };

    console.log("💾 Saving shop with data:", shopData);

    const shop = await CuaHang.create(shopData);

    // ⭐ QUAN TRỌNG: KHÔNG đổi role, chỉ cập nhật maCuaHang
    // Người dùng vẫn giữ role KHACH_HANG nhưng có maCuaHang
    // Khi shop được duyệt, admin sẽ update maCuaHang cho user

    console.log("✅ Shop registered successfully:", shop.maCuaHang);

    res.status(201).json({
      message: "Shop registered successfully. Waiting for approval.",
      data: shop,
    });
  } catch (err) {
    console.error("❌ Register shop error:", err);
    next(err);
  }
}

module.exports = {
  registerShop,
};
