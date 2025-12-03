"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "ThongBao",
      {
        maThongBao: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        maNguoiDung: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        tieuDe: {
          type: Sequelize.STRING(255),
        },
        noiDung: {
          type: Sequelize.TEXT,
        },
        loaiThongBao: {
          type: Sequelize.ENUM("DON_HANG", "HE_THONG", "KHAC"),
          defaultValue: "KHAC",
        },
        daXem: {
          type: Sequelize.TINYINT,
          defaultValue: 0,
        },
        ngayGui: {
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
    await queryInterface.addConstraint("ThongBao", {
      fields: ["maNguoiDung"],
      type: "foreign key",
      name: "fk_thong_bao_nguoi_dung",
      references: { table: "NguoiDung", field: "maNguoiDung" },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ThongBao");
  },
};
