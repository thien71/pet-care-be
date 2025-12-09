// src/controllers/ownerController.js (FIXED VERSION)
const {
  CuaHang,
  NguoiDung,
  DichVuHeThong,
  DichVuCuaShop,
  HoSoNhanVien,
  GanCaLamViec,
  CaLamViec,
  DeXuatDichVu,
  VaiTro,
  NguoiDungVaiTro,
} = require("../models");
const bcrypt = require("bcrypt");

// ==================== THÔNG TIN CỬA HÀNG ====================
async function getShopInfo(req, res, next) {
  try {
    const user = await NguoiDung.findByPk(req.user.id);
    if (!user || !user.maCuaHang) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const shop = await CuaHang.findByPk(user.maCuaHang);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    res.json({ data: shop });
  } catch (err) {
    next(err);
  }
}

async function updateShopInfo(req, res, next) {
  try {
    const { tenCuaHang, diaChi, soDienThoai, moTa, kinhDo, viDo } = req.body;

    const user = await NguoiDung.findByPk(req.user.id);
    if (!user || !user.maCuaHang) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const shop = await CuaHang.findByPk(user.maCuaHang);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    await shop.update({ tenCuaHang, diaChi, soDienThoai, moTa, kinhDo, viDo });
    res.json({ message: "Shop updated", data: shop });
  } catch (err) {
    next(err);
  }
}

// ==================== DỊCH VỤ HỆ THỐNG ====================
async function getSystemServices(req, res, next) {
  try {
    const services = await DichVuHeThong.findAll({
      where: { trangThai: 1 },
    });
    res.json({ data: services });
  } catch (err) {
    next(err);
  }
}

async function getShopServices(req, res, next) {
  try {
    const user = await NguoiDung.findByPk(req.user.id);
    if (!user || !user.maCuaHang) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const services = await DichVuCuaShop.findAll({
      where: { maCuaHang: user.maCuaHang },
      include: [
        {
          model: DichVuHeThong,
          attributes: ["tenDichVu", "moTa", "thoiLuong"],
        },
      ],
    });

    const formattedServices = services.map((s) => ({
      maDichVuShop: s.maDichVuShop,
      maDichVuHeThong: s.maDichVuHeThong,
      maCuaHang: s.maCuaHang,
      gia: s.gia,
      trangThai: s.trangThai,
      tenDichVu: s.DichVuHeThong?.tenDichVu,
      moTa: s.DichVuHeThong?.moTa,
      thoiLuong: s.DichVuHeThong?.thoiLuong,
    }));

    res.json({ data: formattedServices });
  } catch (err) {
    next(err);
  }
}

async function addServiceToShop(req, res, next) {
  try {
    const { maDichVuHeThong, gia } = req.body;

    const user = await NguoiDung.findByPk(req.user.id);
    if (!user || !user.maCuaHang) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const existing = await DichVuCuaShop.findOne({
      where: {
        maCuaHang: user.maCuaHang,
        maDichVuHeThong,
      },
    });

    if (existing) {
      return res.status(400).json({ message: "Service already added" });
    }

    const service = await DichVuCuaShop.create({
      maDichVuHeThong,
      maCuaHang: user.maCuaHang,
      gia,
      trangThai: 1,
    });

    res.status(201).json({ message: "Service added", data: service });
  } catch (err) {
    next(err);
  }
}

async function updateShopService(req, res, next) {
  try {
    const { gia } = req.body;
    const service = await DichVuCuaShop.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const user = await NguoiDung.findByPk(req.user.id);
    if (service.maCuaHang !== user.maCuaHang) {
      return res.status(403).json({ message: "Not your shop" });
    }

    await service.update({ gia });
    res.json({ message: "Service updated", data: service });
  } catch (err) {
    next(err);
  }
}

async function deleteShopService(req, res, next) {
  try {
    const service = await DichVuCuaShop.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const user = await NguoiDung.findByPk(req.user.id);
    if (service.maCuaHang !== user.maCuaHang) {
      return res.status(403).json({ message: "Not your shop" });
    }

    await service.destroy();
    res.json({ message: "Service deleted" });
  } catch (err) {
    next(err);
  }
}

