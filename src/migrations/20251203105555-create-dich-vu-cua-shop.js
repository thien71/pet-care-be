"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "DichVuCuaShop",
      {
        maDichVuShop: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        maDichVuHeThong: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        maCuaHang: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        gia: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        trangThai: {
          type: Sequelize.TINYINT,
          defaultValue: 1,
        },
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      }
    );

    // Add unique key
    await queryInterface.addIndex(
      "DichVuCuaShop",
      ["maCuaHang", "maDichVuHeThong"],
      {
        unique: true,
      }
    );

    // Add FK
    await queryInterface.addConstraint("DichVuCuaShop", {
      fields: ["maDichVuHeThong"],
      type: "foreign key",
      name: "fk_dich_vu_cua_shop_dich_vu_he_thong",
      references: { table: "DichVuHeThong", field: "maDichVu" },
    });
    await queryInterface.addConstraint("DichVuCuaShop", {
      fields: ["maCuaHang"],
      type: "foreign key",
      name: "fk_dich_vu_cua_shop_cua_hang",
      references: { table: "CuaHang", field: "maCuaHang" },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("DichVuCuaShop");
  },
};
