const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const sequelize = require("./config/db");

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

// Chỉ giữ 1 sync
sequelize
  .sync({ alter: true })
  .then(() => console.log("All models synced with associations"))
  .catch((err) => console.error("Sync error:", err));

module.exports = app;
