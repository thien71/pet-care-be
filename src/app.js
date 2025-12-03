const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");

console.log("📦 Initializing Express app...");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// TEST ROUTE - để kiểm tra server hoạt động
app.get("/api/test", (req, res) => {
  console.log("✅ Test route hit!");
  res.json({ message: "Server is working!" });
});

console.log("🛣️ Registering routes...");
routes(app);

app.use(errorHandler);

console.log("🔗 Connecting to database...");
const sequelize = require("./config/db");

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connection established");
  })
  .catch((err) => {
    console.error("❌ Database error:", err.message);
    console.error(err.stack);
  });

module.exports = app;
