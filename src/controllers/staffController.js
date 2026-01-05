// src/controllers/staffController.js
const staffService = require("../services/staffService");

// ==================== SCHEDULE ====================
async function getMySchedule(req, res, next) {
  try {
    const schedule = await staffService.getMySchedule(req.user.id);
    res.json({ data: schedule });
  } catch (err) {
    next(err);
  }
}

// ==================== EMPLOYEE MANAGEMENT ====================
async function getEmployees(req, res, next) {
  try {
    const employees = await staffService.getEmployees(req.user.id);
    res.json({ data: employees });
  } catch (err) {
    next(err);
  }
}

async function addEmployee(req, res, next) {
  try {
    const employee = await staffService.addEmployee(req.user.id, req.body);
    res.status(201).json({
      message: "Employee added",
      data: employee,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteEmployee(req, res, next) {
  try {
    await staffService.deleteEmployee(req.user.id, req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    next(err);
  }
}

// ==================== SHIFT MANAGEMENT ====================
async function getShifts(req, res, next) {
  try {
    const shifts = await staffService.getShifts(req.user.id);
    res.json({ data: shifts });
  } catch (err) {
    next(err);
  }
}

async function assignShift(req, res, next) {
  try {
    const shift = await staffService.assignShift(req.user.id, req.body);
    res.status(201).json({ message: "Shift assigned", data: shift });
  } catch (err) {
    next(err);
  }
}

async function bulkAssignShifts(req, res, next) {
  try {
    const { assignments } = req.body;
    const created = await staffService.bulkAssignShifts(req.user.id, assignments);

    res.status(201).json({
      message: `Phân công ${created.length} ca thành công!`,
      data: created,
    });
  } catch (err) {
    next(err);
  }
}

async function removeShift(req, res, next) {
  try {
    await staffService.removeShift(req.user.id, req.params.id);
    res.json({ message: "Shift removed" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMySchedule,
  getEmployees,
  addEmployee,
  deleteEmployee,
  getShifts,
  assignShift,
  bulkAssignShifts,
  removeShift,
};
