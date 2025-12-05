-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: QuanLyThuCung
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `calamviec`
--

DROP TABLE IF EXISTS `calamviec`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calamviec` (
  `maCa` int NOT NULL AUTO_INCREMENT,
  `tenCa` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gioBatDau` time NOT NULL,
  `gioKetThuc` time NOT NULL,
  PRIMARY KEY (`maCa`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calamviec`
--

LOCK TABLES `calamviec` WRITE;
/*!40000 ALTER TABLE `calamviec` DISABLE KEYS */;
INSERT INTO `calamviec` VALUES (1,'Ca sáng','08:00:00','12:00:00'),(2,'Ca chiều','13:00:00','17:00:00'),(3,'Ca tối','18:00:00','22:00:00');
/*!40000 ALTER TABLE `calamviec` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuahang`
--

DROP TABLE IF EXISTS `cuahang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuahang` (
  `maCuaHang` int NOT NULL AUTO_INCREMENT,
  `tenCuaHang` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `diaChi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `soDienThoai` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `moTa` text COLLATE utf8mb4_unicode_ci,
  `nguoiDaiDien` int DEFAULT NULL,
  `giayPhepKD` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cccdMatTruoc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cccdMatSau` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `anhCuaHang` text COLLATE utf8mb4_unicode_ci,
  `kinhDo` decimal(10,6) DEFAULT NULL,
  `viDo` decimal(10,6) DEFAULT NULL,
  `trangThai` enum('CHO_DUYET','HOAT_DONG','BI_KHOA') COLLATE utf8mb4_unicode_ci DEFAULT 'CHO_DUYET',
  `ngayTao` datetime DEFAULT NULL,
  PRIMARY KEY (`maCuaHang`),
  KEY `fk_cua_hang_nguoi_dai_dien` (`nguoiDaiDien`),
  CONSTRAINT `fk_cua_hang_nguoi_dai_dien` FOREIGN KEY (`nguoiDaiDien`) REFERENCES `nguoidung` (`maNguoiDung`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuahang`
--

LOCK TABLES `cuahang` WRITE;
/*!40000 ALTER TABLE `cuahang` DISABLE KEYS */;
INSERT INTO `cuahang` VALUES (1,'Thien','d','0934893834','dsd',2,'uploads\\1764760917804-Screenshot 2025-11-29 112211.png','uploads\\1764760917815-Screenshot 2025-11-29 112144.png','uploads\\1764760917826-Screenshot 2025-11-28 171350.png','uploads\\1764760917839-Screenshot 2025-11-29 112144.png',123.000000,18.000000,'CHO_DUYET','2025-12-03 11:21:57'),(2,'Cửa hàng 2','222 Ngô Quyền','0973821922','Mới mở',3,'/uploads/1764827541012-Screenshot 2025-11-26 214913.png','/uploads/1764827541027-Screenshot 2025-11-25 110634.png','/uploads/1764827541044-Screenshot 2025-11-25 110634.png','/uploads/1764827541053-Screenshot 2025-11-25 194026.png',111.000000,11.000000,'HOAT_DONG','2025-12-04 05:52:21'),(3,'Cửa hàng 3','Trần Phú','0943834344','1',4,'/uploads/Screenshot_2025_11_26_141115-1764836890104-311852345.png','/uploads/Screenshot_2025_11_26_145606-1764836890114-823387079.png','/uploads/Screenshot_2025_11_26_142553-1764836890120-580725794.png','/uploads/Screenshot_2025_11_24_230848-1764836890125-516777129.png',111.000000,11.000000,'HOAT_DONG','2025-12-04 08:28:10'),(4,'Cửa hàng 4','Hoà Vang','0934746373','gg',5,'/uploads/dog-1764840968285-499772439.jpg','/uploads/1-1764840968285-269227337.jpg','/uploads/dog3-1764840968288-992398115.jpg','/uploads/cr7-1764840968293-410960654.jpg',111.000000,44.000000,'HOAT_DONG','2025-12-04 09:36:08');
/*!40000 ALTER TABLE `cuahang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danhgia`
--

DROP TABLE IF EXISTS `danhgia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `danhgia` (
  `maDanhGia` int NOT NULL AUTO_INCREMENT,
  `maChiTietLichHen` int NOT NULL,
  `soSao` tinyint NOT NULL,
  `binhLuan` text COLLATE utf8mb4_unicode_ci,
  `ngayDanhGia` datetime DEFAULT NULL,
  PRIMARY KEY (`maDanhGia`),
  UNIQUE KEY `maChiTietLichHen` (`maChiTietLichHen`),
  CONSTRAINT `fk_danh_gia_chi_tiet_lich_hen` FOREIGN KEY (`maChiTietLichHen`) REFERENCES `lichhenchitiet` (`maChiTietLichHen`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danhgia`
--

LOCK TABLES `danhgia` WRITE;
/*!40000 ALTER TABLE `danhgia` DISABLE KEYS */;
/*!40000 ALTER TABLE `danhgia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dexuatdichvu`
--

DROP TABLE IF EXISTS `dexuatdichvu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dexuatdichvu` (
  `maDeXuat` int NOT NULL AUTO_INCREMENT,
  `maCuaHang` int NOT NULL,
  `tenDichVu` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `moTa` text COLLATE utf8mb4_unicode_ci,
  `gia` decimal(10,2) DEFAULT NULL,
  `trangThai` enum('CHO_DUYET','DA_DUYET','TU_CHOI') COLLATE utf8mb4_unicode_ci DEFAULT 'CHO_DUYET',
  `lyDoTuChoi` text COLLATE utf8mb4_unicode_ci,
  `maQuanTriVien` int DEFAULT NULL,
  `ngayGui` datetime DEFAULT NULL,
  `ngayDuyet` datetime DEFAULT NULL,
  PRIMARY KEY (`maDeXuat`),
  KEY `fk_de_xuat_dich_vu_cua_hang` (`maCuaHang`),
  KEY `fk_de_xuat_dich_vu_quan_tri_vien` (`maQuanTriVien`),
  CONSTRAINT `fk_de_xuat_dich_vu_cua_hang` FOREIGN KEY (`maCuaHang`) REFERENCES `cuahang` (`maCuaHang`),
  CONSTRAINT `fk_de_xuat_dich_vu_quan_tri_vien` FOREIGN KEY (`maQuanTriVien`) REFERENCES `nguoidung` (`maNguoiDung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dexuatdichvu`
--

LOCK TABLES `dexuatdichvu` WRITE;
/*!40000 ALTER TABLE `dexuatdichvu` DISABLE KEYS */;
/*!40000 ALTER TABLE `dexuatdichvu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dichvucuashop`
--

DROP TABLE IF EXISTS `dichvucuashop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dichvucuashop` (
  `maDichVuShop` int NOT NULL AUTO_INCREMENT,
  `maDichVuHeThong` int NOT NULL,
  `maCuaHang` int NOT NULL,
  `gia` decimal(10,2) NOT NULL,
  `trangThai` tinyint DEFAULT '1',
  PRIMARY KEY (`maDichVuShop`),
  UNIQUE KEY `dich_vu_cua_shop_ma_cua_hang_ma_dich_vu_he_thong` (`maCuaHang`,`maDichVuHeThong`),
  KEY `fk_dich_vu_cua_shop_dich_vu_he_thong` (`maDichVuHeThong`),
  CONSTRAINT `fk_dich_vu_cua_shop_cua_hang` FOREIGN KEY (`maCuaHang`) REFERENCES `cuahang` (`maCuaHang`),
  CONSTRAINT `fk_dich_vu_cua_shop_dich_vu_he_thong` FOREIGN KEY (`maDichVuHeThong`) REFERENCES `dichvuhethong` (`maDichVu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dichvucuashop`
--

LOCK TABLES `dichvucuashop` WRITE;
/*!40000 ALTER TABLE `dichvucuashop` DISABLE KEYS */;
/*!40000 ALTER TABLE `dichvucuashop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dichvuhethong`
--

DROP TABLE IF EXISTS `dichvuhethong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dichvuhethong` (
  `maDichVu` int NOT NULL AUTO_INCREMENT,
  `tenDichVu` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `moTa` text COLLATE utf8mb4_unicode_ci,
  `thoiLuong` int DEFAULT NULL,
  `trangThai` tinyint DEFAULT '1',
  PRIMARY KEY (`maDichVu`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dichvuhethong`
--

LOCK TABLES `dichvuhethong` WRITE;
/*!40000 ALTER TABLE `dichvuhethong` DISABLE KEYS */;
INSERT INTO `dichvuhethong` VALUES (1,'Tắm rửa','Dịch vụ tắm rửa cho thú cưng',30,1),(2,'Cắt tỉa lông','Cắt tỉa lông thẩm mỹ',45,1),(3,'Khám sức khỏe','Khám bệnh cơ bản',60,1),(4,'Trông giữ','Gửi thú cưng qua ngày',1440,1),(5,'Huấn luyện','Huấn luyện cơ bản',120,1);
/*!40000 ALTER TABLE `dichvuhethong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goithanhtoan`
--

DROP TABLE IF EXISTS `goithanhtoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goithanhtoan` (
  `maGoi` int NOT NULL AUTO_INCREMENT,
  `tenGoi` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `soTien` decimal(12,2) NOT NULL,
  `thoiGian` int NOT NULL,
  PRIMARY KEY (`maGoi`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goithanhtoan`
--

LOCK TABLES `goithanhtoan` WRITE;
/*!40000 ALTER TABLE `goithanhtoan` DISABLE KEYS */;
INSERT INTO `goithanhtoan` VALUES (1,'Cơ bản',100000.00,1),(2,'Nâng cao',250000.00,3),(3,'VIP',500000.00,6);
/*!40000 ALTER TABLE `goithanhtoan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hosonhanvien`
--

DROP TABLE IF EXISTS `hosonhanvien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hosonhanvien` (
  `maHoSo` int NOT NULL AUTO_INCREMENT,
  `maNguoiDung` int NOT NULL,
  `kinhNghiem` int DEFAULT '0',
  `chungChi` text COLLATE utf8mb4_unicode_ci,
  `ngayVaoLam` date DEFAULT NULL,
  `ghiChu` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`maHoSo`),
  KEY `fk_ho_so_nhan_vien_nguoi_dung` (`maNguoiDung`),
  CONSTRAINT `fk_ho_so_nhan_vien_nguoi_dung` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidung` (`maNguoiDung`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hosonhanvien`
--

LOCK TABLES `hosonhanvien` WRITE;
/*!40000 ALTER TABLE `hosonhanvien` DISABLE KEYS */;
INSERT INTO `hosonhanvien` VALUES (1,21,1,'','2025-12-04',NULL);
/*!40000 ALTER TABLE `hosonhanvien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lichhen`
--

DROP TABLE IF EXISTS `lichhen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lichhen` (
  `maLichHen` int NOT NULL AUTO_INCREMENT,
  `maCuaHang` int NOT NULL,
  `maKhachHang` int NOT NULL,
  `maNhanVien` int DEFAULT NULL,
  `ngayHen` datetime NOT NULL,
  `tongTien` decimal(15,2) DEFAULT '0.00',
  `trangThai` enum('CHO_XAC_NHAN','DA_XAC_NHAN','DANG_THUC_HIEN','HOAN_THANH','HUY') COLLATE utf8mb4_unicode_ci DEFAULT 'CHO_XAC_NHAN',
  `ghiChu` text COLLATE utf8mb4_unicode_ci,
  `phuongThucThanhToan` enum('TIEN_MAT','CHUYEN_KHOAN','THE','KHAC') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trangThaiThanhToan` enum('CHUA_THANH_TOAN','DA_THANH_TOAN','HOAN_TIEN') COLLATE utf8mb4_unicode_ci DEFAULT 'CHUA_THANH_TOAN',
  `ngayThanhToan` datetime DEFAULT NULL,
  `ngayTao` datetime DEFAULT NULL,
  PRIMARY KEY (`maLichHen`),
  KEY `fk_lich_hen_cua_hang` (`maCuaHang`),
  KEY `fk_lich_hen_khach_hang` (`maKhachHang`),
  KEY `fk_lich_hen_nhan_vien` (`maNhanVien`),
  CONSTRAINT `fk_lich_hen_cua_hang` FOREIGN KEY (`maCuaHang`) REFERENCES `cuahang` (`maCuaHang`),
  CONSTRAINT `fk_lich_hen_khach_hang` FOREIGN KEY (`maKhachHang`) REFERENCES `nguoidung` (`maNguoiDung`),
  CONSTRAINT `fk_lich_hen_nhan_vien` FOREIGN KEY (`maNhanVien`) REFERENCES `nguoidung` (`maNguoiDung`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lichhen`
--

LOCK TABLES `lichhen` WRITE;
/*!40000 ALTER TABLE `lichhen` DISABLE KEYS */;
/*!40000 ALTER TABLE `lichhen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lichhenchitiet`
--

DROP TABLE IF EXISTS `lichhenchitiet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lichhenchitiet` (
  `maChiTietLichHen` int NOT NULL AUTO_INCREMENT,
  `maLichHenThuCung` int NOT NULL,
  `maDichVuCuaShop` int NOT NULL,
  `gia` decimal(10,2) NOT NULL,
  PRIMARY KEY (`maChiTietLichHen`),
  KEY `fk_lich_hen_chi_tiet_lich_hen_thu_cung` (`maLichHenThuCung`),
  KEY `fk_lich_hen_chi_tiet_dich_vu_cua_shop` (`maDichVuCuaShop`),
  CONSTRAINT `fk_lich_hen_chi_tiet_dich_vu_cua_shop` FOREIGN KEY (`maDichVuCuaShop`) REFERENCES `dichvucuashop` (`maDichVuShop`),
  CONSTRAINT `fk_lich_hen_chi_tiet_lich_hen_thu_cung` FOREIGN KEY (`maLichHenThuCung`) REFERENCES `lichhenthucung` (`maLichHenThuCung`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lichhenchitiet`
--

LOCK TABLES `lichhenchitiet` WRITE;
/*!40000 ALTER TABLE `lichhenchitiet` DISABLE KEYS */;
/*!40000 ALTER TABLE `lichhenchitiet` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `capNhatTongTienLichHen` AFTER INSERT ON `lichhenchitiet` FOR EACH ROW BEGIN
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
      END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `capNhatTongTienSauUpdate` AFTER UPDATE ON `lichhenchitiet` FOR EACH ROW BEGIN
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
      END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `capNhatTongTienSauDelete` AFTER DELETE ON `lichhenchitiet` FOR EACH ROW BEGIN
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
      END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `lichhenthucung`
--

DROP TABLE IF EXISTS `lichhenthucung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lichhenthucung` (
  `maLichHenThuCung` int NOT NULL AUTO_INCREMENT,
  `maLichHen` int NOT NULL,
  `maLoai` int NOT NULL,
  `ten` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tuoi` int DEFAULT NULL,
  `anhThuCung` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dacDiem` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`maLichHenThuCung`),
  KEY `fk_lich_hen_thu_cung_lich_hen` (`maLichHen`),
  KEY `fk_lich_hen_thu_cung_loai` (`maLoai`),
  CONSTRAINT `fk_lich_hen_thu_cung_lich_hen` FOREIGN KEY (`maLichHen`) REFERENCES `lichhen` (`maLichHen`) ON DELETE CASCADE,
  CONSTRAINT `fk_lich_hen_thu_cung_loai` FOREIGN KEY (`maLoai`) REFERENCES `loaithucung` (`maLoai`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lichhenthucung`
--

LOCK TABLES `lichhenthucung` WRITE;
/*!40000 ALTER TABLE `lichhenthucung` DISABLE KEYS */;
/*!40000 ALTER TABLE `lichhenthucung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loaithucung`
--

DROP TABLE IF EXISTS `loaithucung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loaithucung` (
  `maLoai` int NOT NULL AUTO_INCREMENT,
  `tenLoai` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`maLoai`),
  UNIQUE KEY `tenLoai` (`tenLoai`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loaithucung`
--

LOCK TABLES `loaithucung` WRITE;
/*!40000 ALTER TABLE `loaithucung` DISABLE KEYS */;
INSERT INTO `loaithucung` VALUES (6,'Bò sát'),(4,'Cá'),(3,'Chim'),(1,'Chó'),(2,'Mèo'),(5,'Thỏ');
/*!40000 ALTER TABLE `loaithucung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nguoidung`
--

DROP TABLE IF EXISTS `nguoidung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nguoidung` (
  `maNguoiDung` int NOT NULL AUTO_INCREMENT,
  `hoTen` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `matKhau` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `soDienThoai` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `diaChi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `maVaiTro` int NOT NULL,
  `maCuaHang` int DEFAULT NULL,
  `trangThai` tinyint DEFAULT '1',
  `ngayTao` datetime DEFAULT NULL,
  PRIMARY KEY (`maNguoiDung`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_nguoi_dung_vai_tro` (`maVaiTro`),
  KEY `fk_nguoi_dung_cua_hang` (`maCuaHang`),
  CONSTRAINT `fk_nguoi_dung_cua_hang` FOREIGN KEY (`maCuaHang`) REFERENCES `cuahang` (`maCuaHang`) ON DELETE SET NULL,
  CONSTRAINT `fk_nguoi_dung_vai_tro` FOREIGN KEY (`maVaiTro`) REFERENCES `vaitro` (`maVaiTro`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nguoidung`
--

LOCK TABLES `nguoidung` WRITE;
/*!40000 ALTER TABLE `nguoidung` DISABLE KEYS */;
INSERT INTO `nguoidung` VALUES (1,'Admin User','admin@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','0123456789','Da Nang',NULL,2,NULL,1,NULL),(2,'Customer 1','customer1@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','0901000000','Address 1, Da Nang',NULL,3,1,1,NULL),(3,'Customer 2','customer2@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','0902000000','Address 2, Da Nang',NULL,3,2,1,NULL),(4,'Customer 3','customer3@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','0903000000','Address 3, Da Nang',NULL,3,3,1,NULL),(5,'Customer 4','customer4@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','0904000000','Address 4, Da Nang',NULL,1,4,1,NULL),(6,'Customer 5','customer5@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','0905000000','Address 5, Da Nang',NULL,1,NULL,1,NULL),(7,'Customer 6','customer6@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','0906000000','Address 6, Da Nang',NULL,1,NULL,1,NULL),(8,'Customer 7','customer7@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','0907000000','Address 7, Da Nang',NULL,1,NULL,1,NULL),(9,'Customer 8','customer8@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','0908000000','Address 8, Da Nang',NULL,1,NULL,1,NULL),(10,'Customer 9','customer9@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','0909000000','Address 9, Da Nang',NULL,1,NULL,1,NULL),(11,'Customer 10','customer10@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','09010000000','Address 10, Da Nang',NULL,1,NULL,1,NULL),(12,'Owner 1','owner1@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','0911000000','Shop Address 1',NULL,3,NULL,1,NULL),(13,'Owner 2','owner2@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','0912000000','Shop Address 2',NULL,3,NULL,1,NULL),(14,'Owner 3','owner3@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','0913000000','Shop Address 3',NULL,3,NULL,1,NULL),(15,'Receptionist 1','receptionist1@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','0921000000','Staff Address 1',NULL,4,NULL,1,NULL),(16,'Receptionist 2','receptionist2@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','0922000000','Staff Address 2',NULL,4,NULL,1,NULL),(17,'Receptionist 3','receptionist3@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','0923000000','Staff Address 3',NULL,4,NULL,1,NULL),(18,'Technician 1','technician1@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','0931000000','Staff Address 4',NULL,5,NULL,1,NULL),(19,'Technician 2','technician2@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','0932000000','Staff Address 5',NULL,5,NULL,1,NULL),(20,'Technician 3','technician3@example.com','$2b$10$9t8hosFwcroKQ1oV1MzhgezgOoN6rNhgMaBF1nn/pCFa50omfHnTi','0933000000','Staff Address 6',NULL,5,NULL,1,NULL),(21,'Trần Thị Như','nhanvien1shop2@example.com','$2b$10$ml0BJPPBm7S9O5IcCN9bPe./LekYwoxpMHis7XSX/TUxzbUB9s3j2','0947353123',NULL,NULL,2,2,1,'2025-12-04 06:19:23');
/*!40000 ALTER TABLE `nguoidung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20251203103907-create-vai-tro.js'),('20251203105305-create-loai-thu-cung.js'),('20251203105331-create-goi-thanh-toan.js'),('20251203105351-create-cua-hang.js'),('20251203105431-create-nguoi-dung.js'),('20251203105454-add-fk-cua-hang.js'),('20251203105517-create-ho-so-nhan-vien.js'),('20251203105539-create-dich-vu-he-thong.js'),('20251203105555-create-dich-vu-cua-shop.js'),('20251203105612-create-de-xuat-dich-vu.js'),('20251203105628-create-lich-hen.js'),('20251203105647-create-lich-hen-thu-cung.js'),('20251203105704-create-lich-hen-chi-tiet.js'),('20251203105722-create-ca-lam-viec.js'),('20251203105744-create-thong-bao.js'),('20251203105801-create-thanh-toan-shop.js'),('20251203105817-create-danh-gia.js'),('20251203105833-create-triggers.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thanhtoanshop`
--

DROP TABLE IF EXISTS `thanhtoanshop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thanhtoanshop` (
  `maThanhToan` int NOT NULL AUTO_INCREMENT,
  `maCuaHang` int NOT NULL,
  `maGoi` int NOT NULL,
  `soTien` decimal(12,2) NOT NULL,
  `thoiGianBatDau` date NOT NULL,
  `thoiGianKetThuc` date NOT NULL,
  `trangThai` enum('DA_THANH_TOAN','CHUA_THANH_TOAN','QUA_HAN') COLLATE utf8mb4_unicode_ci DEFAULT 'CHUA_THANH_TOAN',
  `ngayTao` datetime DEFAULT NULL,
  PRIMARY KEY (`maThanhToan`),
  KEY `fk_thanh_toan_shop_cua_hang` (`maCuaHang`),
  KEY `fk_thanh_toan_shop_goi` (`maGoi`),
  CONSTRAINT `fk_thanh_toan_shop_cua_hang` FOREIGN KEY (`maCuaHang`) REFERENCES `cuahang` (`maCuaHang`),
  CONSTRAINT `fk_thanh_toan_shop_goi` FOREIGN KEY (`maGoi`) REFERENCES `goithanhtoan` (`maGoi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thanhtoanshop`
--

LOCK TABLES `thanhtoanshop` WRITE;
/*!40000 ALTER TABLE `thanhtoanshop` DISABLE KEYS */;
/*!40000 ALTER TABLE `thanhtoanshop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thongbao`
--

DROP TABLE IF EXISTS `thongbao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thongbao` (
  `maThongBao` int NOT NULL AUTO_INCREMENT,
  `maNguoiDung` int NOT NULL,
  `tieuDe` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `noiDung` text COLLATE utf8mb4_unicode_ci,
  `loaiThongBao` enum('DON_HANG','HE_THONG','KHAC') COLLATE utf8mb4_unicode_ci DEFAULT 'KHAC',
  `daXem` tinyint DEFAULT '0',
  `ngayGui` datetime DEFAULT NULL,
  PRIMARY KEY (`maThongBao`),
  KEY `fk_thong_bao_nguoi_dung` (`maNguoiDung`),
  CONSTRAINT `fk_thong_bao_nguoi_dung` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidung` (`maNguoiDung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thongbao`
--

LOCK TABLES `thongbao` WRITE;
/*!40000 ALTER TABLE `thongbao` DISABLE KEYS */;
/*!40000 ALTER TABLE `thongbao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vaitro`
--

DROP TABLE IF EXISTS `vaitro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vaitro` (
  `maVaiTro` int NOT NULL AUTO_INCREMENT,
  `tenVaiTro` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`maVaiTro`),
  UNIQUE KEY `tenVaiTro` (`tenVaiTro`),
  UNIQUE KEY `idx_vai_tro_ten` (`tenVaiTro`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vaitro`
--

LOCK TABLES `vaitro` WRITE;
/*!40000 ALTER TABLE `vaitro` DISABLE KEYS */;
INSERT INTO `vaitro` VALUES (3,'CHU_CUA_HANG'),(1,'KHACH_HANG'),(5,'KY_THUAT_VIEN'),(4,'LE_TAN'),(2,'QUAN_TRI_VIEN');
/*!40000 ALTER TABLE `vaitro` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-05 11:09:05
