// src/controllers/userController.js
const { NguoiDung, VaiTro } = require("../models");
const bcrypt = require("bcrypt");

// ==================== GET PROFILE ====================
async function getProfile(req, res, next) {
  try {
    const user = await NguoiDung.findByPk(req.user.id, {
      include: [
        {
          model: VaiTro,
          as: "VaiTros",
          through: { attributes: [] },
        },
      ],
      attributes: {
        exclude: ["matKhau", "resetPasswordToken", "resetPasswordExpires"],
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// ==================== UPDATE PROFILE ====================
async function updateProfile(req, res, next) {
  try {
    const { hoTen, soDienThoai, diaChi } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!hoTen || !hoTen.trim()) {
      return res.status(400).json({ message: "Họ tên không được để trống" });
    }

    if (hoTen.trim().length < 3) {
      return res
        .status(400)
        .json({ message: "Họ tên phải có ít nhất 3 ký tự" });
    }

    // Validate số điện thoại nếu có
    if (
      soDienThoai &&
      !/^(0[3|5|7|8|9])+([0-9]{8})$/.test(soDienThoai.trim())
    ) {
      return res.status(400).json({ message: "Số điện thoại không hợp lệ" });
    }

    // Chuẩn bị data update
    const updateData = {
      hoTen: hoTen.trim(),
      soDienThoai: soDienThoai ? soDienThoai.trim() : null,
      diaChi: diaChi ? diaChi.trim() : null,
    };

    // Nếu có avatar mới (upload file)
    if (req.file) {
      // Lưu path đúng: /uploads/avatars/filename
      updateData.avatar = `/uploads/avatars/${req.file.filename}`;
      console.log("✅ Avatar path saved:", updateData.avatar);
    }

    // Update user
    const user = await NguoiDung.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update(updateData);

    // Fetch updated user with roles
    const updatedUser = await NguoiDung.findByPk(userId, {
      include: [
        {
          model: VaiTro,
          as: "VaiTros",
          through: { attributes: [] },
        },
      ],
      attributes: {
        exclude: ["matKhau", "resetPasswordToken", "resetPasswordExpires"],
      },
    });

    res.json({
      message: "Cập nhật thông tin thành công",
      data: updatedUser,
    });
  } catch (err) {
    console.error("❌ Update profile error:", err);
    next(err);
  }
}

// ==================== CHANGE PASSWORD ====================
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Vui lòng điền đủ thông tin" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu xác nhận không khớp" });
    }

    // Verify current password
    const user = await NguoiDung.findByPk(userId);
    if (!user || !user.matKhau) {
      return res.status(400).json({ message: "User không hợp lệ" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.matKhau);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mật khẩu hiện tại không đúng" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await user.update({
      matKhau: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    console.error("❌ Change password error:", err);
    next(err);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};
