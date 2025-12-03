"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "DeXuatDichVu",
      {
        maDeXuat: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        maCuaHang: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        tenDichVu: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        moTa: {
          type: Sequelize.TEXT,
        },
        gia: {
          type: Sequelize.DECIMAL(10, 2),
        },
        trangThai: {
          type: Sequelize.ENUM("CHO_DUYET", "DA_DUYET", "TU_CHOI"),
          defaultValue: "CHO_DUYET",
        },
        lyDoTuChoi: {
          type: Sequelize.TEXT,
        },
        maQuanTriVien: {
          type: Sequelize.INTEGER,
        },
        ngayGui: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        ngayDuyet: {
          type: Sequelize.DATE,
        },
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      }
    );

    // Add FK
    await queryInterface.addConstraint("DeXuatDichVu", {
      fields: ["maCuaHang"],
      type: "foreign key",
      name: "fk_de_xuat_dich_vu_cua_hang",
      references: { table: "CuaHang", field: "maCuaHang" },
    });
    await queryInterface.addConstraint("DeXuatDichVu", {
      fields: ["maQuanTriVien"],
      type: "foreign key",
      name: "fk_de_xuat_dich_vu_quan_tri_vien",
      references: { table: "NguoiDung", field: "maNguoiDung" },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("DeXuatDichVu");
  },
};
