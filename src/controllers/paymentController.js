// src/controllers/paymentController.js
const paymentService = require("../services/paymentService");

class PaymentController {
  // ==================== ADMIN ====================
  async getPaymentPackages(req, res, next) {
    try {
      const packages = await paymentService.getAllPaymentPackages();
      res.json({ data: packages });
    } catch (err) {
      next(err);
    }
  }

  async createPaymentPackage(req, res, next) {
    try {
      const pkg = await paymentService.createPaymentPackage(req.body);
      res.status(201).json({ message: "Package created", data: pkg });
    } catch (err) {
      next(err);
    }
  }

  async updatePaymentPackage(req, res, next) {
    try {
      const pkg = await paymentService.updatePaymentPackage(req.params.id, req.body);
      res.json({ message: "Package updated", data: pkg });
    } catch (err) {
      next(err);
    }
  }

  async deletePaymentPackage(req, res, next) {
    try {
      await paymentService.deletePaymentPackage(req.params.id);
      res.json({ message: "Package deleted" });
    } catch (err) {
      next(err);
    }
  }

  async getPaymentConfirmations(req, res, next) {
    try {
      const { trangThai } = req.query;
      const payments = await paymentService.getPaymentConfirmations(trangThai);
      res.json({ data: payments });
    } catch (err) {
      next(err);
    }
  }

  async confirmPayment(req, res, next) {
    try {
      const payment = await paymentService.confirmPayment(req.params.id);
      res.json({ message: "Payment confirmed", data: payment });
    } catch (err) {
      next(err);
    }
  }

  async rejectPayment(req, res, next) {
    try {
      const payment = await paymentService.rejectPayment(req.params.id);
      res.json({ message: "Payment rejected", data: payment });
    } catch (err) {
      next(err);
    }
  }

  // ==================== OWNER ====================
  async getMyPayments(req, res, next) {
    try {
      const payments = await paymentService.getMyPayments(req.user.id);
      res.json({ data: payments });
    } catch (err) {
      next(err);
    }
  }

  async purchasePackage(req, res, next) {
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
}

module.exports = new PaymentController();
