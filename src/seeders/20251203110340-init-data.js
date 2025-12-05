// src/seeders/20251203120000-init-data-many-roles.js
"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Insert VaiTro
    await queryInterface.bulkInsert(
      "VaiTro",
      [
        { tenVaiTro: "KHACH_HANG" },
        { tenVaiTro: "QUAN_TRI_VIEN" },
        { tenVaiTro: "CHU_CUA_HANG" },
        { tenVaiTro: "LE_TAN" },
        { tenVaiTro: "KY_THUAT_VIEN" },
      ],
      {}
    );

    // Query to get maVaiTro for each tenVaiTro
    const vaiTroMap = {};
    const [vaiTroRows] = await queryInterface.sequelize.query(
      "SELECT maVaiTro, tenVaiTro FROM VaiTro"
    );
    vaiTroRows.forEach((row) => {
      vaiTroMap[row.tenVaiTro] = row.maVaiTro;
    });

    // 2. Insert LoaiThuCung
    await queryInterface.bulkInsert(
      "LoaiThuCung",
      [
        { tenLoai: "Chó" },
        { tenLoai: "Mèo" },
        { tenLoai: "Chim" },
        { tenLoai: "Cá" },
        { tenLoai: "Thỏ" },
        { tenLoai: "Bò sát" },
      ],
      {}
    );

    // 3. Insert GoiThanhToan
    await queryInterface.bulkInsert(
      "GoiThanhToan",
      [
        { tenGoi: "Cơ bản", soTien: 100000.0, thoiGian: 1 },
        { tenGoi: "Nâng cao", soTien: 250000.0, thoiGian: 3 },
        { tenGoi: "VIP", soTien: 500000.0, thoiGian: 6 },
      ],
      {}
    );

    // 4. Insert DichVuHeThong
    await queryInterface.bulkInsert(
      "DichVuHeThong",
      [
        {
          tenDichVu: "Tắm rửa",
          moTa: "Dịch vụ tắm rửa cho thú cưng",
          thoiLuong: 30,
          trangThai: 1,
        },
        {
          tenDichVu: "Cắt tỉa lông",
          moTa: "Cắt tỉa lông thẩm mỹ",
          thoiLuong: 45,
          trangThai: 1,
        },
        {
          tenDichVu: "Khám sức khỏe",
          moTa: "Khám bệnh cơ bản",
          thoiLuong: 60,
          trangThai: 1,
        },
        {
          tenDichVu: "Trông giữ",
          moTa: "Gửi thú cưng qua ngày",
          thoiLuong: 1440,
          trangThai: 1,
        },
        {
          tenDichVu: "Huấn luyện",
          moTa: "Huấn luyện cơ bản",
          thoiLuong: 120,
          trangThai: 1,
        },
      ],
      {}
    );

    // 5. Insert CaLamViec
    await queryInterface.bulkInsert(
      "CaLamViec",
      [
        { tenCa: "Ca sáng", gioBatDau: "08:00:00", gioKetThuc: "12:00:00" },
        { tenCa: "Ca chiều", gioBatDau: "13:00:00", gioKetThuc: "17:00:00" },
        { tenCa: "Ca tối", gioBatDau: "18:00:00", gioKetThuc: "22:00:00" },
      ],
      {}
    );

    // Insert Admin
    await queryInterface.sequelize.query(
      `INSERT INTO NguoiDung (hoTen, email, matKhau, soDienThoai, diaChi, trangThai) VALUES 
      ('Admin User', 'admin@petcare.com', '${bcrypt.hashSync(
        "admin123",
        10
      )}', '0900000001', 'Da Nang', 1)`
    );
    const [[{ id: adminId }]] = await queryInterface.sequelize.query(
      "SELECT LAST_INSERT_ID() as id"
    );

    // Insert Customers (3 for minimal)
    const customerIds = [];
    for (let i = 1; i <= 3; i++) {
      await queryInterface.sequelize.query(
        `INSERT INTO NguoiDung (hoTen, email, matKhau, soDienThoai, diaChi, trangThai) VALUES 
        ('Khách hàng ${i}', 'customer${i}@petcare.com', '${bcrypt.hashSync(
          "cust123",
          10
        )}', '090${i.toString().padStart(7, "0")}', 'Địa chỉ ${i}, Đà Nẵng', 1)`
      );
      const [[{ id }]] = await queryInterface.sequelize.query(
        "SELECT LAST_INSERT_ID() as id"
      );
      customerIds.push(id);
    }

    // 6. Insert NguoiDungVaiTro
    const nguoiDungVaiTro = [];

    // Admin: QUAN_TRI_VIEN
    nguoiDungVaiTro.push({
      maNguoiDung: adminId,
      maVaiTro: vaiTroMap["QUAN_TRI_VIEN"],
    });

    // Customers: KHACH_HANG
    customerIds.forEach((id) => {
      nguoiDungVaiTro.push({
        maNguoiDung: id,
        maVaiTro: vaiTroMap["KHACH_HANG"],
      });
    });

    await queryInterface.bulkInsert("NguoiDungVaiTro", nguoiDungVaiTro);

    console.log("✅ Seeded data successfully with minimal roles!");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("NguoiDungVaiTro", null, {});
    await queryInterface.bulkDelete("NguoiDung", null, {});
    await queryInterface.bulkDelete("CaLamViec", null, {});
    await queryInterface.bulkDelete("DichVuHeThong", null, {});
    await queryInterface.bulkDelete("GoiThanhToan", null, {});
    await queryInterface.bulkDelete("LoaiThuCung", null, {});
    await queryInterface.bulkDelete("VaiTro", null, {});
  },
};
