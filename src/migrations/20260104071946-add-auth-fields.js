// src/migrations/20260105000000-add-auth-fields.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Sửa avatar thành TEXT
    await queryInterface.changeColumn("NguoiDung", "avatar", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // 2. Thêm các trường cho Email Verification
    await queryInterface.addColumn("NguoiDung", "emailVerified", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: "Trạng thái xác thực email",
    });

    await queryInterface.addColumn("NguoiDung", "emailVerificationToken", {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "Token xác thực email",
    });

    await queryInterface.addColumn("NguoiDung", "emailVerificationExpires", {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "Thời gian hết hạn token xác thực",
    });

    // 3. Thêm trường cho Google OAuth
    await queryInterface.addColumn("NguoiDung", "googleId", {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true,
      comment: "Google ID cho OAuth login",
    });

    await queryInterface.addColumn("NguoiDung", "authProvider", {
      type: Sequelize.ENUM("local", "google"),
      defaultValue: "local",
      allowNull: false,
      comment: "Phương thức đăng ký: local hoặc google",
    });

    // 4. Thêm các trường cho Reset Password
    await queryInterface.addColumn("NguoiDung", "resetPasswordToken", {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "Token reset mật khẩu",
    });

    await queryInterface.addColumn("NguoiDung", "resetPasswordExpires", {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "Thời gian hết hạn token reset",
    });

    // 5. Cho phép matKhau null (cho Google OAuth users)
    await queryInterface.changeColumn("NguoiDung", "matKhau", {
      type: Sequelize.STRING(255),
      allowNull: true, // Đổi thành true để cho phép Google login không cần password
    });

    // 6. Thêm indexes để tối ưu query
    await queryInterface.addIndex("NguoiDung", ["emailVerificationToken"], {
      name: "idx_email_verification_token",
    });

    await queryInterface.addIndex("NguoiDung", ["resetPasswordToken"], {
      name: "idx_reset_password_token",
    });

    await queryInterface.addIndex("NguoiDung", ["googleId"], {
      name: "idx_google_id",
    });
  },

  async down(queryInterface, Sequelize) {
    // Xóa indexes
    await queryInterface.removeIndex(
      "NguoiDung",
      "idx_email_verification_token"
    );
    await queryInterface.removeIndex("NguoiDung", "idx_reset_password_token");
    await queryInterface.removeIndex("NguoiDung", "idx_google_id");

    // Xóa các cột đã thêm
    await queryInterface.removeColumn("NguoiDung", "emailVerified");
    await queryInterface.removeColumn("NguoiDung", "emailVerificationToken");
    await queryInterface.removeColumn("NguoiDung", "emailVerificationExpires");
    await queryInterface.removeColumn("NguoiDung", "googleId");
    await queryInterface.removeColumn("NguoiDung", "authProvider");
    await queryInterface.removeColumn("NguoiDung", "resetPasswordToken");
    await queryInterface.removeColumn("NguoiDung", "resetPasswordExpires");

    // Đổi lại avatar thành VARCHAR
    await queryInterface.changeColumn("NguoiDung", "avatar", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    // Đổi lại matKhau thành NOT NULL
    await queryInterface.changeColumn("NguoiDung", "matKhau", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },
};