async function proposeNewService(req, res, next) {
  try {
    const { tenDichVu, moTa, gia } = req.body;

    const user = await NguoiDung.findByPk(req.user.id);
    if (!user || !user.maCuaHang) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const proposal = await DeXuatDichVu.create({
      maCuaHang: user.maCuaHang,
      tenDichVu,
      moTa,
      gia,
      trangThai: "CHO_DUYET",
      ngayGui: new Date(),
    });

    res.status(201).json({ message: "Proposal submitted", data: proposal });
  } catch (err) {
    next(err);
  }
}

// ==================== NHÂN VIÊN ====================
// ⭐ FIX: Lấy danh sách nhân viên KHÔNG BAO GỒM chủ shop
async function getEmployees(req, res, next) {
  try {
    const user = await NguoiDung.findByPk(req.user.id);
    if (!user || !user.maCuaHang) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // ⭐ Lấy thông tin shop để biết người đại diện
    const shop = await CuaHang.findByPk(user.maCuaHang);

    const employees = await NguoiDung.findAll({
      where: {
        maCuaHang: user.maCuaHang,
      },
      include: [
        {
          model: VaiTro,
          as: "VaiTros",
          through: { attributes: [] },
          attributes: ["maVaiTro", "tenVaiTro"],
        },
        {
          model: HoSoNhanVien,
          attributes: ["kinhNghiem", "chungChi", "ngayVaoLam"],
        },
      ],
      attributes: { exclude: ["matKhau"] },
    });

    // ⭐ Loại bỏ chủ shop khỏi danh sách
    const filteredEmployees = employees.filter(
      (emp) => emp.maNguoiDung !== shop.nguoiDaiDien
    );

    // ⭐ Format data để frontend dễ dùng
    const formattedEmployees = filteredEmployees.map((emp) => {
      // Lấy vai trò đầu tiên (staff thường chỉ có 1 vai trò)
      const primaryRole =
        emp.VaiTros && emp.VaiTros.length > 0 ? emp.VaiTros[0] : null;

      return {
        ...emp.toJSON(),
        VaiTro: primaryRole, // ⭐ Thêm field VaiTro (singular) để frontend dễ access
      };
    });

    res.json({ data: formattedEmployees });
  } catch (err) {
    console.error("❌ Get employees error:", err);
    next(err);
  }
}

