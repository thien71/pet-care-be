// src/controllers/serviceController.js
const serviceManagementService = require("../services/serviceManagementService");

// ==================== ROLES ====================
async function getRoles(req, res, next) {
  try {
    const roles = await serviceManagementService.getAllRoles();
    res.json({ data: roles });
  } catch (err) {
    next(err);
  }
}

async function createRole(req, res, next) {
  try {
    const { tenVaiTro } = req.body;
    const role = await serviceManagementService.createRole(tenVaiTro);
    res.status(201).json({ message: "Role created", data: role });
  } catch (err) {
    next(err);
  }
}

async function updateRole(req, res, next) {
  try {
    const { tenVaiTro } = req.body;
    const role = await serviceManagementService.updateRole(req.params.id, tenVaiTro);
    res.json({ message: "Role updated", data: role });
  } catch (err) {
    next(err);
  }
}

async function deleteRole(req, res, next) {
  try {
    await serviceManagementService.deleteRole(req.params.id);
    res.json({ message: "Role deleted" });
  } catch (err) {
    next(err);
  }
}

// ==================== PET TYPES ====================
async function getPetTypes(req, res, next) {
  try {
    const petTypes = await serviceManagementService.getAllPetTypes();
    res.json({ data: petTypes });
  } catch (err) {
    next(err);
  }
}

async function getPublicPetTypes(req, res, next) {
  try {
    const petTypes = await serviceManagementService.getPublicPetTypes();
    res.json({ data: petTypes });
  } catch (err) {
    next(err);
  }
}

async function createPetType(req, res, next) {
  try {
    const { tenLoai } = req.body;
    const petType = await serviceManagementService.createPetType(tenLoai);
    res.status(201).json({ message: "Pet type created", data: petType });
  } catch (err) {
    next(err);
  }
}

async function updatePetType(req, res, next) {
  try {
    const { tenLoai } = req.body;
    const petType = await serviceManagementService.updatePetType(req.params.id, tenLoai);
    res.json({ message: "Pet type updated", data: petType });
  } catch (err) {
    next(err);
  }
}

async function deletePetType(req, res, next) {
  try {
    await serviceManagementService.deletePetType(req.params.id);
    res.json({ message: "Pet type deleted" });
  } catch (err) {
    next(err);
  }
}

// ==================== SYSTEM SERVICES ====================
async function getSystemServices(req, res, next) {
  try {
    const services = await serviceManagementService.getAllSystemServices();
    res.json({ data: services });
  } catch (err) {
    next(err);
  }
}

async function getPublicServices(req, res, next) {
  try {
    const services = await serviceManagementService.getPublicServices();
    res.json({ data: services });
  } catch (err) {
    next(err);
  }
}

async function getServiceDetail(req, res, next) {
  try {
    const result = await serviceManagementService.getServiceDetail(req.params.serviceId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function createSystemService(req, res, next) {
  try {
    const service = await serviceManagementService.createSystemService(req.body);
    res.status(201).json({ message: "Service created", data: service });
  } catch (err) {
    next(err);
  }
}

async function updateSystemService(req, res, next) {
  try {
    const service = await serviceManagementService.updateSystemService(req.params.id, req.body);
    res.json({ message: "Service updated", data: service });
  } catch (err) {
    next(err);
  }
}

async function deleteSystemService(req, res, next) {
  try {
    await serviceManagementService.deleteSystemService(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    next(err);
  }
}

// ==================== SHOP SERVICES ====================
async function getShopServices(req, res, next) {
  try {
    const services = await serviceManagementService.getShopServices(req.user.id);
    res.json({ data: services });
  } catch (err) {
    next(err);
  }
}

async function addServiceToShop(req, res, next) {
  try {
    const service = await serviceManagementService.addServiceToShop(req.user.id, req.body);
    res.status(201).json({ message: "Service added", data: service });
  } catch (err) {
    next(err);
  }
}

async function updateShopService(req, res, next) {
  try {
    const service = await serviceManagementService.updateShopService(req.user.id, req.params.id, req.body);
    res.json({ message: "Service updated", data: service });
  } catch (err) {
    next(err);
  }
}

async function deleteShopService(req, res, next) {
  try {
    await serviceManagementService.deleteShopService(req.user.id, req.params.id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    next(err);
  }
}

async function getAllShopServices(req, res, next) {
  try {
    const result = await serviceManagementService.getAllShopServices(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getShopServiceDetail(req, res, next) {
  try {
    const service = await serviceManagementService.getShopServiceDetail(req.params.shopServiceId);
    res.json({ data: service });
  } catch (err) {
    next(err);
  }
}

// ==================== SERVICE PROPOSALS ====================
async function proposeNewService(req, res, next) {
  try {
    const proposal = await serviceManagementService.proposeNewService(req.user.id, req.body);
    res.status(201).json({ message: "Proposal submitted", data: proposal });
  } catch (err) {
    next(err);
  }
}

async function getServiceProposals(req, res, next) {
  try {
    const { trangThai } = req.query;
    const proposals = await serviceManagementService.getServiceProposals(trangThai);
    res.json({ data: proposals });
  } catch (err) {
    next(err);
  }
}

async function approveServiceProposal(req, res, next) {
  try {
    const result = await serviceManagementService.approveServiceProposal(req.params.id, req.user.id);
    res.json({
      message: "Proposal approved and service created",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

async function rejectServiceProposal(req, res, next) {
  try {
    const { lyDoTuChoi } = req.body;
    const proposal = await serviceManagementService.rejectServiceProposal(req.params.id, req.user.id, lyDoTuChoi);
    res.json({ message: "Proposal rejected", data: proposal });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPetTypes,
  getPublicPetTypes,
  createPetType,
  updatePetType,
  deletePetType,
  getSystemServices,
  getPublicServices,
  getServiceDetail,
  createSystemService,
  updateSystemService,
  deleteSystemService,
  getShopServices,
  addServiceToShop,
  updateShopService,
  deleteShopService,
  getAllShopServices,
  getShopServiceDetail,
  proposeNewService,
  getServiceProposals,
  approveServiceProposal,
  rejectServiceProposal,
};
