// src/services/staffService.js
const { NguoiDung, VaiTro, NguoiDungVaiTro, HoSoNhanVien, GanCaLamViec, CaLamViec, CuaHang } = require("../models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const emailService = require("./emailService");

// ==================== SCHEDULE ====================
async function getMySchedule(userId) {
  const staff = await NguoiDung.findByPk(userId);
  if (!staff || !staff.maCuaHang) {
    throw new Error("Shop not found");
  }

  return await GanCaLamViec.findAll({
    where: {
      maNhanVien: userId,
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
}

// ==================== EMPLOYEE MANAGEMENT ====================
async function getEmployees(userId) {
  const user = await NguoiDung.findByPk(userId);
  if (!user || !user.maCuaHang) {
    throw new Error("Shop not found");
  }

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

  const filteredEmployees = employees.filter((emp) => emp.maNguoiDung !== shop.nguoiDaiDien);

  return filteredEmployees.map((emp) => {
    const primaryRole = emp.VaiTros && emp.VaiTros.length > 0 ? emp.VaiTros[0] : null;

    return {
      ...emp.toJSON(),
      VaiTro: primaryRole,
    };
  });
}

async function addEmployee(userId, { email, hoTen, soDienThoai, maVaiTro, kinhNghiem, chungChi }) {
  const currentUser = await NguoiDung.findByPk(userId);
  if (!currentUser || !currentUser.maCuaHang) {
    throw new Error("Không tìm thấy cửa hàng");
  }

  const existingUser = await NguoiDung.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email đã tồn tại");
  }

  if (![4, 5].includes(maVaiTro)) {
    throw new Error("Can only add staff roles (LE_TAN, KY_THUAT_VIEN)");
  }

  // ⭐ Tạo token setup password thay vì tự sinh mật khẩu
  const setupToken = crypto.randomBytes(32).toString("hex");
  const setupExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 giờ

  const newEmployee = await NguoiDung.create({
    email,
    hoTen,
    soDienThoai,
    maCuaHang: currentUser.maCuaHang,
    matKhau: null,
    trangThai: 1,
    emailVerified: true,
    resetPasswordToken: setupToken,
    resetPasswordExpires: setupExpires,
    authProvider: "local",
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

  // ⭐ Gửi email setup password
  try {
    await emailService.sendEmployeeSetupEmail(email, hoTen, setupToken);
  } catch (error) {
    console.error("Gửi email setup password thất bại:", error);
    // Không throw error để vẫn tạo được nhân viên
  }

  return newEmployee;
}

async function deleteEmployee(userId, employeeId) {
  const user = await NguoiDung.findByPk(employeeId);
  if (!user) {
    throw new Error("Nhân viên không tồn tại");
  }

  const currentUser = await NguoiDung.findByPk(userId);
  if (user.maCuaHang !== currentUser.maCuaHang) {
    throw new Error("Không phải nhân viên của bạn");
  }

  const shop = await CuaHang.findByPk(currentUser.maCuaHang);
  if (user.maNguoiDung === shop.nguoiDaiDien) {
    throw new Error("Không thể xóa chủ cửa hàng");
  }

  await HoSoNhanVien.destroy({ where: { maNguoiDung: employeeId } });
  await NguoiDungVaiTro.destroy({ where: { maNguoiDung: employeeId } });
  await user.destroy();

  return { message: "Nhân viên đã được xoá" };
}

async function toggleEmployeeStatus(userId, employeeId) {
  const employee = await NguoiDung.findByPk(employeeId);
  if (!employee) {
    throw new Error("Nhân viên không tồn tại");
  }

  const currentUser = await NguoiDung.findByPk(userId);
  if (employee.maCuaHang !== currentUser.maCuaHang) {
    throw new Error("Không phải nhân viên của bạn");
  }

  const shop = await CuaHang.findByPk(currentUser.maCuaHang);
  if (employee.maNguoiDung === shop.nguoiDaiDien) {
    throw new Error("Không thể vô hiệu hóa chủ cửa hàng");
  }

  // Toggle status: 1 = active, 0 = disabled
  const newStatus = employee.trangThai === 1 ? 0 : 1;
  await employee.update({ trangThai: newStatus });

  return {
    message: newStatus === 1 ? "Kích hoạt tài khoản thành công" : "Vô hiệu hóa tài khoản thành công",
    trangThai: newStatus,
  };
}

// ==================== SHIFT MANAGEMENT ====================
async function getShifts(userId) {
  const user = await NguoiDung.findByPk(userId);
  if (!user || !user.maCuaHang) {
    throw new Error("Không tìm thấy cửa hàng");
  }

  return await GanCaLamViec.findAll({
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
}

async function assignShift(userId, { maNhanVien, maCa, ngayLam }) {
  const currentUser = await NguoiDung.findByPk(userId);
  if (!currentUser || !currentUser.maCuaHang) {
    throw new Error("Shop not found");
  }

  const employee = await NguoiDung.findByPk(maNhanVien);
  if (!employee || employee.maCuaHang !== currentUser.maCuaHang) {
    throw new Error("Nhân viên không thuộc cửa hàng của bạn");
  }

  const existing = await GanCaLamViec.findOne({
    where: {
      maNhanVien,
      maCa,
      ngayLam: new Date(ngayLam),
    },
  });

  if (existing) {
    throw new Error("Ca làm việc đã được phân công");
  }

  return await GanCaLamViec.create({
    maNhanVien,
    maCuaHang: currentUser.maCuaHang,
    maCa,
    ngayLam: new Date(ngayLam),
  });
}

async function bulkAssignShifts(userId, assignments) {
  const currentUser = await NguoiDung.findByPk(userId);
  if (!currentUser || !currentUser.maCuaHang) {
    throw new Error("Không tìm thấy cửa hàng");
  }

  for (const assign of assignments) {
    const employee = await NguoiDung.findByPk(assign.maNhanVien);
    if (!employee || employee.maCuaHang !== currentUser.maCuaHang) {
      throw new Error("Nhân viên không thuộc cửa hàng của bạn");
    }
  }

  const created = await GanCaLamViec.bulkCreate(
    assignments.map((a) => ({
      ...a,
      maCuaHang: currentUser.maCuaHang,
      ngayLam: new Date(a.ngayLam),
    })),
    { ignoreDuplicates: true }
  );

  return created;
}

async function removeShift(userId, shiftId) {
  const shift = await GanCaLamViec.findByPk(shiftId);
  if (!shift) {
    throw new Error("Không tìm thấy ca làm việc");
  }

  const user = await NguoiDung.findByPk(userId);
  if (shift.maCuaHang !== user.maCuaHang) {
    throw new Error("Không phải ca làm việc của bạn");
  }

  await shift.destroy();
  return { message: "Ca làm việc đã được xóa" };
}

module.exports = {
  getMySchedule,
  getEmployees,
  addEmployee,
  deleteEmployee,
  toggleEmployeeStatus,
  getShifts,
  assignShift,
  bulkAssignShifts,
  removeShift,
};
