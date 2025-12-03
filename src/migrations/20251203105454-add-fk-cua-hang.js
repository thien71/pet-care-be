"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("CuaHang", {
      fields: ["nguoiDaiDien"],
      type: "foreign key",
      name: "fk_cua_hang_nguoi_dai_dien",
      references: { table: "NguoiDung", field: "maNguoiDung" },
      onDelete: "SET NULL",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "CuaHang",
      "fk_cua_hang_nguoi_dai_dien"
    );
  },
};
