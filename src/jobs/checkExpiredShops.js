// src/jobs/checkExpiredShops.js
const { CuaHang, ThanhToanShop } = require("../models");
const { Op } = require("sequelize");

async function checkExpiredShops() {
  console.log("🔍 Checking expired shops...");

  try {
    // Lấy tất cả shop đang HOAT_DONG
    const activeShops = await CuaHang.findAll({
      where: { trangThai: "HOAT_DONG" },
    });

    for (const shop of activeShops) {
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

      // Nếu không có gói còn hạn → khóa shop
      if (!activePackage) {
        await shop.update({ trangThai: "BI_KHOA" });
        console.log(`🔒 Locked shop: ${shop.tenCuaHang} (ID: ${shop.maCuaHang})`);

        // TODO: Gửi email thông báo
      }
    }

    console.log("✅ Check expired shops completed");
  } catch (err) {
    console.error("❌ Error checking expired shops:", err);
  }
}

// Chạy mỗi ngày lúc 00:00
const cron = require("node-cron");

cron.schedule("0 0 * * *", () => {
  checkExpiredShops();
});

module.exports = { checkExpiredShops };
