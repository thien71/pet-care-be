// src/utils/helpers.js

/**
 * Chuyển đổi đường dẫn file thành URL đầy đủ
 * @param {string} filePath - Đường dẫn file tương đối (vd: /uploads/image.jpg)
 * @param {object} req - Express request object
 * @returns {string} - URL đầy đủ
 */
function getFileUrl(filePath, req) {
  if (!filePath) return null;

  // Nếu đã là URL đầy đủ thì return luôn
  if (filePath.startsWith("http")) return filePath;

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}${filePath}`;
}

module.exports = {
  getFileUrl,
};
