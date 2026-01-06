// src/services/shopService.js
const { CuaHang, NguoiDung, VaiTro, NguoiDungVaiTro } = require("../models");

// ==================== CUSTOMER - REGISTER SHOP ====================
async function registerShop(userId, shopData, files) {
  const { tenCuaHang, diaChi, soDienThoai, moTa, kinhDo, viDo } = shopData;

  if (!tenCuaHang || !diaChi || !soDienThoai) {
    throw new Error("Missing required text fields");
  }

  if (!files?.giayPhepKD || !files?.cccdMatTruoc || !files?.cccdMatSau) {
    throw new Error("Missing required documents");
  }

  const existingShop = await CuaHang.findOne({
    where: { nguoiDaiDien: userId },
  });

  if (existingShop) {
    throw new Error("You already have a shop");
  }

  const shop = await CuaHang.create({
    tenCuaHang,
    diaChi,
    soDienThoai,
    moTa: moTa || null,
    kinhDo: kinhDo || null,
    viDo: viDo || null,
    nguoiDaiDien: userId,
    trangThai: "CHO_DUYET",
    ngayTao: new Date(),
    giayPhepKD: `/uploads/${files.giayPhepKD[0].filename}`,
    cccdMatTruoc: `/uploads/${files.cccdMatTruoc[0].filename}`,
    cccdMatSau: `/uploads/${files.cccdMatSau[0].filename}`,
    anhCuaHang: files.anhCuaHang?.[0]?.filename ? `/uploads/${files.anhCuaHang[0].filename}` : null,
  });

  return shop;
}

// ==================== ADMIN - SHOP MANAGEMENT ====================
async function getAllShops(trangThai) {
  const whereClause = {};
  if (trangThai) {
    whereClause.trangThai = trangThai;
  }

  const shops = await CuaHang.findAll({
    where: whereClause,
    include: [
      {
        model: NguoiDung,
        as: "NguoiDaiDien",
        attributes: ["hoTen", "email", "soDienThoai"],
      },
    ],
    order: [["ngayTao", "DESC"]],
  });

  return shops;
}

async function getShopById(shopId) {
  const shop = await CuaHang.findByPk(shopId, {
    include: [
      {
        model: NguoiDung,
        as: "NguoiDaiDien",
        attributes: ["hoTen", "email"],
      },
    ],
  });

  if (!shop) {
    throw new Error("Shop not found");
  }

  return shop;
}

async function updateShop(shopId, { tenCuaHang, diaChi, soDienThoai, trangThai }) {
  const shop = await CuaHang.findByPk(shopId);
  if (!shop) {
    throw new Error("Shop not found");
  }

  await shop.update({ tenCuaHang, diaChi, soDienThoai, trangThai });
  return shop;
}

async function deleteShop(shopId) {
  const shop = await CuaHang.findByPk(shopId);
  if (!shop) {
    throw new Error("Shop not found");
  }

  await shop.destroy();
  return { message: "Shop deleted" };
}

async function approveShop(shopId) {
  const shop = await CuaHang.findByPk(shopId);
  if (!shop) {
    throw new Error("Shop not found");
  }

  await shop.update({ trangThai: "HOAT_DONG" });

  await NguoiDung.update({ maCuaHang: shop.maCuaHang }, { where: { maNguoiDung: shop.nguoiDaiDien } });

  const existingRole = await NguoiDungVaiTro.findOne({
    where: {
      maNguoiDung: shop.nguoiDaiDien,
      maVaiTro: 3,
    },
  });

  if (!existingRole) {
    await NguoiDungVaiTro.create({
      maNguoiDung: shop.nguoiDaiDien,
      maVaiTro: 3,
    });
  }

  return shop;
}

async function rejectShop(shopId) {
  const shop = await CuaHang.findByPk(shopId);
  if (!shop) {
    throw new Error("Shop not found");
  }

  await shop.update({ trangThai: "BI_KHOA" });
  return shop;
}

// ==================== OWNER ====================
async function getShopInfo(userId) {
  const user = await NguoiDung.findByPk(userId);
  if (!user || !user.maCuaHang) {
    throw new Error("Shop not found");
  }

  const shop = await CuaHang.findByPk(user.maCuaHang);
  if (!shop) {
    throw new Error("Shop not found");
  }

  return shop;
}

async function updateShopInfo(userId, { tenCuaHang, diaChi, soDienThoai, moTa, kinhDo, viDo, anhCuaHang }) {
  const user = await NguoiDung.findByPk(userId);
  if (!user || !user.maCuaHang) {
    throw new Error("Shop not found");
  }

  const shop = await CuaHang.findByPk(user.maCuaHang);
  if (!shop) {
    throw new Error("Shop not found");
  }

  const updateData = {
    tenCuaHang,
    diaChi,
    soDienThoai,
    moTa,
    kinhDo,
    viDo,
  };

  // Nếu có upload ảnh mới
  if (anhCuaHang) {
    updateData.anhCuaHang = anhCuaHang;
  }

  await shop.update(updateData);
  return shop;
}

// ==================== PUBLIC - SHOP LISTING ====================
async function getPublicShops() {
  const shops = await CuaHang.findAll({
    where: {
      trangThai: "HOAT_DONG",
    },
    attributes: ["maCuaHang", "tenCuaHang", "diaChi", "soDienThoai", "moTa", "anhCuaHang", "kinhDo", "viDo"],
    include: [
      {
        model: ThanhToanShop,
        where: {
          trangThai: "DA_THANH_TOAN",
          thoiGianKetThuc: {
            [Op.gte]: new Date(), // Còn hạn
          },
        },
        required: true, // ⭐ Bắt buộc có gói còn hạn
        attributes: [],
      },
    ],
    order: [["tenCuaHang", "ASC"]],
  });

  return shops;
}

async function getShopProfile(shopId) {
  const shop = await CuaHang.findByPk(shopId, {
    where: { trangThai: "HOAT_DONG" },
    attributes: ["maCuaHang", "tenCuaHang", "diaChi", "soDienThoai", "moTa", "anhCuaHang", "kinhDo", "viDo"],
  });

  if (!shop) {
    throw new Error("Shop not found");
  }

  return shop;
}

async function getShopCustomers(userId) {
  const { LichHen } = require("../models");

  const staff = await NguoiDung.findByPk(userId);
  if (!staff || !staff.maCuaHang) {
    throw new Error("Shop not found");
  }

  const customers = await LichHen.findAll({
    where: { maCuaHang: staff.maCuaHang },
    attributes: [],
    include: [
      {
        model: NguoiDung,
        as: "KhachHang",
        attributes: ["maNguoiDung", "hoTen", "email", "soDienThoai", "diaChi"],
        required: true,
      },
    ],
    raw: true,
    subQuery: false,
    group: ["KhachHang.maNguoiDung"],
  });

  const uniqueCustomers = customers.reduce((acc, curr) => {
    const existing = acc.find((c) => c["KhachHang.maNguoiDung"] === curr["KhachHang.maNguoiDung"]);
    if (!existing) {
      acc.push(curr);
    }
    return acc;
  }, []);

  return uniqueCustomers;
}

module.exports = {
  registerShop,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop,
  approveShop,
  rejectShop,
  getShopInfo,
  updateShopInfo,
  getPublicShops,
  getShopProfile,
  getShopCustomers,
};