async function addEmployee(req, res, next) {
  try {
    const { email, hoTen, soDienThoai, maVaiTro, kinhNghiem, chungChi } =
      req.body;

    const currentUser = await NguoiDung.findByPk(req.user.id);
    if (!currentUser || !currentUser.maCuaHang) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const existingUser = await NguoiDung.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Validate role (chỉ cho phép thêm LE_TAN hoặc KY_THUAT_VIEN)
    if (![4, 5].includes(maVaiTro)) {
      return res
        .status(400)
        .json({ message: "Can only add staff roles (LE_TAN, KY_THUAT_VIEN)" });
    }

    const defaultPassword = email.split("@")[0] + "123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newEmployee = await NguoiDung.create({
      email,
      hoTen,
      soDienThoai,
      maCuaHang: currentUser.maCuaHang,
      matKhau: hashedPassword,
      trangThai: 1,
    });

    await NguoiDungVaiTro.create({
      maNguoiDung: newEmployee.maNguoiDung,
      maVaiTro,
    });

    if (kinhNghiem || chungChi) {
      await HoSoNhanVien.create({
        maNguoiDung: newEmployee.maNguoiDung,
        kinhNghiem: kinhNghiem || 0,
        chungChi,
        ngayVaoLam: new Date(),
      });
    }

    res.status(201).json({
      message: "Employee added",
      data: {
        ...newEmployee.dataValues,
        defaultPassword,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function deleteEmployee(req, res, next) {
  try {
    const user = await NguoiDung.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const currentUser = await NguoiDung.findByPk(req.user.id);
    if (user.maCuaHang !== currentUser.maCuaHang) {
      return res.status(403).json({ message: "Not your employee" });
    }

    // ⭐ Kiểm tra không cho xóa chủ shop
    const shop = await CuaHang.findByPk(currentUser.maCuaHang);
    if (user.maNguoiDung === shop.nguoiDaiDien) {
      return res.status(403).json({ message: "Cannot delete shop owner" });
    }

    await HoSoNhanVien.destroy({ where: { maNguoiDung: req.params.id } });
    await NguoiDungVaiTro.destroy({ where: { maNguoiDung: req.params.id } });
    await user.destroy();

    res.json({ message: "Employee deleted" });
  } catch (err) {
    next(err);
  }
}

// ==================== CA LÀM ====================
async function getShifts(req, res, next) {
  try {
    const user = await NguoiDung.findByPk(req.user.id);
    if (!user || !user.maCuaHang) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const shifts = await GanCaLamViec.findAll({
      where: { maCuaHang: user.maCuaHang },
      include: [
        {
          model: NguoiDung,
          as: "NhanVien",
          attributes: ["hoTen"],
        },
        {
          model: CaLamViec,
          attributes: ["tenCa", "gioBatDau", "gioKetThuc"],
        },
      ],
    });

    res.json({ data: shifts });
  } catch (err) {
    next(err);
  }
}

async function assignShift(req, res, next) {
  try {
    const { maNhanVien, maCa, ngayLam } = req.body;

    const currentUser = await NguoiDung.findByPk(req.user.id);
    if (!currentUser || !currentUser.maCuaHang) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const employee = await NguoiDung.findByPk(maNhanVien);
    if (!employee || employee.maCuaHang !== currentUser.maCuaHang) {
      return res.status(403).json({ message: "Employee not in your shop" });
    }

    const existing = await GanCaLamViec.findOne({
      where: {
        maNhanVien,
        maCa,
        ngayLam: new Date(ngayLam),
      },
    });

    if (existing) {
      return res.status(400).json({ message: "Shift already assigned" });
    }

    const shift = await GanCaLamViec.create({
      maNhanVien,
      maCuaHang: currentUser.maCuaHang,
      maCa,
      ngayLam: new Date(ngayLam),
    });

    res.status(201).json({ message: "Shift assigned", data: shift });
  } catch (err) {
    next(err);
  }
}

async function removeShift(req, res, next) {
  try {
    const shift = await GanCaLamViec.findByPk(req.params.id);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    const user = await NguoiDung.findByPk(req.user.id);
    if (shift.maCuaHang !== user.maCuaHang) {
      return res.status(403).json({ message: "Not your shift" });
    }

    await shift.destroy();
    res.json({ message: "Shift removed" });
  } catch (err) {
    next(err);
  }
}

// ==================== THANH TOÁN ====================
async function getPaymentPackages(req, res, next) {
  try {
    const packages = await GoiThanhToan.findAll();
    res.json({ data: packages });
  } catch (err) {
    next(err);
  }
}

async function getMyPayments(req, res, next) {
  try {
    const user = await NguoiDung.findByPk(req.user.id);
    if (!user || !user.maCuaHang) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const payments = await ThanhToanShop.findAll({
      where: { maCuaHang: user.maCuaHang },
      include: [
        {
          model: GoiThanhToan,
          attributes: ["tenGoi", "soTien", "thoiGian"],
        },
      ],
      order: [["ngayTao", "DESC"]],
    });

    res.json({ data: payments });
  } catch (err) {
    next(err);
  }
}

async function purchasePackage(req, res, next) {
  try {
    const { maGoi } = req.body;

    const user = await NguoiDung.findByPk(req.user.id);
    if (!user || !user.maCuaHang) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Check package exists
    const pkg = await GoiThanhToan.findByPk(maGoi);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Tính thời gian
    const thoiGianBatDau = new Date();
    const thoiGianKetThuc = new Date();
    thoiGianKetThuc.setMonth(thoiGianKetThuc.getMonth() + pkg.thoiGian);

    // Tạo thanh toán mới
    const payment = await ThanhToanShop.create({
      maCuaHang: user.maCuaHang,
      maGoi,
      soTien: pkg.soTien,
      thoiGianBatDau,
      thoiGianKetThuc,
      trangThai: "CHUA_THANH_TOAN",
      ngayTao: new Date(),
    });

    res.status(201).json({
      message: "Package registered successfully",
      data: payment,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getShopInfo,
  updateShopInfo,
  getSystemServices,
  getShopServices,
  addServiceToShop,
  updateShopService,
  deleteShopService,
  proposeNewService,
  getEmployees,
  addEmployee,
  deleteEmployee,
  getShifts,
  assignShift,
  removeShift,
  getPaymentPackages,
  getMyPayments,
  purchasePackage,
};
