// src/services/userService.js
const { NguoiDung, VaiTro, NguoiDungVaiTro, CuaHang } = require("../models");
const bcrypt = require("bcrypt");

// ==================== PROFILE ====================
async function getProfile(userId) {
  const user = await NguoiDung.findByPk(userId, {
    include: [
      {
        model: VaiTro,
        as: "VaiTros",
        through: { attributes: [] },
      },
      {
        model: CuaHang,
        attributes: ["maCuaHang", "tenCuaHang", "trangThai"],
      },
    ],
    attributes: {
      exclude: ["matKhau", "resetPasswordToken", "resetPasswordExpires"],
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

async function updateProfile(userId, { hoTen, soDienThoai, diaChi, avatar }) {
  if (!hoTen || !hoTen.trim()) {
    throw new Error("Họ tên không được để trống");
  }

  if (hoTen.trim().length < 3) {
    throw new Error("Họ tên phải có ít nhất 3 ký tự");
  }

  if (soDienThoai && !/^(0[3|5|7|8|9])+([0-9]{8})$/.test(soDienThoai.trim())) {
    throw new Error("Số điện thoại không hợp lệ");
  }

  const updateData = {
    hoTen: hoTen.trim(),
    soDienThoai: soDienThoai ? soDienThoai.trim() : null,
    diaChi: diaChi ? diaChi.trim() : null,
  };

  if (avatar) {
    updateData.avatar = avatar;
  }

  const user = await NguoiDung.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  await user.update(updateData);

  return await this.getProfile(userId);
}

async function changePassword(userId, { currentPassword, newPassword, confirmPassword }) {
  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error("Vui lòng điền đủ thông tin");
  }

  if (newPassword.length < 6) {
    throw new Error("Mật khẩu mới phải có ít nhất 6 ký tự");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Mật khẩu xác nhận không khớp");
  }

  const user = await NguoiDung.findByPk(userId);
  if (!user || !user.matKhau) {
    throw new Error("User không hợp lệ");
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.matKhau);
  if (!isPasswordValid) {
    throw new Error("Mật khẩu hiện tại không đúng");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await user.update({
    matKhau: hashedPassword,
    resetPasswordToken: null,
    resetPasswordExpires: null,
  });

  return { message: "Đổi mật khẩu thành công" };
}

// ==================== ADMIN - USER MANAGEMENT ====================
async function getAllUsers() {
  const users = await NguoiDung.findAll({
    include: [
      {
        model: VaiTro,
        as: "VaiTros",
        through: { attributes: [] },
        attributes: ["maVaiTro", "tenVaiTro"],
      },
      {
        model: CuaHang,
        attributes: ["tenCuaHang"],
      },
    ],
    attributes: { exclude: ["matKhau"] },
  });

  const formattedUsers = users.map((user) => {
    let primaryRole = null;
    if (user.VaiTros && user.VaiTros.length > 0) {
      const roleOrder = ["QUAN_TRI_VIEN", "CHU_CUA_HANG", "LE_TAN", "KY_THUAT_VIEN", "KHACH_HANG"];
      for (const roleName of roleOrder) {
        const found = user.VaiTros.find((r) => r.tenVaiTro === roleName);
        if (found) {
          primaryRole = found;
          break;
        }
      }
      if (!primaryRole) {
        primaryRole = user.VaiTros[0];
      }
    }

    return {
      ...user.toJSON(),
      VaiTro: primaryRole,
      allRoles: user.VaiTros,
    };
  });

  return formattedUsers;
}

async function getUserById(userId) {
  const user = await NguoiDung.findByPk(userId, {
    include: [
      {
        model: VaiTro,
        as: "VaiTros",
        through: { attributes: [] },
      },
    ],
    attributes: { exclude: ["matKhau"] },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

async function updateUser(userId, { hoTen, soDienThoai, diaChi, vaiTros }) {
  const user = await NguoiDung.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  await user.update({ hoTen, soDienThoai, diaChi });

  if (vaiTros && Array.isArray(vaiTros)) {
    await NguoiDungVaiTro.destroy({
      where: { maNguoiDung: userId },
    });

    const roleAssignments = vaiTros.map((maVaiTro) => ({
      maNguoiDung: user.maNguoiDung,
      maVaiTro,
    }));

    await NguoiDungVaiTro.bulkCreate(roleAssignments);
  }

  return await this.getUserById(userId);
}

async function deleteUser(userId, currentUserId) {
  const user = await NguoiDung.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.maNguoiDung === currentUserId) {
    throw new Error("Cannot delete yourself");
  }

  await user.destroy();
  return { message: "User deleted" };
}

async function addRoleToUser(userId, roleId) {
  const user = await NguoiDung.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const role = await VaiTro.findByPk(roleId);
  if (!role) {
    throw new Error("Role not found");
  }

  const existing = await NguoiDungVaiTro.findOne({
    where: { maNguoiDung: userId, maVaiTro: roleId },
  });

  if (existing) {
    throw new Error("Role already assigned");
  }

  await NguoiDungVaiTro.create({
    maNguoiDung: userId,
    maVaiTro: roleId,
  });

  return { message: "Role added successfully" };
}

async function removeRoleFromUser(userId, roleId) {
  const deleted = await NguoiDungVaiTro.destroy({
    where: { maNguoiDung: userId, maVaiTro: roleId },
  });

  if (deleted === 0) {
    throw new Error("Role assignment not found");
  }

  return { message: "Role removed successfully" };
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  addRoleToUser,
  removeRoleFromUser,
};
