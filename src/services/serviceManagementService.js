// src/services/serviceManagementService.js
const { VaiTro, LoaiThuCung, DichVuHeThong, DichVuCuaShop, DeXuatDichVu, CuaHang, NguoiDung } = require("../models");
const { Op } = require("sequelize");

// ==================== ROLES ====================
async function getAllRoles() {
  return await VaiTro.findAll();
}

async function createRole(tenVaiTro) {
  return await VaiTro.create({ tenVaiTro });
}

async function updateRole(roleId, tenVaiTro) {
  const role = await VaiTro.findByPk(roleId);
  if (!role) {
    throw new Error("Role not found");
  }
  await role.update({ tenVaiTro });
  return role;
}

async function deleteRole(roleId) {
  const role = await VaiTro.findByPk(roleId);
  if (!role) {
    throw new Error("Role not found");
  }
  await role.destroy();
  return { message: "Role deleted" };
}

// ==================== PET TYPES ====================
async function getAllPetTypes() {
  return await LoaiThuCung.findAll();
}

async function getPublicPetTypes() {
  return await LoaiThuCung.findAll({
    attributes: ["maLoai", "tenLoai"],
    order: [["maLoai", "ASC"]],
  });
}

async function createPetType(tenLoai) {
  return await LoaiThuCung.create({ tenLoai });
}

async function updatePetType(petTypeId, tenLoai) {
  const petType = await LoaiThuCung.findByPk(petTypeId);
  if (!petType) {
    throw new Error("Pet type not found");
  }
  await petType.update({ tenLoai });
  return petType;
}

async function deletePetType(petTypeId) {
  const petType = await LoaiThuCung.findByPk(petTypeId);
  if (!petType) {
    throw new Error("Pet type not found");
  }
  await petType.destroy();
  return { message: "Pet type deleted" };
}

// ==================== SYSTEM SERVICES ====================
async function getAllSystemServices() {
  return await DichVuHeThong.findAll();
}

async function getPublicServices() {
  const services = await DichVuHeThong.findAll({
    where: { trangThai: 1 },
    attributes: ["maDichVu", "tenDichVu", "moTa", "thoiLuong"],
    order: [["tenDichVu", "ASC"]],
  });

  const servicesWithPrice = await Promise.all(
    services.map(async (service) => {
      const shopServices = await DichVuCuaShop.findAll({
        where: {
          maDichVuHeThong: service.maDichVu,
          trangThai: 1,
        },
        attributes: ["gia"],
      });

      let avgPrice = 0;
      let minPrice = 0;
      let shopCount = shopServices.length;

      if (shopCount > 0) {
        const prices = shopServices.map((s) => parseFloat(s.gia));
        minPrice = Math.min(...prices);
        avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      }

      return {
        maDichVu: service.maDichVu,
        tenDichVu: service.tenDichVu,
        moTa: service.moTa,
        thoiLuong: service.thoiLuong,
        giaThapNhat: minPrice,
        giaTrungBinh: Math.round(avgPrice),
        soLuongShop: shopCount,
      };
    })
  );

  return servicesWithPrice;
}

async function getServiceDetail(serviceId) {
  const service = await DichVuHeThong.findByPk(serviceId);
  if (!service) {
    throw new Error("Service not found");
  }

  const shopsOffering = await DichVuCuaShop.findAll({
    where: {
      maDichVuHeThong: serviceId,
      trangThai: 1,
    },
    include: [
      {
        model: CuaHang,
        where: { trangThai: "HOAT_DONG" },
        attributes: ["maCuaHang", "tenCuaHang", "diaChi", "soDienThoai", "anhCuaHang", "kinhDo", "viDo"],
      },
    ],
    order: [["gia", "ASC"]],
  });

  const formattedShops = shopsOffering.map((s) => ({
    maCuaHang: s.CuaHang.maCuaHang,
    tenCuaHang: s.CuaHang.tenCuaHang,
    diaChi: s.CuaHang.diaChi,
    soDienThoai: s.CuaHang.soDienThoai,
    anhCuaHang: s.CuaHang.anhCuaHang,
    kinhDo: s.CuaHang.kinhDo,
    viDo: s.CuaHang.viDo,
    gia: s.gia,
    maDichVuShop: s.maDichVuShop,
  }));

  return {
    service: {
      maDichVu: service.maDichVu,
      tenDichVu: service.tenDichVu,
      moTa: service.moTa,
      thoiLuong: service.thoiLuong,
    },
    shops: formattedShops,
  };
}

async function createSystemService({ tenDichVu, moTa, thoiLuong }) {
  return await DichVuHeThong.create({
    tenDichVu,
    moTa,
    thoiLuong,
    trangThai: 1,
  });
}

async function updateSystemService(serviceId, { tenDichVu, moTa, thoiLuong }) {
  const service = await DichVuHeThong.findByPk(serviceId);
  if (!service) {
    throw new Error("Service not found");
  }
  await service.update({ tenDichVu, moTa, thoiLuong });
  return service;
}

