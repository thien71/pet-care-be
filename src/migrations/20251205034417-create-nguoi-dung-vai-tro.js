// src/migrations/20251203120000-create-nguoi-dung-vai-tro.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Xóa foreign key constraint cũ từ NguoiDung
    await queryInterface.removeConstraint("NguoiDung", "fk_nguoi_dung_vai_tro");

    // 2. Xóa column maVaiTro từ NguoiDung
    await queryInterface.removeColumn("NguoiDung", "maVaiTro");

    // 3. Tạo bảng trung gian NguoiDungVaiTro
    await queryInterface.createTable(
      "NguoiDungVaiTro",
      {
        maNguoiDung: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "NguoiDung",
            key: "maNguoiDung",
          },
          onDelete: "CASCADE",
        },
        maVaiTro: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "VaiTro",
            key: "maVaiTro",
          },
          onDelete: "CASCADE",
        },
        ngayGan: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      }
    );

    // 4. Tạo composite primary key
    await queryInterface.addConstraint("NguoiDungVaiTro", {
      fields: ["maNguoiDung", "maVaiTro"],
      type: "primary key",
      name: "pk_nguoi_dung_vai_tro",
    });

    // 5. Tạo index để tối ưu query
    await queryInterface.addIndex("NguoiDungVaiTro", ["maNguoiDung"], {
      name: "idx_nguoi_dung_vai_tro_nguoi_dung",
    });

    await queryInterface.addIndex("NguoiDungVaiTro", ["maVaiTro"], {
      name: "idx_nguoi_dung_vai_tro_vai_tro",
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop bảng NguoiDungVaiTro
    await queryInterface.dropTable("NguoiDungVaiTro");

    // Thêm lại column maVaiTro vào NguoiDung
    await queryInterface.addColumn("NguoiDung", "maVaiTro", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1, // KHACH_HANG
    });

    // Thêm lại foreign key constraint
    await queryInterface.addConstraint("NguoiDung", {
      fields: ["maVaiTro"],
      type: "foreign key",
      name: "fk_nguoi_dung_vai_tro",
      references: { table: "VaiTro", field: "maVaiTro" },
    });
  },
};
