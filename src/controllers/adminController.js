// src/controllers/adminController.js (Backend)
const {
  NguoiDung,
  VaiTro,
  NguoiDungVaiTro,
  LoaiThuCung,
  DichVuHeThong,
  CuaHang,
  DeXuatDichVu,
  GoiThanhToan,
  ThanhToanShop,
} = require("../models");
const bcrypt = require("bcrypt");

// ==================== NGƯỜI DÙNG ====================
async function getUsers(req, res, next) {
  try {
    const users = await NguoiDung.findAll({
      include: [
        {
          model: VaiTro,
          as: "VaiTros", // ⭐ Đổi tên
          through: { attributes: [] },
        },
      ],
      attributes: { exclude: ["matKhau"] },
    });
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await NguoiDung.findByPk(req.params.id, {
      include: [
        {
          model: VaiTro,
          as: "VaiTros",
          through: { attributes: [] },
        },
      ],
      attributes: { exclude: ["matKhau"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
}

/**
 * ⭐ UPDATE USER - Bao gồm cả cập nhật vai trò
 */
async function updateUser(req, res, next) {
  try {
    const { hoTen, soDienThoai, diaChi, vaiTros } = req.body;
    const user = await NguoiDung.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Cập nhật thông tin cơ bản
    await user.update({ hoTen, soDienThoai, diaChi });

    // ⭐ Nếu có update vai trò
    if (vaiTros && Array.isArray(vaiTros)) {
      // Xóa tất cả vai trò cũ
      await NguoiDungVaiTro.destroy({
        where: { maNguoiDung: req.params.id },
      });

      // Thêm vai trò mới
      const roleAssignments = vaiTros.map((maVaiTro) => ({
        maNguoiDung: user.maNguoiDung,
        maVaiTro,
      }));

      await NguoiDungVaiTro.bulkCreate(roleAssignments);
    }

    // Reload user với vai trò mới
    const updatedUser = await NguoiDung.findByPk(req.params.id, {
      include: [
        {
          model: VaiTro,
          as: "VaiTros",
          through: { attributes: [] },
        },
      ],
      attributes: { exclude: ["matKhau"] },
    });

    res.json({ message: "User updated", data: updatedUser });
  } catch (err) {
    next(err);
  }
}

/**
 * ⭐ API MỚI: Thêm vai trò cho user
 */
async function addRoleToUser(req, res, next) {
  try {
    const { userId, roleId } = req.body;

    // Check user exists
    const user = await NguoiDung.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check role exists
    const role = await VaiTro.findByPk(roleId);
    if (!role) return res.status(404).json({ message: "Role not found" });

    // Check if already assigned
    const existing = await NguoiDungVaiTro.findOne({
      where: { maNguoiDung: userId, maVaiTro: roleId },
    });

    if (existing) {
      return res.status(400).json({ message: "Role already assigned" });
    }

    // Assign role
    await NguoiDungVaiTro.create({
      maNguoiDung: userId,
      maVaiTro: roleId,
    });

    res.json({ message: "Role added successfully" });
  } catch (err) {
    next(err);
  }
}

/**
 * ⭐ API MỚI: Xóa vai trò khỏi user
 */
async function removeRoleFromUser(req, res, next) {
  try {
    const { userId, roleId } = req.body;

    const deleted = await NguoiDungVaiTro.destroy({
      where: { maNguoiDung: userId, maVaiTro: roleId },
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Role assignment not found" });
    }

    res.json({ message: "Role removed successfully" });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = await NguoiDung.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
}

// ==================== VAI TRÒ ====================
async function getRoles(req, res, next) {
  try {
    const roles = await VaiTro.findAll();
    res.json({ data: roles });
  } catch (err) {
    next(err);
  }
}

async function createRole(req, res, next) {
  try {
    const { tenVaiTro } = req.body;
    const role = await VaiTro.create({ tenVaiTro });
    res.status(201).json({ message: "Role created", data: role });
  } catch (err) {
    next(err);
  }
}

async function updateRole(req, res, next) {
  try {
    const { tenVaiTro } = req.body;
    const role = await VaiTro.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    await role.update({ tenVaiTro });
    res.json({ message: "Role updated", data: role });
  } catch (err) {
    next(err);
  }
}

async function deleteRole(req, res, next) {
  try {
    const role = await VaiTro.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    await role.destroy();
    res.json({ message: "Role deleted" });
  } catch (err) {
    next(err);
  }
}

// ==================== LOẠI THÚ CƯNG ====================
async function getPetTypes(req, res, next) {
  try {
    const petTypes = await LoaiThuCung.findAll();
    res.json({ data: petTypes });
  } catch (err) {
    next(err);
  }
}

async function createPetType(req, res, next) {
  try {
    const { tenLoai } = req.body;
    const petType = await LoaiThuCung.create({ tenLoai });
    res.status(201).json({ message: "Pet type created", data: petType });
  } catch (err) {
    next(err);
  }
}

async function updatePetType(req, res, next) {
  try {
    const { tenLoai } = req.body;
    const petType = await LoaiThuCung.findByPk(req.params.id);
    if (!petType)
      return res.status(404).json({ message: "Pet type not found" });

    await petType.update({ tenLoai });
    res.json({ message: "Pet type updated", data: petType });
  } catch (err) {
    next(err);
  }
}

async function deletePetType(req, res, next) {
  try {
    const petType = await LoaiThuCung.findByPk(req.params.id);
    if (!petType)
      return res.status(404).json({ message: "Pet type not found" });

    await petType.destroy();
    res.json({ message: "Pet type deleted" });
  } catch (err) {
    next(err);
  }
}

// ==================== DỊCH VỤ HỆ THỐNG ====================
async function getServices(req, res, next) {
  try {
    const services = await DichVuHeThong.findAll();
    res.json({ data: services });
  } catch (err) {
    next(err);
  }
}

async function createService(req, res, next) {
  try {
    const { tenDichVu, moTa, thoiLuong } = req.body;
    const service = await DichVuHeThong.create({
      tenDichVu,
      moTa,
      thoiLuong,
      trangThai: 1,
    });
    res.status(201).json({ message: "Service created", data: service });
  } catch (err) {
    next(err);
  }
}

async function updateService(req, res, next) {
  try {
    const { tenDichVu, moTa, thoiLuong } = req.body;
    const service = await DichVuHeThong.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    await service.update({ tenDichVu, moTa, thoiLuong });
    res.json({ message: "Service updated", data: service });
  } catch (err) {
    next(err);
  }
}

async function deleteService(req, res, next) {
  try {
    const service = await DichVuHeThong.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    await service.destroy();
    res.json({ message: "Service deleted" });
  } catch (err) {
    next(err);
  }
}

// ==================== CỬA HÀNG ====================
async function getShops(req, res, next) {
  try {
    const shops = await CuaHang.findAll({
      include: [
        {
          model: NguoiDung,
          as: "NguoiDaiDien",
          attributes: ["hoTen", "email"],
        },
      ],
    });
    res.json({ data: shops });
  } catch (err) {
    next(err);
  }
}

async function getShopApprovals(req, res, next) {
  try {
    // Giả định trạng thái chờ duyệt là 'CHO_DUYET'. Nếu khác, cần điều chỉnh dựa trên model CuaHang.
    const pendingShops = await CuaHang.findAll({
      where: { trangThai: "CHO_DUYET" },
      include: [
        {
          model: NguoiDung,
          as: "NguoiDaiDien",
          attributes: ["hoTen", "email"],
        },
      ],
    });
    res.json({ data: pendingShops });
  } catch (err) {
    next(err);
  }
}

async function getShopById(req, res, next) {
  try {
    const shop = await CuaHang.findByPk(req.params.id, {
      include: [
        {
          model: NguoiDung,
          as: "NguoiDaiDien",
          attributes: ["hoTen", "email"],
        },
      ],
    });
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    res.json({ data: shop });
  } catch (err) {
    next(err);
  }
}

async function updateShop(req, res, next) {
  try {
    const { tenCuaHang, diaChi, trangThai } = req.body;
    const shop = await CuaHang.findByPk(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    await shop.update({ tenCuaHang, diaChi, trangThai });
    res.json({ message: "Shop updated", data: shop });
  } catch (err) {
    next(err);
  }
}

async function deleteShop(req, res, next) {
  try {
    const shop = await CuaHang.findByPk(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    await shop.destroy();
    res.json({ message: "Shop deleted" });
  } catch (err) {
    next(err);
  }
}

// Duyệt cửa hàng - CẬP NHẬT
async function approveShop(req, res, next) {
  try {
    const shop = await CuaHang.findByPk(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    // 1. Cập nhật trạng thái shop
    await shop.update({
      trangThai: "HOAT_DONG",
    });

    // 2. Cập nhật maCuaHang cho user
    await NguoiDung.update(
      { maCuaHang: shop.maCuaHang },
      { where: { maNguoiDung: shop.nguoiDaiDien } }
    );

    // ⭐ 3. THÊM VAI TRÒ CHU_CUA_HANG cho user (nếu chưa có)
    const existingRole = await NguoiDungVaiTro.findOne({
      where: {
        maNguoiDung: shop.nguoiDaiDien,
        maVaiTro: 3, // CHU_CUA_HANG
      },
    });

    if (!existingRole) {
      await NguoiDungVaiTro.create({
        maNguoiDung: shop.nguoiDaiDien,
        maVaiTro: 3, // CHU_CUA_HANG
      });
      console.log(`✅ Added CHU_CUA_HANG role to user ${shop.nguoiDaiDien}`);
    }

    console.log(
      `✅ Shop ${shop.maCuaHang} approved. User ${shop.nguoiDaiDien} now has KHACH_HANG + CHU_CUA_HANG roles.`
    );

    res.json({ message: "Shop approved successfully", data: shop });
  } catch (err) {
    next(err);
  }
}

// Từ chối cửa hàng
async function rejectShop(req, res, next) {
  try {
    const { lyDo } = req.body;
    const shop = await CuaHang.findByPk(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    // Ghi lại lý do từ chối (có thể lưu vào DB bằng thêm field)
    await shop.update({
      trangThai: "BI_KHOA", // Hoặc tạo status mới "TU_CHOI"
    });

    // TODO: Gửi email thông báo cho owner

    res.json({
      message: "Shop rejected",
      data: shop,
    });
  } catch (err) {
    next(err);
  }
}

// ==================== ĐỀ XUẤT DỊCH VỤ ====================
async function getServiceProposals(req, res, next) {
  try {
    const proposals = await DeXuatDichVu.findAll({
      include: [
        { model: CuaHang, attributes: ["tenCuaHang"] },
        { model: NguoiDung, as: "QuanTriVien", attributes: ["hoTen"] },
      ],
    });
    res.json({ data: proposals });
  } catch (err) {
    next(err);
  }
}

async function approveServiceProposal(req, res, next) {
  try {
    const proposal = await DeXuatDichVu.findByPk(req.params.id);
    if (!proposal)
      return res.status(404).json({ message: "Proposal not found" });

    await proposal.update({
      trangThai: "DA_DUYET",
      maQuanTriVien: req.user.id,
      ngayDuyet: new Date(),
    });
    res.json({ message: "Proposal approved", data: proposal });
  } catch (err) {
    next(err);
  }
}

async function rejectServiceProposal(req, res, next) {
  try {
    const { lyDoTuChoi } = req.body;
    const proposal = await DeXuatDichVu.findByPk(req.params.id);
    if (!proposal)
      return res.status(404).json({ message: "Proposal not found" });

    await proposal.update({
      trangThai: "TU_CHOI",
      lyDoTuChoi,
      maQuanTriVien: req.user.id,
      ngayDuyet: new Date(),
    });
    res.json({ message: "Proposal rejected", data: proposal });
  } catch (err) {
    next(err);
  }
}

// ==================== GÓI THANH TOÁN ====================
async function getPaymentPackages(req, res, next) {
  try {
    const packages = await GoiThanhToan.findAll();
    res.json({ data: packages });
  } catch (err) {
    next(err);
  }
}

async function createPaymentPackage(req, res, next) {
  try {
    const { tenGoi, soTien, thoiGian } = req.body;
    const pkg = await GoiThanhToan.create({ tenGoi, soTien, thoiGian });
    res.status(201).json({ message: "Package created", data: pkg });
  } catch (err) {
    next(err);
  }
}

async function updatePaymentPackage(req, res, next) {
  try {
    const { tenGoi, soTien, thoiGian } = req.body;
    const pkg = await GoiThanhToan.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    await pkg.update({ tenGoi, soTien, thoiGian });
    res.json({ message: "Package updated", data: pkg });
  } catch (err) {
    next(err);
  }
}

async function deletePaymentPackage(req, res, next) {
  try {
    const pkg = await GoiThanhToan.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    await pkg.destroy();
    res.json({ message: "Package deleted" });
  } catch (err) {
    next(err);
  }
}

// ==================== XÁC NHẬN THANH TOÁN ====================
async function getPaymentConfirmations(req, res, next) {
  try {
    const payments = await ThanhToanShop.findAll({
      include: [
        { model: CuaHang, attributes: ["tenCuaHang"] },
        { model: GoiThanhToan, attributes: ["tenGoi", "soTien"] },
      ],
    });
    res.json({ data: payments });
  } catch (err) {
    next(err);
  }
}

async function confirmPayment(req, res, next) {
  try {
    const payment = await ThanhToanShop.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    await payment.update({ trangThai: "DA_THANH_TOAN" });
    res.json({ message: "Payment confirmed", data: payment });
  } catch (err) {
    next(err);
  }
}

async function rejectPayment(req, res, next) {
  try {
    const payment = await ThanhToanShop.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    await payment.update({ trangThai: "CHUA_THANH_TOAN" });
    res.json({ message: "Payment rejected", data: payment });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  // Users
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addRoleToUser,
  removeRoleFromUser,

  // Roles
  getRoles,
  createRole,
  updateRole,
  deleteRole,

  // Pet Types
  getPetTypes,
  createPetType,
  updatePetType,
  deletePetType,

  // Services
  getServices,
  createService,
  updateService,
  deleteService,

  // Shops
  getShops,
  getShopApprovals,
  getShopById,
  updateShop,
  deleteShop,
  approveShop,
  rejectShop,

  // Service Proposals
  getServiceProposals,
  approveServiceProposal,
  rejectServiceProposal,

  // Payment Packages
  getPaymentPackages,
  createPaymentPackage,
  updatePaymentPackage,
  deletePaymentPackage,

  // Payment Confirmations
  getPaymentConfirmations,
  confirmPayment,
  rejectPayment,
};
