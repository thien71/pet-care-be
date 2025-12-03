"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "DichVuHeThong",
      {
        maDichVu: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        tenDichVu: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        moTa: {
          type: Sequelize.TEXT,
        },
        thoiLuong: {
          type: Sequelize.INTEGER,
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("DichVuHeThong");
  },
};
