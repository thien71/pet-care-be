const { NguoiDung, VaiTro } = require("../models");

async function getProfile(req, res, next) {
  try {
    const user = await NguoiDung.findByPk(req.user.id, { include: [VaiTro] });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile };
