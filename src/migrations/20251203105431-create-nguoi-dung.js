"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "NguoiDung",
      {
        maNguoiDung: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        hoTen: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(100),
          unique: true,
          allowNull: false,
        },
        matKhau: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        soDienThoai: {
          type: Sequelize.STRING(20),
        },
        diaChi: {
          type: Sequelize.STRING(255),
        },
        avatar: {
          type: Sequelize.STRING(255),
        },
        maVaiTro: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        maCuaHang: {
          type: Sequelize.INTEGER,
        },
        trangThai: {
          type: Sequelize.TINYINT,
          defaultValue: 1,
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
    await queryInterface.addConstraint("NguoiDung", {
      fields: ["maVaiTro"],
      type: "foreign key",
      name: "fk_nguoi_dung_vai_tro",
      references: { table: "VaiTro", field: "maVaiTro" },
    });
    await queryInterface.addConstraint("NguoiDung", {
      fields: ["maCuaHang"],
      type: "foreign key",
      name: "fk_nguoi_dung_cua_hang",
      references: { table: "CuaHang", field: "maCuaHang" },
      onDelete: "SET NULL",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("NguoiDung");
  },
};
