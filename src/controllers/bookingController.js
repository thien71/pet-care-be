// src/controllers/bookingController.js - KHÔNG CẦN BẢNG MỚI
const {
  LichHen,
  LichHenThuCung,
  LichHenChiTiet,
  DichVuCuaShop,
  DichVuHeThong,
  LoaiThuCung,
  CuaHang,
  NguoiDung,
  VaiTro,
} = require("../models");
const { Op } = require("sequelize");

// ==================== PUBLIC APIs (không cần authentication) ====================

// Lấy danh sách shops đang hoạt động
async function getPublicShops(req, res, next) {
  try {
    const shops = await CuaHang.findAll({
      where: { trangThai: "HOAT_DONG" },
      attributes: [
        "maCuaHang",
        "tenCuaHang",
        "diaChi",
        "soDienThoai",
        "moTa",
        "anhCuaHang",
        "kinhDo",
        "viDo",
      ],
      order: [["tenCuaHang", "ASC"]],
    });

    res.json({ data: shops });
  } catch (err) {
    console.error("❌ Get public shops error:", err);
    next(err);
  }
}

// Lấy danh sách loại thú cưng
async function getPublicPetTypes(req, res, next) {
  try {
    const petTypes = await LoaiThuCung.findAll({
      attributes: ["maLoai", "tenLoai"],
      order: [["maLoai", "ASC"]],
    });

    res.json({ data: petTypes });
  } catch (err) {
    console.error("❌ Get public pet types error:", err);
    next(err);
  }
}

// ⭐ HÀM THÔNG MINH: Lọc dịch vụ theo loài thú cưng
function filterServicesByPetType(services, petTypeName) {
  const lowerPetType = petTypeName.toLowerCase();

  // Mapping từ khóa phổ biến
  const keywordMapping = {
    chó: ["chó", "cún", "dog"],
    mèo: ["mèo", "cat", "kitty"],
    chim: ["chim", "bird"],
    hamster: ["hamster", "chuột"],
    thỏ: ["thỏ", "rabbit"],
    rùa: ["rùa", "turtle"],
  };

  // Lấy keywords cho loài này
  const keywords = keywordMapping[lowerPetType] || [lowerPetType];

  return services.filter((service) => {
    const serviceName = service.DichVuHeThong?.tenDichVu?.toLowerCase() || "";
    const serviceDesc = service.DichVuHeThong?.moTa?.toLowerCase() || "";

    // RULE 1: Nếu tên/mô tả chứa từ khóa loài này → GIỮ LẠI
    const matchesThisPet = keywords.some(
      (keyword) =>
        serviceName.includes(keyword) || serviceDesc.includes(keyword)
    );

    if (matchesThisPet) return true;

    // RULE 2: Nếu tên/mô tả chứa từ khóa loài KHÁC → LOẠI BỎ
    const otherPetTypes = Object.values(keywordMapping).flat();
    const matchesOtherPet = otherPetTypes.some(
      (keyword) =>
        keyword !== lowerPetType &&
        (serviceName.includes(keyword) || serviceDesc.includes(keyword))
    );

    if (matchesOtherPet) return false;

    // RULE 3: Dịch vụ CHUNG (không chứa từ khóa loài nào) → GIỮ LẠI
    return true;
  });
}

// ==================== CUSTOMER APIs ====================

// Lấy danh sách dịch vụ của shop - LỌC THÔNG MINH THEO LOÀI
async function getShopServicesByPetType(req, res, next) {
  try {
    const { shopId, petTypeId } = req.params;

    // Lấy thông tin loài thú cưng
    const petType = await LoaiThuCung.findByPk(petTypeId);
    if (!petType) {
      return res.status(404).json({ message: "Pet type not found" });
    }

    // Lấy tất cả dịch vụ của shop
    const shopServices = await DichVuCuaShop.findAll({
      where: {
        maCuaHang: shopId,
        trangThai: 1,
      },
      include: [
        {
          model: DichVuHeThong,
          attributes: ["maDichVu", "tenDichVu", "moTa", "thoiLuong"],
        },
      ],
    });

    // ⭐ Lọc dịch vụ theo loài bằng logic thông minh
    const filteredServices = filterServicesByPetType(
      shopServices,
      petType.tenLoai
    );

    // Format response
    const formattedServices = filteredServices.map((s) => ({
      maDichVuShop: s.maDichVuShop,
      maDichVuHeThong: s.maDichVuHeThong,
      tenDichVu: s.DichVuHeThong?.tenDichVu,
      moTa: s.DichVuHeThong?.moTa,
      thoiLuong: s.DichVuHeThong?.thoiLuong,
      gia: s.gia,
    }));

    res.json({ data: formattedServices });
  } catch (err) {
    console.error("❌ Get services by pet type error:", err);
    next(err);
  }
}

