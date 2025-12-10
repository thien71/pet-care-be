// src/migrations/20251203105730-create-gan-ca-lam-viec.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "GanCaLamViec",
      {
        maGanCa: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        maNhanVien: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        maCuaHang: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        maCa: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        ngayLam: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      }
    );

    // Add Foreign Keys
    await queryInterface.addConstraint("GanCaLamViec", {
      fields: ["maNhanVien"],
      type: "foreign key",
      name: "fk_gan_ca_nhan_vien",
      references: { table: "NguoiDung", field: "maNguoiDung" },
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("GanCaLamViec", {
      fields: ["maCuaHang"],
      type: "foreign key",
      name: "fk_gan_ca_cua_hang",
      references: { table: "CuaHang", field: "maCuaHang" },
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("GanCaLamViec", {
      fields: ["maCa"],
      type: "foreign key",
      name: "fk_gan_ca_ca_lam_viec",
      references: { table: "CaLamViec", field: "maCa" },
      onDelete: "CASCADE",
    });

    // Add indexes
    await queryInterface.addIndex("GanCaLamViec", ["maNhanVien", "ngayLam"], {
      name: "idx_gan_ca_nhan_vien_ngay",
    });

    await queryInterface.addIndex("GanCaLamViec", ["maCuaHang", "ngayLam"], {
      name: "idx_gan_ca_cua_hang_ngay",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("GanCaLamViec");
  },
};
