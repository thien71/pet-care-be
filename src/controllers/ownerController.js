// src/controllers/ownerController.js (COMPLETE VERSION)
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
  NguoiDungVaiTro, // ⭐ THÊM
} = require("../models");
const bcrypt = require("bcrypt");

// ==================== THÔNG TIN CỬA HÀNG ====================
async function getShopInfo(req, res, next) {
  try {
    // ⭐ UPDATED: Tìm shop qua roles
    const user = await NguoiDung.findByPk(req.user.id, {
      include: [
        {
          model: VaiTro,
          as: "VaiTros",
          through: { attributes: [] },
        },
      ],
    });

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

    // Format lại data để frontend dễ sử dụng
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

    // Check xem đã add service này chưa
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

    // Verify ownership
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

    // Verify ownership
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
async function getEmployees(req, res, next) {
  try {
    const user = await NguoiDung.findByPk(req.user.id);
    if (!user || !user.maCuaHang) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const employees = await NguoiDung.findAll({
      where: { maCuaHang: user.maCuaHang },
      include: [
        {
          model: VaiTro,
          as: "VaiTros", // ⭐ UPDATED
          through: { attributes: [] },
        },
        {
          model: HoSoNhanVien,
          attributes: ["kinhNghiem", "chungChi"],
        },
      ],
      attributes: { exclude: ["matKhau"] },
    });

    res.json({ data: employees });
  } catch (err) {
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

    // Check email duplicate
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

    // Create password từ email
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

    // ⭐ Gán vai trò cho nhân viên qua bảng NguoiDungVaiTro
    await NguoiDungVaiTro.create({
      maNguoiDung: newEmployee.maNguoiDung,
      maVaiTro,
    });

    // Create HoSoNhanVien
    if (kinhNghiem || chungChi) {
      await HoSoNhanVien.create({
        maNguoiDung: newEmployee.maNguoiDung,
        kinhNghiem,
        chungChi,
        ngayVaoLam: new Date(),
      });
    }

    res.status(201).json({
      message: "Employee added",
      data: {
        ...newEmployee.dataValues,
        defaultPassword, // Trả về password để owner thông báo cho nhân viên
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

    // Verify ownership
    const currentUser = await NguoiDung.findByPk(req.user.id);
    if (user.maCuaHang !== currentUser.maCuaHang) {
      return res.status(403).json({ message: "Not your employee" });
    }

    // Delete HoSoNhanVien first
    await HoSoNhanVien.destroy({ where: { maNguoiDung: req.params.id } });

    // Delete role assignments
    await NguoiDungVaiTro.destroy({ where: { maNguoiDung: req.params.id } });

    // Then delete user
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

    // Check nhân viên thuộc shop này không
    const employee = await NguoiDung.findByPk(maNhanVien);
    if (!employee || employee.maCuaHang !== currentUser.maCuaHang) {
      return res.status(403).json({ message: "Employee not in your shop" });
    }

    // Check duplicate shift
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

    // Verify ownership
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

// ⭐ CRITICAL: EXPORT TẤT CẢ FUNCTIONS
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
};
