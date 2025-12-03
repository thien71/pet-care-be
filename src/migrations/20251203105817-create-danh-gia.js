"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "DanhGia",
      {
        maDanhGia: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        maChiTietLichHen: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true,
        },
        soSao: {
          type: Sequelize.TINYINT,
          allowNull: false,
        },
        binhLuan: {
          type: Sequelize.TEXT,
        },
        ngayDanhGia: {
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
    await queryInterface.addConstraint("DanhGia", {
      fields: ["maChiTietLichHen"],
      type: "foreign key",
      name: "fk_danh_gia_chi_tiet_lich_hen",
      references: { table: "LichHenChiTiet", field: "maChiTietLichHen" },
      onDelete: "CASCADE",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("DanhGia");
  },
};
