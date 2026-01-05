// src/services/bookingService.js
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
  GanCaLamViec,
  CaLamViec,
} = require("../models");
const { Op } = require("sequelize");

class BookingService {
  // ==================== CUSTOMER ====================
  async createBooking(customerId, { maCuaHang, ngayHen, ghiChu, pets }) {
    if (!maCuaHang || !ngayHen || !pets || pets.length === 0) {
      throw new Error("Missing required fields");
    }

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

    let tongTien = 0;

    for (const pet of pets) {
      const lichHenThuCung = await LichHenThuCung.create({
        maLichHen: lichHen.maLichHen,
        maLoai: pet.maLoai,
        ten: pet.ten,
        tuoi: pet.tuoi || null,
        dacDiem: pet.dacDiem || null,
      });

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

    await lichHen.update({ tongTien });
    return lichHen;
  }

  async getMyBookings(customerId) {
    return await LichHen.findAll({
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
  }

  // ==================== SHOP BOOKINGS ====================
  async getShopBookings(userId, trangThai) {
    const user = await NguoiDung.findByPk(userId);
    if (!user || !user.maCuaHang) {
      throw new Error("Shop not found");
    }

    const whereClause = { maCuaHang: user.maCuaHang };
    if (trangThai) {
      whereClause.trangThai = trangThai;
    }

    return await LichHen.findAll({
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
  }

  async confirmBooking(bookingId) {
    const booking = await LichHen.findByPk(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    await booking.update({ trangThai: "DA_XAC_NHAN" });
    return booking;
  }

  async assignTechnician(bookingId, maNhanVien) {
    const booking = await LichHen.findByPk(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    const employee = await NguoiDung.findByPk(maNhanVien, {
      include: [{ model: VaiTro, as: "VaiTros" }],
    });

    const isStaff = employee.VaiTros.some((r) => ["KY_THUAT_VIEN", "LE_TAN"].includes(r.tenVaiTro));

    if (!isStaff) {
      throw new Error("Chỉ được gán cho nhân viên");
    }

    await booking.update({
      maNhanVien,
      trangThai: "DA_XAC_NHAN",
    });

    return booking;
  }

  async updateBookingStatus(bookingId, trangThai) {
    const booking = await LichHen.findByPk(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    await booking.update({ trangThai });
    return booking;
  }

  // ==================== TECHNICIAN ====================
  async getMyAssignments(technicianId) {
    return await LichHen.findAll({
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
  }

  async updateMyAssignment(technicianId, bookingId, trangThai) {
    const booking = await LichHen.findByPk(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.maNhanVien !== technicianId) {
      throw new Error("Not your assignment");
    }

    await booking.update({ trangThai });

    if (trangThai === "HOAN_THANH") {
      await booking.update({
        trangThaiThanhToan: "DA_THANH_TOAN",
        ngayThanhToan: new Date(),
      });
    }

    return booking;
  }

  // ==================== AVAILABLE SLOTS ====================
  async getAvailableSlots(shopId, date) {
    if (!date) {
      throw new Error("Date is required");
    }

    const assignments = await GanCaLamViec.findAll({
      where: {
        maCuaHang: shopId,
        ngayLam: date,
      },
      include: [
        {
          model: NguoiDung,
          as: "NhanVien",
          include: [
            {
              model: VaiTro,
              as: "VaiTros",
              where: { tenVaiTro: "KY_THUAT_VIEN" },
              required: true,
            },
          ],
        },
        {
          model: CaLamViec,
          as: "CaLamViec",
        },
      ],
    });

    const existingBookings = await LichHen.findAll({
      where: {
        maCuaHang: shopId,
        ngayHen: {
          [Op.between]: [new Date(`${date}T00:00:00`), new Date(`${date}T23:59:59`)],
        },
        trangThai: {
          [Op.in]: ["CHO_XAC_NHAN", "DA_XAC_NHAN", "DANG_THUC_HIEN"],
        },
      },
      include: [
        {
          model: LichHenThuCung,
          include: [
            {
              model: LichHenChiTiet,
              include: [
                {
                  model: DichVuCuaShop,
                  include: [{ model: DichVuHeThong }],
                },
              ],
            },
          ],
        },
      ],
    });

    const timeSlots = [];
    for (let hour = 8; hour <= 20; hour++) {
      const timeStr = `${hour.toString().padStart(2, "0")}:00`;

      let availableTechs = 0;
      assignments.forEach((assignment) => {
        const ca = assignment.CaLamViec;
        if (!ca) return;

        const [startHour] = ca.gioBatDau.split(":");
        const [endHour] = ca.gioKetThuc.split(":");

        if (hour >= parseInt(startHour) && hour < parseInt(endHour)) {
          availableTechs++;
        }
      });

      let bookedSlots = 0;
      existingBookings.forEach((booking) => {
        const bookingHour = new Date(booking.ngayHen).getHours();

        let totalDuration = 0;
        booking.LichHenThuCungs?.forEach((pet) => {
          pet.LichHenChiTiets?.forEach((detail) => {
            totalDuration += detail.DichVuCuaShop?.DichVuHeThong?.thoiLuong || 60;
          });
        });

        const durationHours = Math.ceil(totalDuration / 60);

        if (hour >= bookingHour && hour < bookingHour + durationHours) {
          bookedSlots++;
        }
      });

      const availableSlots = Math.max(0, availableTechs - bookedSlots);

      timeSlots.push({
        gioBatDau: timeStr,
        soLuongKTV: availableTechs,
        daDat: bookedSlots,
        conTrong: availableSlots,
        available: availableSlots > 0,
      });
    }

    return { date, slots: timeSlots };
  }
}

module.exports = new BookingService();
