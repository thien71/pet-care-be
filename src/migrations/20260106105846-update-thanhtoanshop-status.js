"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Thay đổi maGoi thành allowNull: true
    await queryInterface.changeColumn("ThanhToanShop", "maGoi", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    // Thay đổi trangThai để thêm "TRIAL"
    await queryInterface.changeColumn("ThanhToanShop", "trangThai", {
      type: Sequelize.ENUM("TRIAL", "CHUA_THANH_TOAN", "CHO_XAC_NHAN", "DA_THANH_TOAN", "TU_CHOI", "QUA_HAN"),
      defaultValue: "CHUA_THANH_TOAN",
      allowNull: false,
    });
    // Thêm cột mới
    await queryInterface.addColumn("ThanhToanShop", "bienLaiThanhToan", {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "Đường dẫn ảnh biên lai",
    });
    await queryInterface.addColumn("ThanhToanShop", "ghiChu", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("ThanhToanShop", "ngayThanhToan", {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "Ngày chủ shop upload biên lai",
    });
    await queryInterface.addColumn("ThanhToanShop", "ngayXacNhan", {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "Ngày admin xác nhận",
    });
    await queryInterface.addColumn("ThanhToanShop", "nguoiXacNhan", {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "Admin ID",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("ThanhToanShop", "bienLaiThanhToan");
    await queryInterface.removeColumn("ThanhToanShop", "ghiChu");
    await queryInterface.removeColumn("ThanhToanShop", "ngayThanhToan");
    await queryInterface.removeColumn("ThanhToanShop", "ngayXacNhan");
    await queryInterface.removeColumn("ThanhToanShop", "nguoiXacNhan");
    // Revert trangThai về ENUM cũ (xóa "TRIAL" và các giá trị thêm trước)
    await queryInterface.changeColumn("ThanhToanShop", "trangThai", {
      type: Sequelize.ENUM("DA_THANH_TOAN", "CHUA_THANH_TOAN", "QUA_HAN"),
      defaultValue: "CHUA_THANH_TOAN",
    });
    // Revert maGoi về allowNull: false
    await queryInterface.changeColumn("ThanhToanShop", "maGoi", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
