// src/jobs/checkExpiredShops.js
const { CuaHang, ThanhToanShop, NguoiDung } = require("../models");
const { Op } = require("sequelize");
const { sendShopLockedEmail } = require("../services/emailService");

async function checkExpiredShops() {
  console.log("🔍 Checking expired shops...");

  try {
    // Lấy tất cả shop đang HOAT_DONG
    const activeShops = await CuaHang.findAll({
      where: { trangThai: "HOAT_DONG" },
    });

    for (const shop of activeShops) {
      // Kiểm tra có gói còn hạn (DA_THANH_TOAN hoặc TRIAL) không
      const activePackage = await ThanhToanShop.findOne({
        where: {
          maCuaHang: shop.maCuaHang,
          trangThai: {
            [Op.in]: ["DA_THANH_TOAN", "TRIAL"],
          },
          thoiGianKetThuc: {
            [Op.gte]: new Date().toISOString().split("T")[0], // So sánh với ngày hôm nay
          },
        },
        order: [["thoiGianKetThuc", "DESC"]],
      });

      // Nếu không có gói còn hạn → khóa shop
      if (!activePackage) {
        // Lấy email chủ cửa hàng
        const owner = await NguoiDung.findOne({
          where: { maCuaHang: shop.maCuaHang },
        });

        // Cập nhật trạng thái shop thành BI_KHOA
        await shop.update({ trangThai: "BI_KHOA" });
        console.log(`Locked shop: ${shop.tenCuaHang} (ID: ${shop.maCuaHang})`);

        // Gửi email thông báo
        if (owner && owner.email) {
          await sendShopLockedEmail(owner.email, owner.hoTen, shop.tenCuaHang);
          console.log(`📧 Notification email sent to: ${owner.email}`);
        }
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
