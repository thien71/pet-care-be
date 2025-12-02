const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  logging: false, // Set true để debug
});

module.exports = sequelize;

console.log("DATABASE_URL:", process.env.DATABASE_URL); // Nên in ra string đầy đủ
