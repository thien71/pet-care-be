// src/controllers/bookingController.js
const {
  sequelize,
  CaLamViec,
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

// ⭐ Lấy TẤT CẢ dịch vụ hệ thống (cho trang chủ/danh sách)
async function getPublicServices(req, res, next) {
  try {
    // Lấy tất cả dịch vụ đang hoạt động
    const services = await DichVuHeThong.findAll({
      where: { trangThai: 1 },
      attributes: ["maDichVu", "tenDichVu", "moTa", "thoiLuong"],
      order: [["tenDichVu", "ASC"]],
    });

    // Với mỗi dịch vụ, tính giá trung bình từ các shop
    const servicesWithPrice = await Promise.all(
      services.map(async (service) => {
        const shopServices = await DichVuCuaShop.findAll({
          where: {
            maDichVuHeThong: service.maDichVu,
            trangThai: 1,
          },
          attributes: ["gia"],
        });

        let avgPrice = 0;
        let minPrice = 0;
        let shopCount = shopServices.length;

        if (shopCount > 0) {
          const prices = shopServices.map((s) => parseFloat(s.gia));
          minPrice = Math.min(...prices);
          avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        }

        return {
          maDichVu: service.maDichVu,
          tenDichVu: service.tenDichVu,
          moTa: service.moTa,
          thoiLuong: service.thoiLuong,
          giaThapNhat: minPrice,
          giaTrungBinh: Math.round(avgPrice),
          soLuongShop: shopCount,
        };
      })
    );

    res.json({ data: servicesWithPrice });
  } catch (err) {
    console.error("❌ Get public services error:", err);
    next(err);
  }
}

// ⭐ Lấy CHI TIẾT 1 dịch vụ + danh sách shops cung cấp
async function getServiceDetail(req, res, next) {
  try {
    const { serviceId } = req.params;

    // Lấy thông tin dịch vụ
    const service = await DichVuHeThong.findByPk(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Lấy danh sách shops cung cấp dịch vụ này
    const shopsOffering = await DichVuCuaShop.findAll({
      where: {
        maDichVuHeThong: serviceId,
        trangThai: 1,
      },
      include: [
        {
          model: CuaHang,
          where: { trangThai: "HOAT_DONG" },
          attributes: [
            "maCuaHang",
            "tenCuaHang",
            "diaChi",
            "soDienThoai",
            "anhCuaHang",
            "kinhDo",
            "viDo",
          ],
        },
      ],
      order: [["gia", "ASC"]], // Sắp xếp theo giá tăng dần
    });

    // Format response
    const formattedShops = shopsOffering.map((s) => ({
      maCuaHang: s.CuaHang.maCuaHang,
      tenCuaHang: s.CuaHang.tenCuaHang,
      diaChi: s.CuaHang.diaChi,
      soDienThoai: s.CuaHang.soDienThoai,
      anhCuaHang: s.CuaHang.anhCuaHang,
      kinhDo: s.CuaHang.kinhDo,
      viDo: s.CuaHang.viDo,
      gia: s.gia,
      maDichVuShop: s.maDichVuShop,
    }));

    res.json({
      service: {
        maDichVu: service.maDichVu,
        tenDichVu: service.tenDichVu,
        moTa: service.moTa,
        thoiLuong: service.thoiLuong,
      },
      shops: formattedShops,
    });
  } catch (err) {
    console.error("❌ Get service detail error:", err);
    next(err);
  }
}

// ⭐ Lấy CHI TIẾT 1 shop + danh sách dịch vụ
async function getShopProfile(req, res, next) {
  try {
    const { shopId } = req.params;

    // Lấy thông tin shop
    const shop = await CuaHang.findByPk(shopId, {
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
    });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Lấy danh sách dịch vụ của shop
    const services = await DichVuCuaShop.findAll({
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
      order: [[DichVuHeThong, "tenDichVu", "ASC"]],
    });

    // Format response
    const formattedServices = services.map((s) => ({
      maDichVuShop: s.maDichVuShop,
      maDichVuHeThong: s.maDichVuHeThong,
      tenDichVu: s.DichVuHeThong?.tenDichVu,
      moTa: s.DichVuHeThong?.moTa,
      thoiLuong: s.DichVuHeThong?.thoiLuong,
      gia: s.gia,
    }));

    res.json({
      shop: shop.toJSON(),
      services: formattedServices,
    });
  } catch (err) {
    console.error("❌ Get shop profile error:", err);
    next(err);
  }
}

// ⭐ Lấy top shops nổi bật (optional - dựa trên số lượng đơn hoàn thành)
async function getTopShops(req, res, next) {
  try {
    const { limit = 6 } = req.query;

    // Lấy shops có nhiều đơn hoàn thành nhất
    const topShops = await CuaHang.findAll({
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
      include: [
        {
          model: LichHen,
          attributes: [],
          where: { trangThai: "HOAN_THANH" },
          required: false,
        },
      ],
      group: ["CuaHang.maCuaHang"],
      order: [
        [sequelize.fn("COUNT", sequelize.col("LichHens.maLichHen")), "DESC"],
      ],
      limit: parseInt(limit),
      subQuery: false,
    });

    res.json({ data: topShops });
  } catch (err) {
    console.error("❌ Get top shops error:", err);
    next(err);
  }
}

function removeVietnameseTones(str) {
  if (!str) return "";
  // str = str.toLowerCase();
  // str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  // str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  // str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  // str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  // str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  // str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  // str = str.replace(/đ/g, "d");
  return str;
}

const petMap = {
  cho: ["chó"],
  meo: ["mèo", "meo"],
  chim: ["chim"],
  hamster: ["hamster", "chuot", "chuột"],
  tho: ["thỏ"],
  rua: ["rùa"],
};

const SYNONYMS = {
  // Nhóm 1: Tắm rửa
  tam: ["tam rua", "spa", "lam sach", "ve sinh"],
  rua: ["tam", "tam rua", "spa", "lam sach"],
  "ve sinh": ["tam", "tam rua", "spa", "lam sach", "tam rua cho"],
  spa: ["tam", "tam rua", "lam sach"],
  "tam rua": ["tam", "spa", "lam sach"],
  "lam sach": ["tam", "tam rua", "spa", "ve sinh"],

  // Nhóm 2: Cắt tỉa
  cat: ["cat long", "tia", "grooming"],
  "cat long": ["cat", "tia", "grooming"],
  tia: ["cat", "cat long", "grooming"],
  grooming: ["cat", "cat long", "tia"],

  // Nhóm 3: Khám sức khỏe
  kham: ["kham benh", "check up", "suc khoe", "kham dinh ky"],
  "kham benh": ["kham", "check up"],

  // Nhóm 4: Tiêm chủng
  tiem: ["vaccine", "phong benh", "phong ngua"],
  vaccine: ["tiem", "phong benh"],

  // Nhóm 5: Chải lông
  chai: ["chai long", "lam sach"],
  "chai long": ["chai", "lam sach"],

  // Nhóm 6: Loài thú (để tìm được khi nhập tên khác)
  chuot: ["hamster"], // ✅ THÊM CÁI NÀY để "chuột" tìm được hamster
  hamster: ["chuot"],
};

async function getAllShopServices(req, res, next) {
  try {
    const {
      limit = 20,
      offset = 0,
      search = "",
      sortBy = "relevance",
      petType = "",
    } = req.query;

    const shopServices = await DichVuCuaShop.findAll({
      where: { trangThai: 1 },
      include: [
        {
          model: DichVuHeThong,
          attributes: ["maDichVu", "tenDichVu", "moTa", "thoiLuong"],
        },
        {
          model: CuaHang,
          where: { trangThai: "HOAT_DONG" },
          attributes: [
            "maCuaHang",
            "tenCuaHang",
            "diaChi",
            "soDienThoai",
            "anhCuaHang",
            "kinhDo",
            "viDo",
          ],
        },
      ],
      subQuery: false,
    });

    let filtered = shopServices;

    // ========================================
    // 1️⃣ BỘ LỌC LOÀI (QUY LỰC NHẤT)
    // ========================================
    // Khi user click "Chó", chỉ hiện dịch vụ có chứa "chó" hoặc "cho"
    if (petType) {
      const keywords = petMap[petType.toLowerCase()] || [];
      filtered = filtered.filter((s) => {
        const text = (
          s.DichVuHeThong?.tenDichVu +
          " " +
          s.DichVuHeThong?.moTa
        ).toLowerCase();
        // Kiểm tra xem dịch vụ này có chứa từ nào trong keywords không
        return keywords.some((kw) => text.includes(kw.toLowerCase()));
      });
    }

    // ========================================
    // 2️⃣ TÌM KIẾM (phải match TẤT CẢ từ user nhập)
    // ========================================
    // User nhập "tắm chó" → PHẢI có "tắm" + "chó"
    // User nhập "chuột" → tìm "chuột" hoặc từ đồng nghĩa "hamster"
    if (search && search.trim()) {
      const words = search.trim().toLowerCase().split(/\s+/);

      filtered = filtered.filter((s) => {
        const fullText = (
          s.DichVuHeThong?.tenDichVu +
          " " +
          s.DichVuHeThong?.moTa
        ).toLowerCase();
        const fullTextNoTone = removeVietnameseTones(fullText);

        // PHẢI check tất cả từ mà user nhập
        return words.every((word) => {
          const wordNoTone = removeVietnameseTones(word);

          // ✅ CÁCH 1: Match chính xác (có dấu hoặc không dấu)
          if (fullText.includes(word) || fullText.includes(wordNoTone)) {
            return true;
          }

          // ✅ CÁCH 2: Match không dấu
          if (fullTextNoTone.includes(wordNoTone)) {
            return true;
          }

          // ✅ CÁCH 3: Kiểm tra từ đồng nghĩa
          // Ví dụ: user nhập "vệ sinh" (bỏ dấu = "ve sinh")
          // Hệ thống tìm SYNONYMS["ve sinh"] = ["tam", "tam rua", "spa", "lam sach"]
          // Rồi check xem fullText có chứa từ nào trong danh sách không
          if (SYNONYMS[wordNoTone]) {
            return SYNONYMS[wordNoTone].some((syn) => {
              const synNoTone = removeVietnameseTones(syn);
              return (
                fullText.includes(syn) || fullTextNoTone.includes(synNoTone)
              );
            });
          }

          return false;
        });
      });
    }

    // ========================================
    // 3️⃣ PHÂN TRANG & SORT
    // ========================================
    if (!search && sortBy === "price_asc") {
      filtered.sort((a, b) => parseFloat(a.gia) - parseFloat(b.gia));
    } else if (!search && sortBy === "price_desc") {
      filtered.sort((a, b) => parseFloat(b.gia) - parseFloat(a.gia));
    }

    const total = filtered.length;
    const paginated = filtered.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit)
    );

    const formatted = paginated.map((s) => ({
      maDichVuShop: s.maDichVuShop,
      maDichVuHeThong: s.maDichVuHeThong,
      tenDichVu: s.DichVuHeThong?.tenDichVu,
      moTa: s.DichVuHeThong?.moTa,
      thoiLuong: s.DichVuHeThong?.thoiLuong,
      gia: s.gia,
      maCuaHang: s.CuaHang?.maCuaHang,
      tenCuaHang: s.CuaHang?.tenCuaHang,
      diaChi: s.CuaHang?.diaChi,
      soDienThoai: s.CuaHang?.soDienThoai,
      anhCuaHang: s.CuaHang?.anhCuaHang,
      kinhDo: s.CuaHang?.kinhDo,
      viDo: s.CuaHang?.viDo,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviewCount: Math.floor(Math.random() * 50) + 10,
    }));

    res.json({
      data: formatted,
      total,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("❌ Search error:", err);
    next(err);
  }
}

// ⭐ API Lấy chi tiết 1 dịch vụ của shop cụ thể
async function getShopServiceDetail(req, res, next) {
  try {
    const { shopServiceId } = req.params;

    const shopService = await DichVuCuaShop.findByPk(shopServiceId, {
      include: [
        {
          model: DichVuHeThong,
          attributes: ["maDichVu", "tenDichVu", "moTa", "thoiLuong"],
        },
        {
          model: CuaHang,
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
        },
      ],
    });

    if (!shopService) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Lấy các dịch vụ khác của shop này
    const otherServices = await DichVuCuaShop.findAll({
      where: {
        maCuaHang: shopService.maCuaHang,
        maDichVuShop: { [Op.ne]: shopServiceId },
        trangThai: 1,
      },
      include: [
        {
          model: DichVuHeThong,
          attributes: ["tenDichVu", "thoiLuong"],
        },
      ],
      limit: 6,
    });

    // Mock reviews (sau này tích hợp thật)
    const mockReviews = [
      {
        id: 1,
        userName: "Nguyễn Văn A",
        rating: 5,
        comment: "Dịch vụ tốt, nhân viên nhiệt tình!",
        date: "2024-12-20",
        avatar: null,
      },
      {
        id: 2,
        userName: "Trần Thị B",
        rating: 4,
        comment: "Chất lượng ổn, giá hợp lý",
        date: "2024-12-18",
        avatar: null,
      },
    ];

    const response = {
      maDichVuShop: shopService.maDichVuShop,
      maDichVuHeThong: shopService.maDichVuHeThong,

      // Thông tin dịch vụ
      tenDichVu: shopService.DichVuHeThong?.tenDichVu,
      moTa: shopService.DichVuHeThong?.moTa,
      thoiLuong: shopService.DichVuHeThong?.thoiLuong,
      gia: shopService.gia,

      // Thông tin shop
      shop: {
        maCuaHang: shopService.CuaHang?.maCuaHang,
        tenCuaHang: shopService.CuaHang?.tenCuaHang,
        diaChi: shopService.CuaHang?.diaChi,
        soDienThoai: shopService.CuaHang?.soDienThoai,
        moTa: shopService.CuaHang?.moTa,
        anhCuaHang: shopService.CuaHang?.anhCuaHang,
        kinhDo: shopService.CuaHang?.kinhDo,
        viDo: shopService.CuaHang?.viDo,
      },

      // Dịch vụ khác của shop
      otherServices: otherServices.map((s) => ({
        maDichVuShop: s.maDichVuShop,
        tenDichVu: s.DichVuHeThong?.tenDichVu,
        thoiLuong: s.DichVuHeThong?.thoiLuong,
        gia: s.gia,
      })),

      // Mock data
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviewCount: Math.floor(Math.random() * 50) + 10,
      reviews: mockReviews,
    };

    res.json({ data: response });
  } catch (err) {
    console.error("❌ Get shop service detail error:", err);
    next(err);
  }
}

async function getAvailableSlots(req, res, next) {
  try {
    const { shopId } = req.params;
    const { date } = req.query; // Format: YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // 1. Lấy danh sách nhân viên KTV làm việc trong ngày này
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

    // 2. Lấy các đơn hàng đã đặt trong ngày này
    const existingBookings = await LichHen.findAll({
      where: {
        maCuaHang: shopId,
        ngayHen: {
          [Op.between]: [
            new Date(`${date}T00:00:00`),
            new Date(`${date}T23:59:59`),
          ],
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

    // 3. Tạo danh sách time slots (8h-21h, mỗi slot 1 tiếng)
    const timeSlots = [];
    for (let hour = 8; hour <= 20; hour++) {
      const timeStr = `${hour.toString().padStart(2, "0")}:00`;

      // Đếm số KTV có thể làm trong khung giờ này
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

      // Đếm số đơn đã đặt trong khung giờ này
      let bookedSlots = 0;
      existingBookings.forEach((booking) => {
        const bookingHour = new Date(booking.ngayHen).getHours();

        // Tính thời gian dự kiến cho đơn hàng (tổng thời lượng dịch vụ)
        let totalDuration = 0;
        booking.LichHenThuCungs?.forEach((pet) => {
          pet.LichHenChiTiets?.forEach((detail) => {
            totalDuration +=
              detail.DichVuCuaShop?.DichVuHeThong?.thoiLuong || 60;
          });
        });

        // Làm tròn lên giờ
        const durationHours = Math.ceil(totalDuration / 60);

        // Kiểm tra xem đơn này có chiếm slot này không
        if (hour >= bookingHour && hour < bookingHour + durationHours) {
          bookedSlots++;
        }
      });

      // Slot còn trống = Số KTV - Số đơn đang xử lý
      const availableSlots = Math.max(0, availableTechs - bookedSlots);

      timeSlots.push({
        gioBatDau: timeStr,
        soLuongKTV: availableTechs,
        daDat: bookedSlots,
        conTrong: availableSlots,
        available: availableSlots > 0,
      });
    }

    res.json({ date, slots: timeSlots });
  } catch (err) {
    console.error("❌ Get available slots error:", err);
    next(err);
  }
}

module.exports = {
  // Public
  getPublicShops,
  getPublicPetTypes,
  getPublicServices,
  getServiceDetail,
  getShopProfile,
  getTopShops,
  getAllShopServices,
  getShopServiceDetail,
  getAvailableSlots,

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
