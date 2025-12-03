"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "CuaHang",
      {
        maCuaHang: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        tenCuaHang: {
          type: Sequelize.STRING(150),
          allowNull: false,
        },
        diaChi: {
          type: Sequelize.STRING(255),
        },
        soDienThoai: {
          type: Sequelize.STRING(20),
        },
        moTa: {
          type: Sequelize.TEXT,
        },
        nguoiDaiDien: {
          type: Sequelize.INTEGER,
        },
        giayPhepKD: {
          type: Sequelize.STRING(255),
        },
        cccdMatTruoc: {
          type: Sequelize.STRING(255),
        },
        cccdMatSau: {
          type: Sequelize.STRING(255),
        },
        anhCuaHang: {
          type: Sequelize.TEXT,
        },
        kinhDo: {
          type: Sequelize.DECIMAL(10, 6),
        },
        viDo: {
          type: Sequelize.DECIMAL(10, 6),
        },
        trangThai: {
          type: Sequelize.ENUM("CHO_DUYET", "HOAT_DONG", "BI_KHOA"),
          defaultValue: "CHO_DUYET",
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CuaHang");
  },
};
