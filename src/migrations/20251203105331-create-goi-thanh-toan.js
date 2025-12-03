"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "GoiThanhToan",
      {
        maGoi: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        tenGoi: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        soTien: {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: false,
        },
        thoiGian: {
          type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("GoiThanhToan");
  },
};
