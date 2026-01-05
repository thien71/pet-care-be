// src/services/paymentService.js
const { GoiThanhToan, ThanhToanShop, CuaHang, NguoiDung } = require("../models");

// ==================== PAYMENT PACKAGES ====================
async function getAllPaymentPackages() {
  return await GoiThanhToan.findAll();
}

async function createPaymentPackage({ tenGoi, soTien, thoiGian }) {
  return await GoiThanhToan.create({ tenGoi, soTien, thoiGian });
}

async function updatePaymentPackage(packageId, { tenGoi, soTien, thoiGian }) {
  const pkg = await GoiThanhToan.findByPk(packageId);
  if (!pkg) {
    throw new Error("Package not found");
  }

  await pkg.update({ tenGoi, soTien, thoiGian });
  return pkg;
}

async function deletePaymentPackage(packageId) {
  const pkg = await GoiThanhToan.findByPk(packageId);
  if (!pkg) {
    throw new Error("Package not found");
  }

  await pkg.destroy();
  return { message: "Package deleted" };
}

// ==================== OWNER - MY PAYMENTS ====================
async function getMyPayments(userId) {
  const user = await NguoiDung.findByPk(userId);
  if (!user || !user.maCuaHang) {
    throw new Error("Shop not found");
  }

  return await ThanhToanShop.findAll({
    where: { maCuaHang: user.maCuaHang },
    include: [
      {
        model: GoiThanhToan,
        attributes: ["tenGoi", "soTien", "thoiGian"],
      },
    ],
    order: [["ngayTao", "DESC"]],
  });
}

async function purchasePackage(userId, maGoi) {
  const user = await NguoiDung.findByPk(userId);
  if (!user || !user.maCuaHang) {
    throw new Error("Shop not found");
  }

  const pkg = await GoiThanhToan.findByPk(maGoi);
  if (!pkg) {
    throw new Error("Package not found");
  }

  const thoiGianBatDau = new Date();
  const thoiGianKetThuc = new Date();
  thoiGianKetThuc.setMonth(thoiGianKetThuc.getMonth() + pkg.thoiGian);

  return await ThanhToanShop.create({
    maCuaHang: user.maCuaHang,
    maGoi,
    soTien: pkg.soTien,
    thoiGianBatDau,
    thoiGianKetThuc,
    trangThai: "CHUA_THANH_TOAN",
    ngayTao: new Date(),
  });
}

// ==================== ADMIN - PAYMENT CONFIRMATIONS ====================
async function getPaymentConfirmations(trangThai) {
  const whereClause = {};
  if (trangThai) {
    whereClause.trangThai = trangThai;
  }

  return await ThanhToanShop.findAll({
    where: whereClause,
    include: [
      { model: CuaHang, attributes: ["tenCuaHang"] },
      { model: GoiThanhToan, attributes: ["tenGoi", "soTien"] },
    ],
    order: [["ngayTao", "DESC"]],
  });
}

async function confirmPayment(paymentId) {
  const payment = await ThanhToanShop.findByPk(paymentId);
  if (!payment) {
    throw new Error("Payment not found");
  }

  await payment.update({ trangThai: "DA_THANH_TOAN" });
  return payment;
}

async function rejectPayment(paymentId) {
  const payment = await ThanhToanShop.findByPk(paymentId);
  if (!payment) {
    throw new Error("Payment not found");
  }

  await payment.update({ trangThai: "CHUA_THANH_TOAN" });
  return payment;
}

module.exports = {
  getAllPaymentPackages,
  createPaymentPackage,
  updatePaymentPackage,
  deletePaymentPackage,
  getMyPayments,
  purchasePackage,
  getPaymentConfirmations,
  confirmPayment,
  rejectPayment,
};
