// src/controllers/shopController.js
const shopService = require("../services/shopService");

// ==================== CUSTOMER ====================
async function registerShop(req, res, next) {
  try {
    const shop = await shopService.registerShop(req.user.id, req.body, req.files);

    res.status(201).json({
      message: "Shop registered successfully. Waiting for approval.",
      data: shop,
    });
  } catch (err) {
    next(err);
  }
}

// ==================== ADMIN ====================
async function getShops(req, res, next) {
  try {
    const { trangThai } = req.query;
    const shops = await shopService.getAllShops(trangThai);
    res.json({ data: shops });
  } catch (err) {
    next(err);
  }
}

async function getShopApprovals(req, res, next) {
  try {
    const { trangThai } = req.query;
    const shops = await shopService.getAllShops(trangThai || "CHO_DUYET");
    res.json({ data: shops });
  } catch (err) {
    next(err);
  }
}

async function getShopById(req, res, next) {
  try {
    const shop = await shopService.getShopById(req.params.id);
    res.json({ data: shop });
  } catch (err) {
    next(err);
  }
}

async function updateShop(req, res, next) {
  try {
    const shop = await shopService.updateShop(req.params.id, req.body);
    res.json({ message: "Shop updated", data: shop });
  } catch (err) {
    next(err);
  }
}

async function deleteShop(req, res, next) {
  try {
    await shopService.deleteShop(req.params.id);
    res.json({ message: "Shop deleted" });
  } catch (err) {
    next(err);
  }
}

async function approveShop(req, res, next) {
  try {
    const shop = await shopService.approveShop(req.params.id);
    res.json({ message: "Shop approved successfully", data: shop });
  } catch (err) {
    next(err);
  }
}

async function rejectShop(req, res, next) {
  try {
    const shop = await shopService.rejectShop(req.params.id);
    res.json({ message: "Shop rejected", data: shop });
  } catch (err) {
    next(err);
  }
}

// ==================== OWNER ====================
async function getShopInfo(req, res, next) {
  try {
    const shop = await shopService.getShopInfo(req.user.id);
    res.json({ data: shop });
  } catch (err) {
    next(err);
  }
}

async function updateShopInfo(req, res, next) {
  try {
    const shop = await shopService.updateShopInfo(req.user.id, req.body);
    res.json({ message: "Shop updated", data: shop });
  } catch (err) {
    next(err);
  }
}

// ==================== PUBLIC ====================
async function getPublicShops(req, res, next) {
  try {
    const shops = await shopService.getPublicShops();
    res.json({ data: shops });
  } catch (err) {
    next(err);
  }
}

async function getShopProfile(req, res, next) {
  try {
    const shop = await shopService.getShopProfile(req.params.shopId);
    const serviceService = require("../services/serviceManagementService");
    const { DichVuCuaShop, DichVuHeThong } = require("../models");

    const services = await DichVuCuaShop.findAll({
      where: {
        maCuaHang: req.params.shopId,
        trangThai: 1,
      },
      include: [
        {
          model: DichVuHeThong,
          attributes: ["maDichVu", "tenDichVu", "moTa", "thoiLuong"],
        },
      ],
      order: [[DichVuHeThong, "tenDichVu", "ASC"]],
    });

    const formattedServices = services.map((s) => ({
      maDichVuShop: s.maDichVuShop,
      maDichVuHeThong: s.maDichVuHeThong,
      tenDichVu: s.DichVuHeThong?.tenDichVu,
      moTa: s.DichVuHeThong?.moTa,
      thoiLuong: s.DichVuHeThong?.thoiLuong,
      gia: s.gia,
    }));

    res.json({
      shop: shop.toJSON(),
      services: formattedServices,
    });
  } catch (err) {
    next(err);
  }
}

async function getTopShops(req, res, next) {
  try {
    const { limit = 6 } = req.query;
    const { sequelize, CuaHang, LichHen } = require("../models");

    const topShops = await CuaHang.findAll({
      where: { trangThai: "HOAT_DONG" },
      attributes: ["maCuaHang", "tenCuaHang", "diaChi", "soDienThoai", "moTa", "anhCuaHang", "kinhDo", "viDo"],
      include: [
        {
          model: LichHen,
          attributes: [],
          where: { trangThai: "HOAN_THANH" },
          required: false,
        },
      ],
      group: ["CuaHang.maCuaHang"],
      order: [[sequelize.fn("COUNT", sequelize.col("LichHens.maLichHen")), "DESC"]],
      limit: parseInt(limit),
      subQuery: false,
    });

    res.json({ data: topShops });
  } catch (err) {
    next(err);
  }
}

// ==================== STAFF ====================
async function getShopCustomers(req, res, next) {
  try {
    const customers = await shopService.getShopCustomers(req.user.id);
    res.json({ data: customers });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  registerShop,
  getShops,
  getShopApprovals,
  getShopById,
  updateShop,
  deleteShop,
  approveShop,
  rejectShop,
  getShopInfo,
  updateShopInfo,
  getPublicShops,
  getShopProfile,
  getTopShops,
  getShopCustomers,
};
