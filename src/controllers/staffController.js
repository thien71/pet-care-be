// src/controllers/staffController.js - Controller cho Lễ Tân
const {
  GanCaLamViec,
  NguoiDung,
  LichHen,
  LichHenThuCung,
  LichHenChiTiet,
  DichVuCuaShop,
  DichVuHeThong,
  LoaiThuCung,
  CaLamViec,
  CuaHang,
  VaiTro,
} = require("../models");

// ==================== LỊCH LÀM VIỆC ====================

// Lấy lịch làm việc của Lễ Tân (lấy từ GanCaLamViec)
async function getMySchedule(req, res, next) {
  try {
    const staffId = req.user.id;

    // Lấy thông tin cửa hàng của nhân viên
    const staff = await NguoiDung.findByPk(staffId);
    if (!staff || !staff.maCuaHang) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Lấy lịch làm việc
    const schedule = await GanCaLamViec.findAll({
      where: {
        maNhanVien: staffId,
        maCuaHang: staff.maCuaHang,
      },
      include: [
        {
          model: CaLamViec,
          attributes: ["tenCa", "gioBatDau", "gioKetThuc"],
        },
      ],
      order: [["ngayLam", "ASC"]],
    });

    res.json({ data: schedule });
  } catch (err) {
    console.error("❌ Get schedule error:", err);
    next(err);
  }
}

// ==================== QUẢN LÝ ĐƠN ĐẶT HẸNG ====================

// Lấy danh sách đơn hẹn của cửa hàng
async function getShopBookings(req, res, next) {
  try {
    const staff = await NguoiDung.findByPk(req.user.id);
    if (!staff || !staff.maCuaHang) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const { trangThai } = req.query;
    const whereClause = { maCuaHang: staff.maCuaHang };
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
      order: [["ngayHen", "ASC"]],
    });

    res.json({ data: bookings });
  } catch (err) {
    console.error("❌ Get bookings error:", err);
    next(err);
  }
}

// Xác nhận đơn hẹn
async function confirmBooking(req, res, next) {
  try {
    const booking = await LichHen.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const staff = await NguoiDung.findByPk(req.user.id);
    if (booking.maCuaHang !== staff.maCuaHang) {
      return res.status(403).json({ message: "Not your shop" });
    }

    await booking.update({ trangThai: "DA_XAC_NHAN" });
    res.json({ message: "Booking confirmed", data: booking });
  } catch (err) {
    next(err);
  }
}

// Gán kỹ thuật viên
async function assignTechnician(req, res, next) {
  try {
    const { maNhanVien } = req.body;
    const booking = await LichHen.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const staff = await NguoiDung.findByPk(req.user.id);
    if (booking.maCuaHang !== staff.maCuaHang) {
      return res.status(403).json({ message: "Not your shop" });
    }

    // Kiểm tra KỸ THUẬT VIÊN
    const technician = await NguoiDung.findByPk(maNhanVien, {
      include: [{ model: VaiTro, as: "VaiTros" }],
    });

    const isTechnician = technician.VaiTros.some(
      (r) => r.tenVaiTro === "KY_THUAT_VIEN"
    );

    if (!isTechnician) {
      return res
        .status(400)
        .json({ message: "Chỉ được gán cho Kỹ thuật viên" });
    }

    await booking.update({ maNhanVien });
    res.json({ message: "Technician assigned", data: booking });
  } catch (err) {
    next(err);
  }
}

// Cập nhật trạng thái đơn
async function updateBookingStatus(req, res, next) {
  try {
    const { trangThai } = req.body;
    const booking = await LichHen.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const staff = await NguoiDung.findByPk(req.user.id);
    if (booking.maCuaHang !== staff.maCuaHang) {
      return res.status(403).json({ message: "Not your shop" });
    }

    await booking.update({ trangThai });
    res.json({ message: "Status updated", data: booking });
  } catch (err) {
    next(err);
  }
}

// ==================== KHÁCH HÀNG ====================

// Lấy danh sách khách hàng đã đặt lịch
async function getShopCustomers(req, res, next) {
  try {
    const staff = await NguoiDung.findByPk(req.user.id);
    if (!staff || !staff.maCuaHang) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Lấy khách hàng từ bảng LichHen
    const customers = await LichHen.findAll({
      where: { maCuaHang: staff.maCuaHang },
      attributes: [],
      include: [
        {
          model: NguoiDung,
          as: "KhachHang",
          attributes: [
            "maNguoiDung",
            "hoTen",
            "email",
            "soDienThoai",
            "diaChi",
          ],
          required: true,
        },
      ],
      raw: true,
      subQuery: false,
      group: ["KhachHang.maNguoiDung"],
    });

    // Format response
    const uniqueCustomers = customers.reduce((acc, curr) => {
      const existing = acc.find(
        (c) => c["KhachHang.maNguoiDung"] === curr["KhachHang.maNguoiDung"]
      );
      if (!existing) {
        acc.push(curr);
      }
      return acc;
    }, []);

    res.json({ data: uniqueCustomers });
  } catch (err) {
    console.error("❌ Get customers error:", err);
    next(err);
  }
}

module.exports = {
  getMySchedule,
  getShopBookings,
  confirmBooking,
  assignTechnician,
  updateBookingStatus,
  getShopCustomers,
};
