// src/middlewares/shopStatusMiddleware.js (UPDATED)
const { NguoiDung, CuaHang, ThanhToanShop } = require("../models");
const { Op } = require("sequelize");

/**
 * Middleware kiểm tra shop có đang active không
 * UPDATED: Hỗ trợ TRIAL period (grace period 7 ngày)
 */
async function checkShopActive(req, res, next) {
  try {
    const userId = req.user.id;

    const user = await NguoiDung.findByPk(userId);
    if (!user || !user.maCuaHang) {
      return res.status(403).json({
        message: "Bạn chưa có cửa hàng",
      });
    }

    const shop = await CuaHang.findByPk(user.maCuaHang);

    // Nếu shop bị khóa → chỉ cho vào /owner/payments
    if (shop.trangThai === "BI_KHOA") {
      return res.status(403).json({
        code: "SHOP_LOCKED",
        message: "Cửa hàng đã bị khóa do chưa thanh toán. Vui lòng thanh toán để tiếp tục.",
        redirectTo: "/owner/payments",
      });
    }

    if (shop.trangThai === "CHO_DUYET") {
      return res.status(403).json({
        code: "SHOP_PENDING",
        message: "Cửa hàng đang chờ duyệt",
      });
    }

    // ⭐ Kiểm tra gói còn hạn (bao gồm TRIAL và DA_THANH_TOAN)
    const activePackage = await ThanhToanShop.findOne({
      where: {
        maCuaHang: shop.maCuaHang,
        trangThai: {
          [Op.in]: ["DA_THANH_TOAN", "TRIAL"], // ⭐ Hỗ trợ TRIAL
        },
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
        message: "Gói dịch vụ đã hết hạn. Vui lòng gia hạn để tiếp tục.",
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
