// backend/test-email.js
require("dotenv").config();
const emailService = require("./src/services/emailService");

emailService
  .sendVerificationEmail("test@example.com", "test-token-123")
  .then(() => console.log("✅ Email sent successfully"))
  .catch((err) => console.error("❌ Error:", err));
