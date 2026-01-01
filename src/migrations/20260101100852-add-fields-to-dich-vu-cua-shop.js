"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm các trường mới vào bảng DichVuCuaShop

    await queryInterface.addColumn("DichVuCuaShop", "hinhAnh", {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "Đường dẫn hình ảnh dịch vụ của shop",
    });

    await queryInterface.addColumn("DichVuCuaShop", "soLanDat", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: "Tổng số lần dịch vụ được đặt (cập nhật qua code BE)",
    });

    await queryInterface.addColumn("DichVuCuaShop", "moTaShop", {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: "Mô tả riêng của shop về dịch vụ",
    });

    await queryInterface.addColumn("DichVuCuaShop", "thoiLuongShop", {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "Thời lượng thực tế shop cung cấp (phút), có thể khác hệ thống",
    });

    await queryInterface.addColumn("DichVuCuaShop", "danhGiaTrungBinh", {
      type: Sequelize.DECIMAL(3, 2),
      defaultValue: 0.0,
      allowNull: false,
      comment: "Điểm đánh giá trung bình 0.00 - 5.00 (cập nhật qua code BE)",
    });

    await queryInterface.addColumn("DichVuCuaShop", "soLuotDanhGia", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: "Tổng số lượt đánh giá dịch vụ (cập nhật qua code BE)",
    });

    // Thêm indexes để tối ưu query
    await queryInterface.addIndex("DichVuCuaShop", ["soLanDat"], {
      name: "idx_dich_vu_cua_shop_so_lan_dat",
    });

    await queryInterface.addIndex("DichVuCuaShop", ["danhGiaTrungBinh"], {
      name: "idx_dich_vu_cua_shop_danh_gia",
    });

    await queryInterface.addIndex("DichVuCuaShop", ["maCuaHang", "soLanDat"], {
      name: "idx_dich_vu_shop_pho_bien",
    });
  },

  async down(queryInterface, Sequelize) {
    // Xóa indexes trước
    await queryInterface.removeIndex(
      "DichVuCuaShop",
      "idx_dich_vu_cua_shop_so_lan_dat"
    );
    await queryInterface.removeIndex(
      "DichVuCuaShop",
      "idx_dich_vu_cua_shop_danh_gia"
    );
    await queryInterface.removeIndex(
      "DichVuCuaShop",
      "idx_dich_vu_shop_pho_bien"
    );

    // Xóa các cột đã thêm
    await queryInterface.removeColumn("DichVuCuaShop", "hinhAnh");
    await queryInterface.removeColumn("DichVuCuaShop", "soLanDat");
    await queryInterface.removeColumn("DichVuCuaShop", "moTaShop");
    await queryInterface.removeColumn("DichVuCuaShop", "thoiLuongShop");
    await queryInterface.removeColumn("DichVuCuaShop", "danhGiaTrungBinh");
    await queryInterface.removeColumn("DichVuCuaShop", "soLuotDanhGia");
  },
};
