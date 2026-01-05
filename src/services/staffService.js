// src/services/staffService.js
const { NguoiDung, VaiTro, NguoiDungVaiTro, HoSoNhanVien, GanCaLamViec, CaLamViec, CuaHang } = require("../models");
const bcrypt = require("bcrypt");

class StaffService {
  // ==================== SCHEDULE ====================
  async getMySchedule(userId) {
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
  async getEmployees(userId) {
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

  async addEmployee(userId, { email, hoTen, soDienThoai, maVaiTro, kinhNghiem, chungChi }) {
    const currentUser = await NguoiDung.findByPk(userId);
    if (!currentUser || !currentUser.maCuaHang) {
      throw new Error("Shop not found");
    }

    const existingUser = await NguoiDung.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    if (![4, 5].includes(maVaiTro)) {
      throw new Error("Can only add staff roles (LE_TAN, KY_THUAT_VIEN)");
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

    return {
      ...newEmployee.dataValues,
      defaultPassword,
    };
  }

  async deleteEmployee(userId, employeeId) {
    const user = await NguoiDung.findByPk(employeeId);
    if (!user) {
      throw new Error("Employee not found");
    }

    const currentUser = await NguoiDung.findByPk(userId);
    if (user.maCuaHang !== currentUser.maCuaHang) {
      throw new Error("Not your employee");
    }

    const shop = await CuaHang.findByPk(currentUser.maCuaHang);
    if (user.maNguoiDung === shop.nguoiDaiDien) {
      throw new Error("Cannot delete shop owner");
    }

    await HoSoNhanVien.destroy({ where: { maNguoiDung: employeeId } });
    await NguoiDungVaiTro.destroy({ where: { maNguoiDung: employeeId } });
    await user.destroy();

    return { message: "Employee deleted" };
  }

  // ==================== SHIFT MANAGEMENT ====================
  async getShifts(userId) {
    const user = await NguoiDung.findByPk(userId);
    if (!user || !user.maCuaHang) {
      throw new Error("Shop not found");
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

  async assignShift(userId, { maNhanVien, maCa, ngayLam }) {
    const currentUser = await NguoiDung.findByPk(userId);
    if (!currentUser || !currentUser.maCuaHang) {
      throw new Error("Shop not found");
    }

    const employee = await NguoiDung.findByPk(maNhanVien);
    if (!employee || employee.maCuaHang !== currentUser.maCuaHang) {
      throw new Error("Employee not in your shop");
    }

    const existing = await GanCaLamViec.findOne({
      where: {
        maNhanVien,
        maCa,
        ngayLam: new Date(ngayLam),
      },
    });

    if (existing) {
      throw new Error("Shift already assigned");
    }

    return await GanCaLamViec.create({
      maNhanVien,
      maCuaHang: currentUser.maCuaHang,
      maCa,
      ngayLam: new Date(ngayLam),
    });
  }

  async bulkAssignShifts(userId, assignments) {
    const currentUser = await NguoiDung.findByPk(userId);
    if (!currentUser || !currentUser.maCuaHang) {
      throw new Error("Shop not found");
    }

    for (const assign of assignments) {
      const employee = await NguoiDung.findByPk(assign.maNhanVien);
      if (!employee || employee.maCuaHang !== currentUser.maCuaHang) {
        throw new Error("Employee not in your shop");
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

  async removeShift(userId, shiftId) {
    const shift = await GanCaLamViec.findByPk(shiftId);
    if (!shift) {
      throw new Error("Shift not found");
    }

    const user = await NguoiDung.findByPk(userId);
    if (shift.maCuaHang !== user.maCuaHang) {
      throw new Error("Not your shift");
    }

    await shift.destroy();
    return { message: "Shift removed" };
  }
}

module.exports = new StaffService();
