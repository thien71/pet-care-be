"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "CaLamViec",
      {
        maCa: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        tenCa: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        gioBatDau: {
          type: Sequelize.TIME,
          allowNull: false,
        },
        gioKetThuc: {
          type: Sequelize.TIME,
          allowNull: false,
        },
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CaLamViec");
  },
};
