const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const VaiTro = sequelize.define(
  "VaiTro",
  {
    maVaiTro: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tenVaiTro: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  },
  { tableName: "VaiTro", timestamps: false }
);

module.exports = VaiTro;
