"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "ThanhToanShop",
      {
        maThanhToan: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        maCuaHang: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        maGoi: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        soTien: {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: false,
        },
        thoiGianBatDau: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        thoiGianKetThuc: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        trangThai: {
          type: Sequelize.ENUM("DA_THANH_TOAN", "CHUA_THANH_TOAN", "QUA_HAN"),
          defaultValue: "CHUA_THANH_TOAN",
        },
        ngayTao: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      }
    );

    // Add FK
    await queryInterface.addConstraint("ThanhToanShop", {
      fields: ["maCuaHang"],
      type: "foreign key",
      name: "fk_thanh_toan_shop_cua_hang",
      references: { table: "CuaHang", field: "maCuaHang" },
    });
    await queryInterface.addConstraint("ThanhToanShop", {
      fields: ["maGoi"],
      type: "foreign key",
      name: "fk_thanh_toan_shop_goi",
      references: { table: "GoiThanhToan", field: "maGoi" },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ThanhToanShop");
  },
};