async function deleteSystemService(serviceId) {
  const service = await DichVuHeThong.findByPk(serviceId);
  if (!service) {
    throw new Error("Service not found");
  }
  await service.destroy();
  return { message: "Service deleted" };
}

// ==================== SHOP SERVICES ====================
async function getShopServices(userId) {
  const user = await NguoiDung.findByPk(userId);
  if (!user || !user.maCuaHang) {
    throw new Error("Shop not found");
  }

  const services = await DichVuCuaShop.findAll({
    where: { maCuaHang: user.maCuaHang },
    include: [
      {
        model: DichVuHeThong,
        attributes: ["tenDichVu", "moTa", "thoiLuong"],
      },
    ],
  });

  return services.map((s) => ({
    maDichVuShop: s.maDichVuShop,
    maDichVuHeThong: s.maDichVuHeThong,
    maCuaHang: s.maCuaHang,
    gia: s.gia,
    trangThai: s.trangThai,
    tenDichVu: s.DichVuHeThong?.tenDichVu,
    moTa: s.DichVuHeThong?.moTa,
    thoiLuong: s.DichVuHeThong?.thoiLuong,
  }));
}

async function addServiceToShop(userId, { maDichVuHeThong, gia }) {
  const user = await NguoiDung.findByPk(userId);
  if (!user || !user.maCuaHang) {
    throw new Error("Shop not found");
  }

  const existing = await DichVuCuaShop.findOne({
    where: {
      maCuaHang: user.maCuaHang,
      maDichVuHeThong,
    },
  });

  if (existing) {
    throw new Error("Service already added");
  }

  return await DichVuCuaShop.create({
    maDichVuHeThong,
    maCuaHang: user.maCuaHang,
    gia,
    trangThai: 1,
  });
}

async function updateShopService(userId, serviceId, { gia }) {
  const service = await DichVuCuaShop.findByPk(serviceId);
  if (!service) {
    throw new Error("Service not found");
  }

  const user = await NguoiDung.findByPk(userId);
  if (service.maCuaHang !== user.maCuaHang) {
    throw new Error("Not your shop");
  }

  await service.update({ gia });
  return service;
}

async function deleteShopService(userId, serviceId) {
  const service = await DichVuCuaShop.findByPk(serviceId);
  if (!service) {
    throw new Error("Service not found");
  }

  const user = await NguoiDung.findByPk(userId);
  if (service.maCuaHang !== user.maCuaHang) {
    throw new Error("Not your shop");
  }

  await service.destroy();
  return { message: "Service deleted" };
}

async function getAllShopServices({ limit = 20, offset = 0, search = "", sortBy = "relevance", petType = "" }) {
  const shopServices = await DichVuCuaShop.findAll({
    where: { trangThai: 1 },
    include: [
      {
        model: DichVuHeThong,
        attributes: ["maDichVu", "tenDichVu", "moTa", "thoiLuong"],
      },
      {
        model: CuaHang,
        where: { trangThai: "HOAT_DONG" },
        attributes: ["maCuaHang", "tenCuaHang", "diaChi", "soDienThoai", "anhCuaHang", "kinhDo", "viDo"],
      },
    ],
    subQuery: false,
  });

  let filtered = shopServices;

  const petMap = {
    cho: ["chó"],
    meo: ["mèo", "meo"],
    chim: ["chim"],
    hamster: ["hamster", "chuot", "chuột"],
    tho: ["thỏ"],
    rua: ["rùa"],
  };

  if (petType) {
    const keywords = petMap[petType.toLowerCase()] || [];
    filtered = filtered.filter((s) => {
      const text = (s.DichVuHeThong?.tenDichVu + " " + s.DichVuHeThong?.moTa).toLowerCase();
      return keywords.some((kw) => text.includes(kw.toLowerCase()));
    });
  }

  if (search && search.trim()) {
    const words = search.trim().toLowerCase().split(/\s+/);
    filtered = filtered.filter((s) => {
      const fullText = (s.DichVuHeThong?.tenDichVu + " " + s.DichVuHeThong?.moTa).toLowerCase();
      return words.every((word) => fullText.includes(word));
    });
  }

  if (!search && sortBy === "price_asc") {
    filtered.sort((a, b) => parseFloat(a.gia) - parseFloat(b.gia));
  } else if (!search && sortBy === "price_desc") {
    filtered.sort((a, b) => parseFloat(b.gia) - parseFloat(a.gia));
  }

  const total = filtered.length;
  const paginated = filtered.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

  const formatted = paginated.map((s) => ({
    maDichVuShop: s.maDichVuShop,
    maDichVuHeThong: s.maDichVuHeThong,
    tenDichVu: s.DichVuHeThong?.tenDichVu,
    moTa: s.DichVuHeThong?.moTa,
    thoiLuong: s.DichVuHeThong?.thoiLuong,
    gia: s.gia,
    maCuaHang: s.CuaHang?.maCuaHang,
    tenCuaHang: s.CuaHang?.tenCuaHang,
    diaChi: s.CuaHang?.diaChi,
    soDienThoai: s.CuaHang?.soDienThoai,
    anhCuaHang: s.CuaHang?.anhCuaHang,
    kinhDo: s.CuaHang?.kinhDo,
    viDo: s.CuaHang?.viDo,
  }));

  return {
    data: formatted,
    total,
    page: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(total / limit),
  };
}

