// src/controllers/userController.js
const userService = require("../services/userService");

class UserController {
  // ==================== PROFILE ====================
  async getProfile(req, res, next) {
    try {
      const user = await userService.getProfile(req.user.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { hoTen, soDienThoai, diaChi } = req.body;
      const avatar = req.file ? `/uploads/avatars/${req.file.filename}` : null;

      const updatedUser = await userService.updateProfile(req.user.id, {
        hoTen,
        soDienThoai,
        diaChi,
        avatar,
      });

      res.json({
        message: "Cập nhật thông tin thành công",
        data: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }

  async changePassword(req, res, next) {
    try {
      const result = await userService.changePassword(req.user.id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  // ==================== ADMIN ====================
  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json({ data: users });
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json({ data: user });
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);
      res.json({ message: "User updated", data: updatedUser });
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.id, req.user.id);
      res.json({ message: "User deleted" });
    } catch (err) {
      next(err);
    }
  }

  async addRoleToUser(req, res, next) {
    try {
      const { userId, roleId } = req.body;
      const result = await userService.addRoleToUser(userId, roleId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async removeRoleFromUser(req, res, next) {
    try {
      const { userId, roleId } = req.body;
      const result = await userService.removeRoleFromUser(userId, roleId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
