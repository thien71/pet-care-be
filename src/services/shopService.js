// src/services/shopService.js
const { CuaHang, NguoiDung, VaiTro, NguoiDungVaiTro, ThanhToanShop } = require("../models");
const { Op } = require("sequelize");

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

// ==================== APPROVE SHOP - TẠO TRIAL PERIOD ====================
async function approveShop(shopId) {
  const shop = await CuaHang.findByPk(shopId);
  if (!shop) {
    throw new Error("Shop not found");
  }

  // ⭐ Tạo trial period 7 ngày khi approve
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7); // 7 ngày grace period

  await ThanhToanShop.create({
    maCuaHang: shop.maCuaHang,
    maGoi: null, // Chưa có gói, chỉ trial
    soTien: 0,
    thoiGianBatDau: startDate,
    thoiGianKetThuc: endDate,
    trangThai: "TRIAL",
    ghiChu: "Grace period 7 ngày sau khi được duyệt",
    ngayTao: new Date(),
  });

  // Kích hoạt shop
  await shop.update({ trangThai: "HOAT_DONG" });

  // Gán maCuaHang cho user
  await NguoiDung.update({ maCuaHang: shop.maCuaHang }, { where: { maNguoiDung: shop.nguoiDaiDien } });

  // Gán vai trò CHU_CUA_HANG
  const existingRole = await NguoiDungVaiTro.findOne({
    where: {
      maNguoiDung: shop.nguoiDaiDien,
      maVaiTro: 3, // CHU_CUA_HANG
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

// ==================== GET SHOP STATUS (NEW) ====================
async function getShopStatus(userId) {
  const user = await NguoiDung.findByPk(userId);

  if (!user || !user.maCuaHang) {
    return { hasShop: false };
  }

  const shop = await CuaHang.findByPk(user.maCuaHang);

  // Tìm gói còn hạn (bao gồm TRIAL và DA_THANH_TOAN)
  const activePackage = await ThanhToanShop.findOne({
    where: {
      maCuaHang: shop.maCuaHang,
      trangThai: {
        [Op.in]: ["DA_THANH_TOAN", "TRIAL"],
      },
      thoiGianKetThuc: {
        [Op.gte]: new Date(),
      },
    },
    include: [
      {
        model: require("../models").GoiThanhToan,
        attributes: ["tenGoi", "thoiGian"],
        required: false,
      },
    ],
    order: [["thoiGianKetThuc", "DESC"]],
  });

  const isLocked = shop.trangThai === "BI_KHOA";
  const isTrial = activePackage?.trangThai === "TRIAL";

  const daysLeft = activePackage ? Math.ceil((new Date(activePackage.thoiGianKetThuc) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  return {
    hasShop: true,
    isLocked,
    isTrial,
    daysLeft,
    expiryDate: activePackage?.thoiGianKetThuc,
    shopInfo: {
      maCuaHang: shop.maCuaHang,
      tenCuaHang: shop.tenCuaHang,
      trangThai: shop.trangThai,
    },
    activePackage: activePackage
      ? {
          maThanhToan: activePackage.maThanhToan,
          trangThai: activePackage.trangThai,
          thoiGianBatDau: activePackage.thoiGianBatDau,
          thoiGianKetThuc: activePackage.thoiGianKetThuc,
          tenGoi: activePackage.GoiThanhToan?.tenGoi || "Trial Period",
        }
      : null,
  };
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
  getShopStatus,
};