async function getShopServiceDetail(shopServiceId) {
  const shopService = await DichVuCuaShop.findByPk(shopServiceId, {
    include: [
      {
        model: DichVuHeThong,
        attributes: ["maDichVu", "tenDichVu", "moTa", "thoiLuong"],
      },
      {
        model: CuaHang,
        attributes: ["maCuaHang", "tenCuaHang", "diaChi", "soDienThoai", "moTa", "anhCuaHang", "kinhDo", "viDo"],
      },
    ],
  });

  if (!shopService) {
    throw new Error("Service not found");
  }

  const otherServices = await DichVuCuaShop.findAll({
    where: {
      maCuaHang: shopService.maCuaHang,
      maDichVuShop: { [Op.ne]: shopServiceId },
      trangThai: 1,
    },
    include: [
      {
        model: DichVuHeThong,
        attributes: ["tenDichVu", "thoiLuong"],
      },
    ],
    limit: 6,
  });

  return {
    maDichVuShop: shopService.maDichVuShop,
    maDichVuHeThong: shopService.maDichVuHeThong,
    tenDichVu: shopService.DichVuHeThong?.tenDichVu,
    moTa: shopService.DichVuHeThong?.moTa,
    thoiLuong: shopService.DichVuHeThong?.thoiLuong,
    gia: shopService.gia,
    shop: {
      maCuaHang: shopService.CuaHang?.maCuaHang,
      tenCuaHang: shopService.CuaHang?.tenCuaHang,
      diaChi: shopService.CuaHang?.diaChi,
      soDienThoai: shopService.CuaHang?.soDienThoai,
      moTa: shopService.CuaHang?.moTa,
      anhCuaHang: shopService.CuaHang?.anhCuaHang,
      kinhDo: shopService.CuaHang?.kinhDo,
      viDo: shopService.CuaHang?.viDo,
    },
    otherServices: otherServices.map((s) => ({
      maDichVuShop: s.maDichVuShop,
      tenDichVu: s.DichVuHeThong?.tenDichVu,
      thoiLuong: s.DichVuHeThong?.thoiLuong,
      gia: s.gia,
    })),
  };
}

// ==================== SERVICE PROPOSALS ====================
async function proposeNewService(userId, { tenDichVu, moTa, gia }) {
  const user = await NguoiDung.findByPk(userId);
  if (!user || !user.maCuaHang) {
    throw new Error("Shop not found");
  }

  return await DeXuatDichVu.create({
    maCuaHang: user.maCuaHang,
    tenDichVu,
    moTa,
    gia,
    trangThai: "CHO_DUYET",
    ngayGui: new Date(),
  });
}

async function getServiceProposals(trangThai) {
  const whereClause = {};
  if (trangThai) {
    whereClause.trangThai = trangThai;
  }

  return await DeXuatDichVu.findAll({
    where: whereClause,
    include: [
      { model: CuaHang, attributes: ["tenCuaHang"] },
      { model: NguoiDung, as: "QuanTriVien", attributes: ["hoTen"] },
    ],
    order: [["ngayGui", "DESC"]],
  });
}

async function approveServiceProposal(proposalId, adminId) {
  const proposal = await DeXuatDichVu.findByPk(proposalId);
  if (!proposal) {
    throw new Error("Proposal not found");
  }

  const newService = await DichVuHeThong.create({
    tenDichVu: proposal.tenDichVu,
    moTa: proposal.moTa,
    trangThai: 1,
  });

  await proposal.update({
    trangThai: "DA_DUYET",
    maQuanTriVien: adminId,
    ngayDuyet: new Date(),
  });

  return { proposal, newService };
}

async function rejectServiceProposal(proposalId, adminId, lyDoTuChoi) {
  const proposal = await DeXuatDichVu.findByPk(proposalId);
  if (!proposal) {
    throw new Error("Proposal not found");
  }

  await proposal.update({
    trangThai: "TU_CHOI",
    lyDoTuChoi,
    maQuanTriVien: adminId,
    ngayDuyet: new Date(),
  });

  return proposal;
}

module.exports = {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
  getAllPetTypes,
  getPublicPetTypes,
  createPetType,
  updatePetType,
  deletePetType,
  getAllSystemServices,
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
