"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    // Trigger 1
    await queryInterface.sequelize.query(`
      CREATE TRIGGER capNhatTongTienLichHen
      AFTER INSERT ON LichHenChiTiet
      FOR EACH ROW
      BEGIN
        DECLARE ma_lich_hen INT;
        SELECT maLichHen INTO ma_lich_hen FROM LichHenThuCung WHERE maLichHenThuCung = NEW.maLichHenThuCung;
        UPDATE LichHen
        SET tongTien = (
          SELECT SUM(lhct.gia)
          FROM LichHenChiTiet lhct
          JOIN LichHenThuCung lhtc ON lhct.maLichHenThuCung = lhtc.maLichHenThuCung
          WHERE lhtc.maLichHen = ma_lich_hen
        )
        WHERE maLichHen = ma_lich_hen;
      END
    `);

    // Trigger 2
    await queryInterface.sequelize.query(`
      CREATE TRIGGER capNhatTongTienSauUpdate
      AFTER UPDATE ON LichHenChiTiet
      FOR EACH ROW
      BEGIN
        DECLARE ma_lich_hen INT;
        SELECT maLichHen INTO ma_lich_hen FROM LichHenThuCung WHERE maLichHenThuCung = NEW.maLichHenThuCung;
        UPDATE LichHen
        SET tongTien = (
          SELECT SUM(lhct.gia)
          FROM LichHenChiTiet lhct
          JOIN LichHenThuCung lhtc ON lhct.maLichHenThuCung = lhtc.maLichHenThuCung
          WHERE lhtc.maLichHen = ma_lich_hen
        )
        WHERE maLichHen = ma_lich_hen;
      END
    `);

    // Trigger 3
    await queryInterface.sequelize.query(`
      CREATE TRIGGER capNhatTongTienSauDelete
      AFTER DELETE ON LichHenChiTiet
      FOR EACH ROW
      BEGIN
        DECLARE ma_lich_hen INT;
        SELECT maLichHen INTO ma_lich_hen FROM LichHenThuCung WHERE maLichHenThuCung = OLD.maLichHenThuCung;
        UPDATE LichHen
        SET tongTien = (
          SELECT SUM(lhct.gia)
          FROM LichHenChiTiet lhct
          JOIN LichHenThuCung lhtc ON lhct.maLichHenThuCung = lhtc.maLichHenThuCung
          WHERE lhtc.maLichHen = ma_lich_hen
        )
        WHERE maLichHen = ma_lich_hen;
      END
    `);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "DROP TRIGGER IF EXISTS capNhatTongTienLichHen;"
    );
    await queryInterface.sequelize.query(
      "DROP TRIGGER IF EXISTS capNhatTongTienSauUpdate;"
    );
    await queryInterface.sequelize.query(
      "DROP TRIGGER IF EXISTS capNhatTongTienSauDelete;"
    );
  },
};
