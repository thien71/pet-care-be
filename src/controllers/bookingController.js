// src/controllers/bookingController.js
const bookingService = require("../services/bookingService");

// ==================== CUSTOMER ====================
async function createBooking(req, res, next) {
  try {
    const booking = await bookingService.createBooking(req.user.id, req.body);

    res.status(201).json({
      message: "Đặt lịch thành công! Chờ cửa hàng xác nhận.",
      data: booking,
    });
  } catch (err) {
    next(err);
  }
}

async function getMyBookings(req, res, next) {
  try {
    const bookings = await bookingService.getMyBookings(req.user.id);
    res.json({ data: bookings });
  } catch (err) {
    next(err);
  }
}

// ==================== STAFF/OWNER ====================
async function getShopBookings(req, res, next) {
  try {
    const { trangThai } = req.query;
    const bookings = await bookingService.getShopBookings(req.user.id, trangThai);
    res.json({ data: bookings });
  } catch (err) {
    next(err);
  }
}

async function confirmBooking(req, res, next) {
  try {
    const booking = await bookingService.confirmBooking(req.params.id);
    res.json({ message: "Xác nhận đơn hàng thành công", data: booking });
  } catch (err) {
    next(err);
  }
}

async function assignTechnician(req, res, next) {
  try {
    const { maNhanVien } = req.body;
    const booking = await bookingService.assignTechnician(req.params.id, maNhanVien);
    res.json({ message: "Gán nhân viên thành công", data: booking });
  } catch (err) {
    next(err);
  }
}

async function updateBookingStatus(req, res, next) {
  try {
    const { trangThai } = req.body;
    const booking = await bookingService.updateBookingStatus(req.params.id, trangThai);
    res.json({ message: "Cập nhật trạng thái thành công", data: booking });
  } catch (err) {
    next(err);
  }
}

async function confirmPayment(req, res, next) {
  try {
    const booking = await bookingService.confirmPayment(req.user.id, req.params.id);
    res.json({
      message: "Xác nhận thanh toán thành công!",
      data: booking,
    });
  } catch (err) {
    next(err);
  }
}

// ==================== TECHNICIAN ====================
async function getMyAssignments(req, res, next) {
  try {
    const assignments = await bookingService.getMyAssignments(req.user.id);
    res.json({ data: assignments });
  } catch (err) {
    next(err);
  }
}

async function updateMyAssignment(req, res, next) {
  try {
    const { trangThai } = req.body;
    const booking = await bookingService.updateMyAssignment(req.user.id, req.params.id, trangThai);
    res.json({ message: "Cập nhật thành công", data: booking });
  } catch (err) {
    next(err);
  }
}

// ==================== PUBLIC ====================
async function getAvailableSlots(req, res, next) {
  try {
    const { shopId } = req.params;
    const { date } = req.query;

    const result = await bookingService.getAvailableSlots(shopId, date);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createBooking,
  getMyBookings,
  getShopBookings,
  confirmBooking,
  assignTechnician,
  updateBookingStatus,
  confirmPayment,
  getMyAssignments,
  updateMyAssignment,
  getAvailableSlots,
};
