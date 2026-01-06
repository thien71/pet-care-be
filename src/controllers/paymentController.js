// src/controllers/paymentController.js
const paymentService = require("../services/paymentService");

// ==================== ADMIN ====================
async function getPaymentPackages(req, res, next) {
  try {
    const packages = await paymentService.getAllPaymentPackages();
    res.json({ data: packages });
  } catch (err) {
    next(err);
  }
}

async function createPaymentPackage(req, res, next) {
  try {
    const pkg = await paymentService.createPaymentPackage(req.body);
    res.status(201).json({ message: "Package created", data: pkg });
  } catch (err) {
    next(err);
  }
}

async function updatePaymentPackage(req, res, next) {
  try {
    const pkg = await paymentService.updatePaymentPackage(req.params.id, req.body);
    res.json({ message: "Package updated", data: pkg });
  } catch (err) {
    next(err);
  }
}

async function deletePaymentPackage(req, res, next) {
  try {
    await paymentService.deletePaymentPackage(req.params.id);
    res.json({ message: "Package deleted" });
  } catch (err) {
    next(err);
  }
}

async function getPaymentConfirmations(req, res, next) {
  try {
    const { trangThai } = req.query;
    const payments = await paymentService.getPaymentConfirmations(trangThai);
    res.json({ data: payments });
  } catch (err) {
    next(err);
  }
}

// Cập nhật confirmPayment
async function confirmPayment(req, res, next) {
  try {
    const payment = await paymentService.confirmPayment(
      req.params.id,
      req.user.id // Admin ID
    );

    res.json({
      message: "Xác nhận thanh toán thành công! Shop đã được kích hoạt.",
      data: payment,
    });
  } catch (err) {
    next(err);
  }
}

// Cập nhật rejectPayment
async function rejectPayment(req, res, next) {
  try {
    const { lyDoTuChoi } = req.body;

    if (!lyDoTuChoi || !lyDoTuChoi.trim()) {
      return res.status(400).json({
        message: "Vui lòng nhập lý do từ chối",
      });
    }

    const payment = await paymentService.rejectPayment(req.params.id, req.user.id, lyDoTuChoi);

    res.json({
      message: "Đã từ chối thanh toán",
      data: payment,
    });
  } catch (err) {
    next(err);
  }
}

// ==================== OWNER ====================
async function getMyPayments(req, res, next) {
  try {
    const payments = await paymentService.getMyPayments(req.user.id);
    res.json({ data: payments });
  } catch (err) {
    next(err);
  }
}

async function purchasePackage(req, res, next) {
  try {
    const { maGoi } = req.body;
    const payment = await paymentService.purchasePackage(req.user.id, maGoi);

    res.status(201).json({
      message: "Package registered successfully",
      data: payment,
    });
  } catch (err) {
    next(err);
  }
}

// ==================== OWNER - UPLOAD BIÊN LAI ====================
async function uploadPaymentProof(req, res, next) {
  try {
    const { paymentId, ghiChu } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng upload biên lai" });
    }

    const payment = await paymentService.uploadPaymentProof(req.user.id, paymentId, req.file, ghiChu);

    res.json({
      message: "Upload biên lai thành công! Chờ admin xác nhận.",
      data: payment,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPaymentPackages,
  createPaymentPackage,
  updatePaymentPackage,
  deletePaymentPackage,
  getPaymentConfirmations,
  confirmPayment,
  rejectPayment,
  getMyPayments,
  purchasePackage,
  uploadPaymentProof,
};
