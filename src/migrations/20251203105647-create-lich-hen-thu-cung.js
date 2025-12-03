"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "LichHenThuCung",
      {
        maLichHenThuCung: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        maLichHen: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        maLoai: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        ten: {
          type: Sequelize.STRING(100),
        },
        tuoi: {
          type: Sequelize.INTEGER,
        },
        anhThuCung: {
          type: Sequelize.STRING(255),
        },
        dacDiem: {
          type: Sequelize.TEXT,
        },
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      }
    );

    // Add FK
    await queryInterface.addConstraint("LichHenThuCung", {
      fields: ["maLichHen"],
      type: "foreign key",
      name: "fk_lich_hen_thu_cung_lich_hen",
      references: { table: "LichHen", field: "maLichHen" },
      onDelete: "CASCADE",
    });
    await queryInterface.addConstraint("LichHenThuCung", {
      fields: ["maLoai"],
      type: "foreign key",
      name: "fk_lich_hen_thu_cung_loai",
      references: { table: "LoaiThuCung", field: "maLoai" },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("LichHenThuCung");
  },
};
