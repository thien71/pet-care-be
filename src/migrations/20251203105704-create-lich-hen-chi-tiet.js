"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "LichHenChiTiet",
      {
        maChiTietLichHen: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        maLichHenThuCung: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        maDichVuCuaShop: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        gia: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      }
    );

    // Add FK
    await queryInterface.addConstraint("LichHenChiTiet", {
      fields: ["maLichHenThuCung"],
      type: "foreign key",
      name: "fk_lich_hen_chi_tiet_lich_hen_thu_cung",
      references: { table: "LichHenThuCung", field: "maLichHenThuCung" },
      onDelete: "CASCADE",
    });
    await queryInterface.addConstraint("LichHenChiTiet", {
      fields: ["maDichVuCuaShop"],
      type: "foreign key",
      name: "fk_lich_hen_chi_tiet_dich_vu_cua_shop",
      references: { table: "DichVuCuaShop", field: "maDichVuShop" },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("LichHenChiTiet");
  },
};