// Tạo đơn đặt lịch MỚI
async function createBooking(req, res, next) {
  try {
    const customerId = req.user.id;
    const { maCuaHang, ngayHen, ghiChu, pets } = req.body;

    // Validate
    if (!maCuaHang || !ngayHen || !pets || pets.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Tạo Lịch Hẹn chính
    const lichHen = await LichHen.create({
      maCuaHang,
      maKhachHang: customerId,
      ngayHen: new Date(ngayHen),
      trangThai: "CHO_XAC_NHAN",
      ghiChu: ghiChu || null,
      phuongThucThanhToan: "TIEN_MAT",
      trangThaiThanhToan: "CHUA_THANH_TOAN",
      ngayTao: new Date(),
    });

    // Tạo thông tin thú cưng + dịch vụ
    let tongTien = 0;

    for (const pet of pets) {
      // Tạo LichHenThuCung
      const lichHenThuCung = await LichHenThuCung.create({
        maLichHen: lichHen.maLichHen,
        maLoai: pet.maLoai,
        ten: pet.ten,
        tuoi: pet.tuoi || null,
        dacDiem: pet.dacDiem || null,
      });

      // Tạo LichHenChiTiet cho từng dịch vụ
      for (const serviceId of pet.dichVuIds) {
        const dichVu = await DichVuCuaShop.findByPk(serviceId);
        if (!dichVu) continue;

        await LichHenChiTiet.create({
          maLichHenThuCung: lichHenThuCung.maLichHenThuCung,
          maDichVuCuaShop: serviceId,
          gia: dichVu.gia,
        });

        tongTien += parseFloat(dichVu.gia);
      }
    }

    // Cập nhật tổng tiền
    await lichHen.update({ tongTien });

    res.status(201).json({
      message: "Đặt lịch thành công! Chờ cửa hàng xác nhận.",
      data: lichHen,
    });
  } catch (err) {
    console.error("❌ Create booking error:", err);
    next(err);
  }
}

// Lấy lịch sử đặt lịch của khách hàng
async function getMyBookings(req, res, next) {
  try {
    const customerId = req.user.id;

    const bookings = await LichHen.findAll({
      where: { maKhachHang: customerId },
      include: [
        {
          model: CuaHang,
          attributes: ["tenCuaHang", "diaChi", "soDienThoai"],
        },
        {
          model: NguoiDung,
          as: "NhanVien",
          attributes: ["hoTen", "soDienThoai"],
        },
        {
          model: LichHenThuCung,
          include: [
            {
              model: LoaiThuCung,
              attributes: ["tenLoai"],
            },
            {
              model: LichHenChiTiet,
              include: [
                {
                  model: DichVuCuaShop,
                  include: [
                    {
                      model: DichVuHeThong,
                      attributes: ["tenDichVu", "thoiLuong"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      order: [["ngayTao", "DESC"]],
    });

    res.json({ data: bookings });
  } catch (err) {
    console.error("❌ Get my bookings error:", err);
    next(err);
  }
}

// ==================== STAFF/OWNER APIs ====================

// Lấy danh sách đơn hàng của shop
async function getShopBookings(req, res, next) {
  try {
    const user = await NguoiDung.findByPk(req.user.id);
    if (!user || !user.maCuaHang) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const { trangThai } = req.query;
    const whereClause = { maCuaHang: user.maCuaHang };
    if (trangThai) {
      whereClause.trangThai = trangThai;
    }

    const bookings = await LichHen.findAll({
      where: whereClause,
      include: [
        {
          model: NguoiDung,
          as: "KhachHang",
          attributes: ["hoTen", "soDienThoai", "email"],
        },
        {
          model: NguoiDung,
          as: "NhanVien",
          attributes: ["hoTen"],
        },
        {
          model: LichHenThuCung,
          include: [
            {
              model: LoaiThuCung,
              attributes: ["tenLoai"],
            },
            {
              model: LichHenChiTiet,
              include: [
                {
                  model: DichVuCuaShop,
                  include: [
                    {
                      model: DichVuHeThong,
                      attributes: ["tenDichVu"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      order: [["ngayTao", "DESC"]],
    });

    res.json({ data: bookings });
  } catch (err) {
    console.error("❌ Get shop bookings error:", err);
    next(err);
  }
}

// Xác nhận đơn hàng
async function confirmBooking(req, res, next) {
  try {
    const booking = await LichHen.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.update({ trangThai: "DA_XAC_NHAN" });

    res.json({ message: "Xác nhận đơn hàng thành công", data: booking });
  } catch (err) {
    console.error("❌ Confirm booking error:", err);
    next(err);
  }
}

// Gán nhân viên (kỹ thuật viên) cho đơn
async function assignTechnician(req, res, next) {
  try {
    const { maNhanVien } = req.body;
    const booking = await LichHen.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Kiểm tra nhân viên có phải kỹ thuật viên không
    const employee = await NguoiDung.findByPk(maNhanVien, {
      include: [{ model: VaiTro, as: "VaiTros" }],
    });

    const isStaff = employee.VaiTros.some((r) =>
      ["KY_THUAT_VIEN", "LE_TAN"].includes(r.tenVaiTro)
    );

    if (!isStaff) {
      return res.status(400).json({ message: "Chỉ được gán cho nhân viên" });
    }

    await booking.update({
      maNhanVien,
      trangThai: "DA_XAC_NHAN",
    });

    res.json({ message: "Gán nhân viên thành công", data: booking });
  } catch (err) {
    console.error("❌ Assign technician error:", err);
    next(err);
  }
}

// Cập nhật trạng thái đơn hàng
async function updateBookingStatus(req, res, next) {
  try {
    const { trangThai } = req.body;
    const booking = await LichHen.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.update({ trangThai });

    res.json({ message: "Cập nhật trạng thái thành công", data: booking });
  } catch (err) {
    console.error("❌ Update booking status error:", err);
    next(err);
  }
}

// ==================== TECHNICIAN APIs ====================

// Lấy danh sách công việc của kỹ thuật viên
async function getMyAssignments(req, res, next) {
  try {
    const technicianId = req.user.id;

    const assignments = await LichHen.findAll({
      where: {
        maNhanVien: technicianId,
        trangThai: {
          [Op.in]: ["DA_XAC_NHAN", "DANG_THUC_HIEN"],
        },
      },
      include: [
        {
          model: NguoiDung,
          as: "KhachHang",
          attributes: ["hoTen", "soDienThoai"],
        },
        {
          model: CuaHang,
          attributes: ["tenCuaHang"],
        },
        {
          model: LichHenThuCung,
          include: [
            {
              model: LoaiThuCung,
              attributes: ["tenLoai"],
            },
            {
              model: LichHenChiTiet,
              include: [
                {
                  model: DichVuCuaShop,
                  include: [
                    {
                      model: DichVuHeThong,
                      attributes: ["tenDichVu", "thoiLuong"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      order: [["ngayHen", "ASC"]],
    });

    res.json({ data: assignments });
  } catch (err) {
    console.error("❌ Get my assignments error:", err);
    next(err);
  }
}

// Cập nhật trạng thái công việc (bắt đầu/hoàn thành)
async function updateMyAssignment(req, res, next) {
  try {
    const { trangThai } = req.body;
    const booking = await LichHen.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Kiểm tra công việc có phải của mình không
    if (booking.maNhanVien !== req.user.id) {
      return res.status(403).json({ message: "Not your assignment" });
    }

    await booking.update({ trangThai });

    // Nếu hoàn thành → cập nhật trạng thái thanh toán
    if (trangThai === "HOAN_THANH") {
      await booking.update({
        trangThaiThanhToan: "DA_THANH_TOAN",
        ngayThanhToan: new Date(),
      });
    }

    res.json({ message: "Cập nhật thành công", data: booking });
  } catch (err) {
    console.error("❌ Update assignment error:", err);
    next(err);
  }
}

module.exports = {
  // Public
  getPublicShops,
  getPublicPetTypes,

  // Customer
  getShopServicesByPetType,
  createBooking,
  getMyBookings,

  // Staff/Owner
  getShopBookings,
  confirmBooking,
  assignTechnician,
  updateBookingStatus,

  // Technician
  getMyAssignments,
  updateMyAssignment,
};
