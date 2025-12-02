require("dotenv").config(); // Load .env
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Bảo mật
app.use(morgan("dev")); // Logging
app.use(cors({ origin: "http://localhost:5173" })); // Cho phép FE từ Vite port mặc định
app.use(express.json()); // Parse JSON

// Kết nối MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Route ví dụ
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Route cho API (sẽ thêm sau)
// app.use('/api/users', require('./routes/users')); // Ví dụ

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
