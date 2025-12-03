"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "HoSoNhanVien",
      {
        maHoSo: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        maNguoiDung: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        kinhNghiem: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        chungChi: {
          type: Sequelize.TEXT,
        },
        ngayVaoLam: {
          type: Sequelize.DATEONLY,
        },
        ghiChu: {
          type: Sequelize.TEXT,
        },
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      }
    );

    // Add FK
    await queryInterface.addConstraint("HoSoNhanVien", {
      fields: ["maNguoiDung"],
      type: "foreign key",
      name: "fk_ho_so_nhan_vien_nguoi_dung",
      references: { table: "NguoiDung", field: "maNguoiDung" },
      onDelete: "CASCADE",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("HoSoNhanVien");
  },
};
