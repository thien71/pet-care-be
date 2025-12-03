"use strict";
const bcrypt = require("bcrypt"); // Giả định đã install bcrypt: npm install bcrypt

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert VaiTro
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

    // Insert LoaiThuCung
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

    // Insert GoiThanhToan
    await queryInterface.bulkInsert(
      "GoiThanhToan",
      [
        { tenGoi: "Cơ bản", soTien: 100000.0, thoiGian: 1 },
        { tenGoi: "Nâng cao", soTien: 250000.0, thoiGian: 3 },
        { tenGoi: "VIP", soTien: 500000.0, thoiGian: 6 },
      ],
      {}
    );

    // Insert DichVuHeThong
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

    // Insert CaLamViec
    await queryInterface.bulkInsert(
      "CaLamViec",
      [
        { tenCa: "Ca sáng", gioBatDau: "08:00:00", gioKetThuc: "12:00:00" },
        { tenCa: "Ca chiều", gioBatDau: "13:00:00", gioKetThuc: "17:00:00" },
        { tenCa: "Ca tối", gioBatDau: "18:00:00", gioKetThuc: "22:00:00" },
      ],
      {}
    );

    // Lấy maVaiTro cho từng role
    const [khachHangRole] = await queryInterface.sequelize.query(
      'SELECT maVaiTro FROM VaiTro WHERE tenVaiTro = "KHACH_HANG"'
    );
    const khachHangId = khachHangRole[0].maVaiTro;

    const [adminRole] = await queryInterface.sequelize.query(
      'SELECT maVaiTro FROM VaiTro WHERE tenVaiTro = "QUAN_TRI_VIEN"'
    );
    const adminId = adminRole[0].maVaiTro;

    const [chuCuaHangRole] = await queryInterface.sequelize.query(
      'SELECT maVaiTro FROM VaiTro WHERE tenVaiTro = "CHU_CUA_HANG"'
    );
    const chuCuaHangId = chuCuaHangRole[0].maVaiTro;

    const [leTanRole] = await queryInterface.sequelize.query(
      'SELECT maVaiTro FROM VaiTro WHERE tenVaiTro = "LE_TAN"'
    );
    const leTanId = leTanRole[0].maVaiTro;

    const [kyThuatVienRole] = await queryInterface.sequelize.query(
      'SELECT maVaiTro FROM VaiTro WHERE tenVaiTro = "KY_THUAT_VIEN"'
    );
    const kyThuatVienId = kyThuatVienRole[0].maVaiTro;

    // Hash password mặc định: 'password123'
    const hashedPassword = bcrypt.hashSync("password123", 10);

    // Insert 1 Admin
    await queryInterface.bulkInsert("NguoiDung", [
      {
        hoTen: "Admin User",
        email: "admin@example.com",
        matKhau: hashedPassword,
        soDienThoai: "0123456789",
        diaChi: "Da Nang",
        maVaiTro: adminId,
        trangThai: 1,
      },
    ]);

    // Insert 10 Khách hàng (KHACH_HANG)
    const customers = [];
    for (let i = 1; i <= 10; i++) {
      customers.push({
        hoTen: `Customer ${i}`,
        email: `customer${i}@example.com`,
        matKhau: hashedPassword,
        soDienThoai: `090${i}000000`,
        diaChi: `Address ${i}, Da Nang`,
        maVaiTro: khachHangId,
        trangThai: 1,
      });
    }
    await queryInterface.bulkInsert("NguoiDung", customers);

    // Insert 3 Chủ cửa hàng (CHU_CUA_HANG)
    const owners = [];
    for (let i = 1; i <= 3; i++) {
      owners.push({
        hoTen: `Owner ${i}`,
        email: `owner${i}@example.com`,
        matKhau: hashedPassword,
        soDienThoai: `091${i}000000`,
        diaChi: `Shop Address ${i}`,
        maVaiTro: chuCuaHangId,
        trangThai: 1,
      });
    }
    await queryInterface.bulkInsert("NguoiDung", owners);

    // Insert 3 Lễ tân (LE_TAN)
    const receptionists = [];
    for (let i = 1; i <= 3; i++) {
      receptionists.push({
        hoTen: `Receptionist ${i}`,
        email: `receptionist${i}@example.com`,
        matKhau: hashedPassword,
        soDienThoai: `092${i}000000`,
        diaChi: `Staff Address ${i}`,
        maVaiTro: leTanId,
        trangThai: 1,
      });
    }
    await queryInterface.bulkInsert("NguoiDung", receptionists);

    // Insert 3 Kỹ thuật viên (KY_THUAT_VIEN)
    const technicians = [];
    for (let i = 1; i <= 3; i++) {
      technicians.push({
        hoTen: `Technician ${i}`,
        email: `technician${i}@example.com`,
        matKhau: hashedPassword,
        soDienThoai: `093${i}000000`,
        diaChi: `Staff Address ${i + 3}`,
        maVaiTro: kyThuatVienId,
        trangThai: 1,
      });
    }
    await queryInterface.bulkInsert("NguoiDung", technicians);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("NguoiDung", null, {});
    await queryInterface.bulkDelete("VaiTro", null, {});
    await queryInterface.bulkDelete("LoaiThuCung", null, {});
    await queryInterface.bulkDelete("GoiThanhToan", null, {});
    await queryInterface.bulkDelete("DichVuHeThong", null, {});
    await queryInterface.bulkDelete("CaLamViec", null, {});
  },
};
