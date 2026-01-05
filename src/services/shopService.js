// src/services/shopService.js
const { CuaHang, NguoiDung, VaiTro, NguoiDungVaiTro } = require("../models");

class ShopService {
  // ==================== CUSTOMER - REGISTER SHOP ====================
  async registerShop(userId, shopData, files) {
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
  async getAllShops(trangThai) {
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

  async getShopById(shopId) {
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

  async updateShop(shopId, { tenCuaHang, diaChi, soDienThoai, trangThai }) {
    const shop = await CuaHang.findByPk(shopId);
    if (!shop) {
      throw new Error("Shop not found");
    }

    await shop.update({ tenCuaHang, diaChi, soDienThoai, trangThai });
    return shop;
  }

  async deleteShop(shopId) {
    const shop = await CuaHang.findByPk(shopId);
    if (!shop) {
      throw new Error("Shop not found");
    }

    await shop.destroy();
    return { message: "Shop deleted" };
  }

  async approveShop(shopId) {
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

  async rejectShop(shopId) {
    const shop = await CuaHang.findByPk(shopId);
    if (!shop) {
      throw new Error("Shop not found");
    }

    await shop.update({ trangThai: "BI_KHOA" });
    return shop;
  }

  // ==================== OWNER - SHOP INFO ====================
  async getShopInfo(userId) {
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

  async updateShopInfo(userId, { tenCuaHang, diaChi, soDienThoai, moTa, kinhDo, viDo }) {
    const user = await NguoiDung.findByPk(userId);
    if (!user || !user.maCuaHang) {
      throw new Error("Shop not found");
    }

    const shop = await CuaHang.findByPk(user.maCuaHang);
    if (!shop) {
      throw new Error("Shop not found");
    }

    await shop.update({ tenCuaHang, diaChi, soDienThoai, moTa, kinhDo, viDo });
    return shop;
  }

  // ==================== PUBLIC - SHOP LISTING ====================
  async getPublicShops() {
    const shops = await CuaHang.findAll({
      where: { trangThai: "HOAT_DONG" },
      attributes: ["maCuaHang", "tenCuaHang", "diaChi", "soDienThoai", "moTa", "anhCuaHang", "kinhDo", "viDo"],
      order: [["tenCuaHang", "ASC"]],
    });

    return shops;
  }

  async getShopProfile(shopId) {
    const shop = await CuaHang.findByPk(shopId, {
      where: { trangThai: "HOAT_DONG" },
      attributes: ["maCuaHang", "tenCuaHang", "diaChi", "soDienThoai", "moTa", "anhCuaHang", "kinhDo", "viDo"],
    });

    if (!shop) {
      throw new Error("Shop not found");
    }

    return shop;
  }

  async getShopCustomers(userId) {
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
}

module.exports = new ShopService();
