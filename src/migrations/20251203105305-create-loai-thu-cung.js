"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "LoaiThuCung",
      {
        maLoai: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        tenLoai: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true,
        },
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("LoaiThuCung");
  },
};
