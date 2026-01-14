// src/services/paymentService.js
const { GoiThanhToan, ThanhToanShop, CuaHang, NguoiDung } = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const emailService = require("./emailService");

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

async function purchasePackage(userId, { maGoi, bienLai }) {
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

  const payment = await ThanhToanShop.create({
    maCuaHang: user.maCuaHang,
    maGoi,
    soTien: pkg.soTien,
    thoiGianBatDau,
    thoiGianKetThuc,
    trangThai: bienLai ? "CHO_XAC_NHAN" : "CHUA_THANH_TOAN",
    // trangThai: "CHO_XAC_NHAN",
    // trangThai: "CHUA_THANH_TOAN",
    ngayTao: new Date(),
    bienLaiThanhToan: null,
  });

  if (bienLai) {
    const fileName = `${Date.now()}-${bienLai.originalname}`;
    const filePath = path.join(__dirname, "../../uploads/payments", fileName);
    await fs.promises.writeFile(filePath, bienLai.buffer); // Async để tránh block

    payment.bienLaiThanhToan = `/uploads/payments/${fileName}`;
    payment.trangThai = "CHO_XAC_NHAN";
    await payment.save();
  }

  return payment;
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

// ==================== OWNER - UPLOAD BIÊN LAI ====================
async function uploadPaymentProof(userId, paymentId, file, note) {
  const user = await NguoiDung.findByPk(userId);
  if (!user || !user.maCuaHang) {
    throw new Error("Shop not found");
  }

  const payment = await ThanhToanShop.findByPk(paymentId);
  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.maCuaHang !== user.maCuaHang) {
    throw new Error("Not your payment");
  }

  if (payment.trangThai !== "CHUA_THANH_TOAN" && payment.trangThai !== "TU_CHOI") {
    throw new Error("Không thể upload biên lai cho đơn thanh toán này");
  }

  const bienLaiPath = `/uploads/payments/${file.filename}`;

  await payment.update({
    bienLaiThanhToan: bienLaiPath,
    ghiChu: note || null,
    ngayThanhToan: new Date(),
    trangThai: "CHO_XAC_NHAN",
  });

  return payment;
}

// ==================== ADMIN - XÁC NHẬN THANH TOÁN ====================
async function confirmPayment(paymentId, adminId) {
  const payment = await ThanhToanShop.findByPk(paymentId, {
    include: [{ model: CuaHang }, { model: GoiThanhToan, attributes: ["tenGoi"] }],
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.trangThai !== "CHO_XAC_NHAN") {
    throw new Error("Chỉ xác nhận được đơn đang chờ");
  }

  // Cập nhật trạng thái thanh toán
  await payment.update({
    trangThai: "DA_THANH_TOAN",
    ngayXacNhan: new Date(),
    nguoiXacNhan: adminId,
  });

  // ⭐ Kích hoạt lại shop
  const shop = await CuaHang.findByPk(payment.maCuaHang);
  if (shop.trangThai === "BI_KHOA") {
    await shop.update({ trangThai: "HOAT_DONG" });
  }

  // Gửi email thông báo
  const ownerUser = await NguoiDung.findOne({
    where: { maCuaHang: payment.maCuaHang },
  });

  if (ownerUser && ownerUser.email) {
    try {
      await emailService.sendPackagePaymentConfirmedEmail(
        ownerUser.email,
        ownerUser.hoTen,
        payment.GoiThanhToan?.tenGoi || "Goi dich vu",
        payment.thoiGianBatDau,
        payment.thoiGianKetThuc
      );
    } catch (error) {
      console.error("Error sending payment confirmation email:", error);
    }
  }

  return payment;
}

// ==================== ADMIN - TỪ CHỐI THANH TOÁN ====================
async function rejectPayment(paymentId, adminId, reason) {
  const payment = await ThanhToanShop.findByPk(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.trangThai !== "CHO_XAC_NHAN") {
    throw new Error("Chỉ từ chối được đơn đang chờ");
  }

  await payment.update({
    trangThai: "TU_CHOI",
    ghiChu: reason,
    ngayXacNhan: new Date(),
    nguoiXacNhan: adminId,
  });

  // Gửi email thông báo từ chối
  const ownerUser = await NguoiDung.findOne({
    where: { maCuaHang: payment.maCuaHang },
  });

  if (ownerUser && ownerUser.email) {
    // TODO: Gửi email từ chối + lý do
    console.log(`✉️ Send rejection email to ${ownerUser.email}`);
  }

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
  uploadPaymentProof,
  confirmPayment,
  rejectPayment,
};
