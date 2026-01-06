// src/middlewares/shopStatusMiddleware.js
const { NguoiDung, CuaHang, ThanhToanShop } = require("../models");
const { Op } = require("sequelize");

/**
 * Middleware kiểm tra shop có đang active không
 * Áp dụng cho: Tạo booking, quản lý dịch vụ, nhận đơn...
 */
async function checkShopActive(req, res, next) {
  try {
    const userId = req.user.id;

    // Lấy thông tin user + shop
    const user = await NguoiDung.findByPk(userId);
    if (!user || !user.maCuaHang) {
      return res.status(403).json({
        message: "Bạn chưa có cửa hàng",
      });
    }

    const shop = await CuaHang.findByPk(user.maCuaHang);

    // Kiểm tra shop có bị khóa không
    if (shop.trangThai === "BI_KHOA") {
      return res.status(403).json({
        code: "SHOP_LOCKED",
        message: "Cửa hàng đang bị khóa. Vui lòng thanh toán để kích hoạt lại.",
        redirectTo: "/owner/payments",
      });
    }

    if (shop.trangThai === "CHO_DUYET") {
      return res.status(403).json({
        code: "SHOP_PENDING",
        message: "Cửa hàng đang chờ duyệt",
      });
    }

    // Kiểm tra có gói còn hạn không
    const activePackage = await ThanhToanShop.findOne({
      where: {
        maCuaHang: shop.maCuaHang,
        trangThai: "DA_THANH_TOAN",
        thoiGianKetThuc: {
          [Op.gte]: new Date(),
        },
      },
      order: [["thoiGianKetThuc", "DESC"]],
    });

    if (!activePackage) {
      // Không có gói active → khóa shop
      await shop.update({ trangThai: "BI_KHOA" });

      return res.status(403).json({
        code: "SHOP_EXPIRED",
        message: "Gói dịch vụ đã hết hạn. Vui lòng gia hạn.",
        redirectTo: "/owner/payments",
      });
    }

    // Lưu thông tin shop vào request
    req.shop = shop;
    req.activePackage = activePackage;

    next();
  } catch (err) {
    console.error("checkShopActive error:", err);
    res.status(500).json({ message: "Lỗi kiểm tra trạng thái shop" });
  }
}

module.exports = { checkShopActive };
