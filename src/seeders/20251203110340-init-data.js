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
        { tenLoai: "Hamster" },
        { tenLoai: "Thỏ" },
        { tenLoai: "Rùa" },
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
          tenDichVu: "Tắm rửa cho chó",
          moTa: "Tắm sạch sẽ bằng shampoo dành riêng cho chó, sấy khô",
          thoiLuong: 45,
          trangThai: 1,
        },
        {
          tenDichVu: "Cắt tỉa lông chó",
          moTa: "Cắt tỉa lông thẩm mỹ theo giống chó, giúp thoáng mát",
          thoiLuong: 60,
          trangThai: 1,
        },
        {
          tenDichVu: "Khám răng miệng chó",
          moTa: "Làm sạch răng miệng, ngừa sâu răng cho chó",
          thoiLuong: 50,
          trangThai: 1,
        },
        {
          tenDichVu: "Massage thư giãn cho chó",
          moTa: "Massage giảm stress, cải thiện tuần hoàn cho chó",
          thoiLuong: 40,
          trangThai: 1,
        },
        {
          tenDichVu: "Tắm rửa cho mèo",
          moTa: "Tắm nhẹ nhàng, sử dụng sản phẩm chống dị ứng cho mèo",
          thoiLuong: 40,
          trangThai: 1,
        },
        {
          tenDichVu: "Cắt móng cho mèo",
          moTa: "Cắt và mài móng an toàn, ngừa trầy xước cho mèo",
          thoiLuong: 30,
          trangThai: 1,
        },
        {
          tenDichVu: "Chải lông mèo dài",
          moTa: "Chải loại bỏ lông rụng, ngừa búi lông cho mèo",
          thoiLuong: 50,
          trangThai: 1,
        },
        {
          tenDichVu: "Khám tai mèo",
          moTa: "Làm sạch tai, ngừa viêm tai cho mèo",
          thoiLuong: 35,
          trangThai: 1,
        },
        {
          tenDichVu: "Tắm cát cho hamster",
          moTa: "Tắm cát khô để vệ sinh lông cho hamster, tránh nước",
          thoiLuong: 30,
          trangThai: 1,
        },
        {
          tenDichVu: "Cắt móng hamster",
          moTa: "Cắt móng an toàn để hamster dễ di chuyển",
          thoiLuong: 20,
          trangThai: 1,
        },
        {
          tenDichVu: "Cắt móng cho thỏ",
          moTa: "Cắt móng an toàn, ngừa móng dài gây khó chịu cho thỏ",
          thoiLuong: 30,
          trangThai: 1,
        },
        {
          tenDichVu: "Chải lông thỏ",
          moTa: "Chải và kiểm tra da liễu cho thỏ",
          thoiLuong: 40,
          trangThai: 1,
        },
        {
          tenDichVu: "Khám tai thỏ",
          moTa: "Làm sạch tai, ngừa ve tai cho thỏ",
          thoiLuong: 35,
          trangThai: 1,
        },
        {
          tenDichVu: "Cắt mỏ cho chim",
          moTa: "Cắt và mài mỏ an toàn, giúp chim ăn uống dễ dàng",
          thoiLuong: 30,
          trangThai: 1,
        },
        {
          tenDichVu: "Khám hô hấp chim",
          moTa: "Kiểm tra hệ hô hấp, ngừa bệnh đường hô hấp cho chim",
          thoiLuong: 45,
          trangThai: 1,
        },
        {
          tenDichVu: "Chải lông vũ chim",
          moTa: "Chăm sóc lông vũ, ngừa rụng lông cho chim",
          thoiLuong: 40,
          trangThai: 1,
        },
        {
          tenDichVu: "Kiểm tra vỏ rùa",
          moTa: "Kiểm tra và làm sạch vỏ, ngừa nấm cho rùa cảnh",
          thoiLuong: 45,
          trangThai: 1,
        },
        {
          tenDichVu: "Tắm rửa cho rùa",
          moTa: "Tắm nhẹ nhàng trong nước ấm, vệ sinh cho rùa",
          thoiLuong: 30,
          trangThai: 1,
        },
        {
          tenDichVu: "Cho ăn dinh dưỡng rùa",
          moTa: "Cung cấp chế độ ăn cân bằng, bổ sung vitamin cho rùa",
          thoiLuong: 40,
          trangThai: 1,
        },
        {
          tenDichVu: "Khám sức khỏe định kỳ cho chó",
          moTa: "Khám tổng quát sức khỏe, kiểm tra tim mạch, mắt và tai",
          thoiLuong: 60,
          trangThai: 1,
        },
        {
          tenDichVu: "Tiêm chủng ngừa bệnh cho chó",
          moTa: "Tiêm vaccine phòng ngừa các bệnh phổ biến",
          thoiLuong: 30,
          trangThai: 1,
        },
        {
          tenDichVu: "Huấn luyện chó cơ bản",
          moTa: "Huấn luyện lệnh cơ bản như ngồi, nằm, bắt tay",
          thoiLuong: 120,
          trangThai: 1,
        },
        {
          tenDichVu: "Khám sức khỏe định kỳ cho mèo",
          moTa: "Khám tổng quát sức khỏe, kiểm tra tim mạch, mắt và tai",
          thoiLuong: 60,
          trangThai: 1,
        },
        {
          tenDichVu: "Tiêm chủng ngừa bệnh cho mèo",
          moTa: "Tiêm vaccine phòng ngừa các bệnh phổ biến",
          thoiLuong: 30,
          trangThai: 1,
        },
        {
          tenDichVu: "Khám sức khỏe định kỳ cho hamster",
          moTa: "Khám tổng quát sức khỏe, kiểm tra tim mạch, mắt và tai",
          thoiLuong: 60,
          trangThai: 1,
        },
        {
          tenDichVu: "Tiêm chủng ngừa bệnh cho hamster",
          moTa: "Tiêm vaccine phòng ngừa các bệnh phổ biến",
          thoiLuong: 30,
          trangThai: 1,
        },
        {
          tenDichVu: "Khám sức khỏe định kỳ cho thỏ",
          moTa: "Khám tổng quát sức khỏe, kiểm tra tim mạch, mắt và tai",
          thoiLuong: 60,
          trangThai: 1,
        },
        {
          tenDichVu: "Tiêm chủng ngừa bệnh cho thỏ",
          moTa: "Tiêm vaccine phòng ngừa các bệnh phổ biến",
          thoiLuong: 30,
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
        ('Khách hàng ${i}', 'customer${i}@gmail.com', '${bcrypt.hashSync(
          "password",
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
