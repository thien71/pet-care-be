"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "LichHen",
      {
        maLichHen: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        maCuaHang: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        maKhachHang: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        maNhanVien: {
          type: Sequelize.INTEGER,
        },
        ngayHen: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        tongTien: {
          type: Sequelize.DECIMAL(15, 2),
          defaultValue: 0,
        },
        trangThai: {
          type: Sequelize.ENUM(
            "CHO_XAC_NHAN",
            "DA_XAC_NHAN",
            "DANG_THUC_HIEN",
            "HOAN_THANH",
            "HUY"
          ),
          defaultValue: "CHO_XAC_NHAN",
        },
        ghiChu: {
          type: Sequelize.TEXT,
        },
        phuongThucThanhToan: {
          type: Sequelize.ENUM("TIEN_MAT", "CHUYEN_KHOAN", "THE", "KHAC"),
        },
        trangThaiThanhToan: {
          type: Sequelize.ENUM("CHUA_THANH_TOAN", "DA_THANH_TOAN", "HOAN_TIEN"),
          defaultValue: "CHUA_THANH_TOAN",
        },
        ngayThanhToan: {
          type: Sequelize.DATE,
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
    await queryInterface.addConstraint("LichHen", {
      fields: ["maCuaHang"],
      type: "foreign key",
      name: "fk_lich_hen_cua_hang",
      references: { table: "CuaHang", field: "maCuaHang" },
    });
    await queryInterface.addConstraint("LichHen", {
      fields: ["maKhachHang"],
      type: "foreign key",
      name: "fk_lich_hen_khach_hang",
      references: { table: "NguoiDung", field: "maNguoiDung" },
    });
    await queryInterface.addConstraint("LichHen", {
      fields: ["maNhanVien"],
      type: "foreign key",
      name: "fk_lich_hen_nhan_vien",
      references: { table: "NguoiDung", field: "maNguoiDung" },
      onDelete: "SET NULL",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("LichHen");
  },
};
