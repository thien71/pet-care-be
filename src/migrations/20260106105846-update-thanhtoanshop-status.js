"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("ThanhToanShop", "trangThai", {
      type: Sequelize.ENUM("CHUA_THANH_TOAN", "CHO_XAC_NHAN", "DA_THANH_TOAN", "TU_CHOI", "QUA_HAN"),
      defaultValue: "CHUA_THANH_TOAN",
      allowNull: false,
    });

    // Thêm cột mới
    await queryInterface.addColumn("ThanhToanShop", "bienLaiThanhToan", {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "Ảnh biên lai chuyển khoản",
    });

    await queryInterface.addColumn("ThanhToanShop", "ghiChu", {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: "Ghi chú từ chủ shop hoặc admin",
    });

    await queryInterface.addColumn("ThanhToanShop", "ngayThanhToan", {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "Ngày chủ shop chuyển khoản",
    });

    await queryInterface.addColumn("ThanhToanShop", "ngayXacNhan", {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "Ngày admin xác nhận",
    });

    await queryInterface.addColumn("ThanhToanShop", "nguoiXacNhan", {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "Admin xác nhận thanh toán",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("ThanhToanShop", "bienLaiThanhToan");
    await queryInterface.removeColumn("ThanhToanShop", "ghiChu");
    await queryInterface.removeColumn("ThanhToanShop", "ngayThanhToan");
    await queryInterface.removeColumn("ThanhToanShop", "ngayXacNhan");
    await queryInterface.removeColumn("ThanhToanShop", "nguoiXacNhan");

    await queryInterface.changeColumn("ThanhToanShop", "trangThai", {
      type: Sequelize.ENUM("DA_THANH_TOAN", "CHUA_THANH_TOAN", "QUA_HAN"),
      defaultValue: "CHUA_THANH_TOAN",
    });
  },
};
