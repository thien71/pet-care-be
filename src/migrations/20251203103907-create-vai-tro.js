"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "VaiTro",
      {
        maVaiTro: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        tenVaiTro: {
          type: Sequelize.STRING(50),
          unique: true,
          allowNull: false,
        },
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      }
    );

    // Chỉ tạo indexes cần thiết
    await queryInterface.addIndex("VaiTro", ["tenVaiTro"], {
      name: "idx_vai_tro_ten",
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("VaiTro");
  },
};
