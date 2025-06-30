-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: doan
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `banner`
--

DROP TABLE IF EXISTS `banner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banner` (
  `id` int NOT NULL AUTO_INCREMENT,
  `images` varchar(45) NOT NULL,
  `created_at` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banner`
--

LOCK TABLES `banner` WRITE;
/*!40000 ALTER TABLE `banner` DISABLE KEYS */;
INSERT INTO `banner` VALUES (8,'163316.jpeg','2025-05-20 10:18:05'),(9,'896878.jpeg','2025-05-20 10:17:11');
/*!40000 ALTER TABLE `banner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cart_id` (`cart_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`),
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (1,1,1,2),(2,1,4,5),(72,5,1,1),(73,5,2,1);
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,2,'2025-04-15 23:59:53'),(5,4,'2025-05-24 15:41:40');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `images` varchar(45) NOT NULL,
  `role` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Đồ gia đình','2025-05-18 22:48:23','dogiading.jpg',1),(2,'Đồ uống đóng chai','2025-04-15 23:59:53','dongchai.jpg',1),(3,'Thực phẩm khô','2025-04-15 23:59:53','dokho.jpg',1),(4,'Vệ sinh cá nhân','2025-04-15 23:59:53','dovesinh.jpg',1),(5,'Đồ ăn lạnh','2025-04-15 23:59:53','dolanh.jpg',1),(8,'Hlo','2025-05-24 00:23:46','506389',0);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
INSERT INTO `conversations` VALUES (14,3),(19,4);
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `productid` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (6,4,1,'2025-05-23 20:48:41');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int DEFAULT NULL,
  `productid` int DEFAULT NULL,
  `images` varchar(45) DEFAULT NULL,
  `star` int NOT NULL,
  `feedback` varchar(45) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,4,1,'613330.jpeg',5,'Ffc','2025-05-18 23:21:47'),(2,4,2,'613330.jpeg',5,'Ffc','2025-05-18 23:21:47');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conversation_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `role` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (5,9,4,'Hello','2025-05-24 17:40:30',NULL),(6,9,4,'gì','2025-05-24 17:49:33',NULL),(7,9,4,'hellko','2025-05-24 17:51:12',NULL),(8,9,1,'cáip','2025-05-24 18:14:05',1),(9,9,NULL,'hello','2025-05-24 18:23:57',1),(10,9,4,'adu','2025-05-24 18:27:03',1),(11,9,1,'cái giò','2025-05-24 18:30:53',1),(12,12,4,'helloo','2025-05-24 18:35:38',NULL),(13,13,4,'hế lo fen','2025-05-24 18:38:06',NULL),(14,13,1,'Sao v fen','2025-05-24 18:38:35',1),(15,13,4,'Tôi có chuyện muốn nói','2025-05-24 18:40:11',NULL),(16,13,1,'nói đi','2025-05-24 18:40:25',1),(17,13,1,'nhanh','2025-05-24 18:40:31',1),(18,13,1,'d','2025-05-24 18:40:45',1),(19,13,1,'dồpd','2025-05-24 18:40:47',1),(20,13,1,'d','2025-05-24 18:40:47',1),(21,13,1,'d','2025-05-24 18:40:48',1),(22,13,1,'d','2025-05-24 18:40:56',1),(23,13,1,'h','2025-05-24 18:41:52',1),(24,14,3,'Hello','2025-05-24 18:43:17',NULL),(25,14,1,'hello cc','2025-05-24 18:48:23',1),(26,13,1,'d','2025-05-24 18:59:33',1),(27,16,4,'d','2025-05-24 19:07:34',NULL),(28,18,1,'Xin chào bạn! Cảm ơn bạn đã liên hệ với NineMart – bạn cần hỗ trợ gì hôm nay ạ? ?','2025-05-24 19:16:35',1),(29,19,1,'Xin chào bạn! Cảm ơn bạn đã liên hệ với NineMart – bạn cần hỗ trợ gì hôm nay ạ? ?','2025-05-24 19:16:54',1);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` int DEFAULT NULL,
  `discount` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (18,13,1,7,196000,NULL),(19,13,2,2,90000,NULL),(20,14,4,4,18000,NULL),(21,14,3,4,24000,NULL),(22,15,1,2,56000,NULL),(23,15,2,2,90000,NULL),(24,16,1,4,112000,NULL),(25,16,2,5,225000,NULL),(27,18,2,1,45000,NULL),(28,19,1,1,28000,NULL),(29,20,1,1,28000,NULL),(30,21,6,10,100000,NULL),(31,22,7,4,200000,NULL),(32,23,2,1,45000,NULL),(34,24,14,1,500000,NULL),(40,27,11,1,10000,20),(41,28,6,1,10000,20),(45,30,14,2,1000000,20),(47,31,14,2,1000000,20),(49,33,1,1,28000,0),(50,34,1,1,28000,15),(51,35,1,1,28000,15),(52,37,1,1,28000,15),(53,37,2,1,45000,15),(54,38,4,4,18000,15),(55,39,1,1,28000,15),(56,40,2,1,45000,0),(57,41,1,1,28000,0),(58,42,1,1,28000,0),(59,44,1,1,28000,0);
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `payment_type` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (13,4,'Delivered',286000.00,'TienMat','2025-03-18 21:54:24'),(14,4,'Delivered',42000.00,'ViDienTu','2025-05-18 21:54:38'),(15,4,'Delivered',146000.00,'TienMat','2025-04-18 21:57:46'),(16,4,'Delivered',337000.00,'TienMat','2025-05-18 21:59:45'),(18,4,'Canceled',45000.00,'TienMat','2025-05-18 22:49:28'),(19,4,'Delivered',28000.00,'TienMat','2025-05-20 00:35:24'),(20,4,'Delivered',22400.00,'ViDienTu','2025-05-20 01:07:14'),(21,4,'Delivered',80000.00,'TienMat','2025-05-20 01:12:40'),(22,4,'Delivered',160000.00,'TienMat','2025-05-20 01:20:54'),(23,4,'Delivered',45000.00,'TienMat','2025-05-20 01:21:15'),(24,4,'Canceled',500000.00,'TienMat','2025-05-20 01:23:37'),(27,4,'Delivered',8000.00,'TienMat','2025-05-20 13:52:08'),(28,4,'Ordered',8000.00,'TienMat','2025-05-20 13:56:32'),(30,4,'Canceled',704000.00,'TienMat','2025-05-23 21:19:30'),(31,4,'Ordered',800000.00,'TienMat','2025-05-23 21:21:17'),(33,4,'Ordered',28000.00,'CreditCard','2025-05-24 14:50:35'),(34,4,'Ordered',23800.00,'CreditCard','2025-05-24 15:08:15'),(35,4,'Ordered',23800.00,'NinePay','2025-05-24 15:08:41'),(36,4,'Delivered',23800.00,'COD','2025-05-24 15:08:57'),(37,4,'Delivered',62050.00,'CreditCard','2025-05-24 15:18:34'),(38,4,'Ordered',15300.00,'NinePay','2025-05-24 16:13:42'),(39,4,'Ordered',23800.00,'COD','2025-05-24 16:14:25'),(40,4,'Ordered',45000.00,'CreditCard','2025-05-24 16:15:41'),(41,4,'Ordered',28000.00,'COD','2025-05-24 16:16:58'),(42,4,'Ordered',28000.00,'COD','2025-05-24 16:24:59'),(43,4,'Ordered',28000.00,'COD','2025-05-24 16:25:16'),(44,4,'Ordered',28000.00,'COD','2025-05-24 16:25:28');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `images` text,
  `category_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Nước rửa chén Sunlight 750ml','Nước rửa chén Sunlight với công thức đậm đặc giúp đánh bay dầu mỡ, làm sạch mọi vết bẩn cứng đầu trên bát đĩa mà vẫn giữ cho da tay mềm mại, không bị khô ráp. Hương chanh tươi mát mang lại cảm giác dễ chịu sau mỗi lần rửa, giúp bếp luôn thơm tho sạch sẽ. Sản phẩm an toàn với sức khỏe và thân thiện với môi trường.',28000.00,'rua-chen.jpg',1,'2025-04-15 23:59:53','2025-05-20 22:58:46',1),(2,'Dầu ăn Tường An 1L','Dầu ăn Tường An được chiết xuất từ nguồn nguyên liệu thực vật tinh khiết, không chứa cholesterol, giúp bảo vệ sức khỏe tim mạch. Dầu có độ tinh khiết cao, màu sắc trong suốt, thích hợp cho mọi loại món ăn từ xào, rán đến trộn salad, giữ nguyên hương vị tự nhiên của thực phẩm.',45000.00,'dauan.jpg',1,'2025-04-15 23:59:53','2025-05-20 22:58:46',1),(3,'Nước suối Lavie 500ml','Nước suối Lavie là nguồn nước khoáng thiên nhiên được khai thác từ các nguồn nước ngầm sạch và tinh khiết, giàu khoáng chất cần thiết cho cơ thể. Đóng chai tiện lợi, phù hợp cho mọi hoạt động từ uống hằng ngày đến thể thao, du lịch, giúp bù nước nhanh chóng và cân bằng điện giải.',6000.00,'nuockhoang.jpg',2,'2025-04-15 23:59:53','2025-05-20 22:58:46',1),(4,'Mì gói Hảo Hảo tôm chua cay','Mì gói Hảo Hảo hương vị tôm chua cay đậm đà, thơm ngon, được chế biến từ bột mì chọn lọc cùng các gia vị tự nhiên. Gói 75g tiện lợi, dễ chế biến trong vòng vài phút, là lựa chọn nhanh gọn cho những bữa ăn nhẹ hoặc khi bạn cần một bữa ăn nóng hổi bất cứ lúc nào.',4500.00,'mitom.jpg',3,'2025-04-15 23:59:53','2025-05-20 22:58:46',1),(5,'Giấy vệ sinh Bless You (10 cuộn)','Giấy vệ sinh Bless You với cấu trúc 3 lớp dày dặn, mềm mại và thấm hút tốt, giúp bảo vệ làn da nhạy cảm. Sản phẩm được làm từ bột giấy nguyên chất, không chất tẩy trắng độc hại, an toàn cho người sử dụng và thân thiện với môi trường.',38000.00,'giay.jpg',4,'2025-04-15 23:59:53','2025-05-20 22:58:46',1),(6,'Kem ','Kem mát lạnh với đa dạng hương vị thơm ngon, từ socola, vani đến dâu tây, đem lại cảm giác giải nhiệt tuyệt vời trong những ngày hè oi bức. Kem được làm từ nguyên liệu tươi sạch, không chứa chất bảo quản độc hại, phù hợp cho cả trẻ em và người lớn.',10000.00,'kem.jpg',5,'2025-04-15 23:59:54','2025-05-20 22:58:46',1),(7,'ô mai','Ô mai được chế biến công phu từ các loại quả như mận, sấu, đào với hương vị chua, ngọt, mặn đậm đà đặc trưng. Sản phẩm có độ giòn vừa phải, không quá ngọt, là món ăn vặt hấp dẫn giúp giải nhiệt, kích thích tiêu hóa và cung cấp năng lượng nhanh.',50000.00,'omai.jpg',3,'2025-04-15 23:59:54','2025-05-20 22:58:46',1),(8,'Hạt điều','Hạt điều rang muối giòn tan, chất lượng cao, được chọn lọc kỹ càng từ những hạt điều nguyên vẹn, đảm bảo thơm ngon và bổ dưỡng. Hạt điều là nguồn cung cấp protein, chất béo tốt, cùng nhiều khoáng chất thiết yếu giúp tăng cường sức khỏe và năng lượng.',125000.00,'hat.jpg',3,'2025-04-15 23:59:54','2025-05-20 22:58:46',1),(9,'Rượu vang','Rượu vang cao cấp ủ trên 10 năm, có hương vị đậm đà, phức hợp các tầng hương trái cây chín mọng và gỗ sồi. Sản phẩm được sản xuất theo quy trình nghiêm ngặt, thích hợp cho các bữa tiệc sang trọng hoặc làm quà biếu ý nghĩa.',50000000.00,'ruou.jpg',2,'2025-04-15 23:59:54','2025-05-20 22:58:46',1),(10,'Cocacola','Nước ngọt có gas Cocacola nổi tiếng với hương vị sảng khoái, giúp giải nhiệt nhanh chóng và mang lại cảm giác tràn đầy năng lượng. Sản phẩm được đóng chai tiện lợi, phù hợp cho các bữa tiệc, hoạt động ngoài trời hoặc sinh hoạt hàng ngày.',15000.00,'coca.jpg',2,'2025-04-15 23:59:54','2025-05-20 22:58:46',1),(11,'Trà ô long','Nước ngọt,hương vị tự nhiên ,tươi mát',10000.00,'olong.jpg',2,'2025-04-20 22:24:55','2025-05-18 20:32:32',1),(12,'TH milk','Sữa chua TH, tốt cho đường ruột,mát lạnh',12000.00,'th.jpg',2,'2025-04-20 22:24:55','2025-05-18 20:32:32',1),(13,'Nồi cơm điện','Nồi cơm chất lượng cao,bền,tiết kiệm điện',2000000.00,'noicom.jpg',1,'2025-04-20 22:24:55','2025-05-18 20:32:32',1),(14,'Bát đũa','Bộ bát đũa sang trọng ,quý phái,bền,an toàn cho sức khỏe',500000.00,'bat.jpg',1,'2025-04-20 22:24:55','2025-05-18 20:32:32',1),(15,'Bàn chải đánh răng','Bộ bàn chải chất lượng cao,mềm mịn ,hợp mọi lứa tuổi',25000.00,'banchai.jpg',4,'2025-04-20 22:24:55','2025-05-18 20:32:32',1),(16,'Khăn tắm','khăn tắm lông cáo ,mềm mịn,chống nhăn,khô ',200000.00,'khan.jpg',4,'2025-04-20 22:24:55','2025-05-18 20:32:32',1),(17,'Sữa tắm','Sữa tắm hương thơm ngào ngặt,diệt khuẩn 100%,lưu hương lâu,an toàn cho mọi loại da',150000.00,'suatam.jpg',4,'2025-04-20 22:24:55','2025-05-18 20:32:32',1),(18,'Mứt khô','Mứt khô,thơm ,ngon ,bổ,làm từ các loại quả chất lượng cao',700000.00,'mut.jpg',3,'2025-04-20 22:24:55','2025-05-18 20:32:32',1),(19,'Cá hồi đông lạnh','Cá hồi đã chế biến,tươi,ngon,hàng nhập khẩu chất lượng cao',600000.00,'ca.jpg',5,'2025-04-20 22:24:55','2025-05-18 20:32:32',1),(20,'Viên nhúng lẩu đông lạnh','Viên nhúng các loại (cá ,tôm,mực),hàng chất lượng cao',25000.00,'vien.jpg',5,'2025-04-20 22:24:55','2025-05-18 20:32:32',1),(36,'Chổi quét nhà','Chổi quét nhà được làm từ chất liệu lông tổng hợp cao cấp, thiết kế nhỏ gọn, giúp bạn dễ dàng làm sạch mọi ngóc ngách trong nhà. Đầu chổi mềm mại, không làm trầy xước bề mặt sàn, tay cầm chắc chắn, phù hợp với mọi kích thước tay người dùng. Thích hợp dùng cho nhà bếp, phòng khách, hoặc sân vườn.',50000.00,'choiquetnha.jpg',1,'2025-05-19 10:00:00','2025-05-20 22:57:41',1),(37,'Xô nước nhựa','Xô nước nhựa dung tích 10 lít, sản xuất từ nhựa nguyên sinh an toàn, bền bỉ và dễ dàng vệ sinh. Thiết kế quai cầm tiện lợi giúp bạn di chuyển nước dễ dàng mà không lo bị tràn. Dùng cho nhiều mục đích trong gia đình như chứa nước, rửa chén, vệ sinh nhà cửa.',75000.00,'xonuanhua.jpg',1,'2025-05-19 10:05:00','2025-05-20 22:57:41',1),(38,'Nước suối đóng chai','Nước suối đóng chai tinh khiết, được lấy từ nguồn nước tự nhiên đảm bảo vệ sinh an toàn thực phẩm. Thích hợp dùng trong gia đình, văn phòng hoặc mang theo khi đi du lịch, dã ngoại. Đóng chai tiện lợi, giữ nguyên vị ngọt tự nhiên và các khoáng chất cần thiết cho cơ thể.',12000.00,'nuocsuoi.jpg',2,'2025-05-19 09:30:00','2025-05-20 22:57:41',1),(39,'Trà xanh đóng chai','Trà xanh đóng chai được chế biến từ những lá trà tươi ngon nhất, mang lại hương vị thanh mát, sảng khoái. Sản phẩm không chứa chất bảo quản, phù hợp với mọi đối tượng, giúp giải khát và cung cấp năng lượng nhanh chóng.',15000.00,'traxanh.jpg',2,'2025-05-19 09:45:00','2025-05-20 22:57:41',1),(40,'Bánh mì khô','Bánh mì khô được làm từ nguyên liệu lúa mì nguyên cám, qua quy trình sản xuất nghiêm ngặt giúp bánh giữ được độ giòn lâu và hương vị thơm ngon đặc trưng. Phù hợp dùng làm bữa ăn nhẹ hoặc kết hợp với các món ăn khác.',35000.00,'banhmikho.jpg',3,'2025-05-19 08:00:00','2025-05-20 22:57:41',1),(41,'Mứt hoa quả','Mứt hoa quả được làm từ các loại trái cây tươi ngon như dâu tây, xoài, cam, qua quá trình chế biến và bảo quản đúng tiêu chuẩn, giữ được vị ngọt tự nhiên, màu sắc bắt mắt và thơm ngon. Thích hợp dùng trong các bữa tiệc hoặc làm món ăn kèm.',45000.00,'muthoqua.jpg',3,'2025-05-19 08:15:00','2025-05-20 22:57:41',1),(42,'Kem đánh răng','Kem đánh răng với công thức đặc biệt giúp loại bỏ mảng bám, bảo vệ men răng và làm trắng răng hiệu quả. Thành phần an toàn, không gây kích ứng, mang lại hơi thở thơm mát lâu dài.',30000.00,'kemdanhrang.jpg',4,'2025-05-19 07:30:00','2025-05-20 22:57:41',1),(43,'Sữa tắm','Sữa tắm dưỡng ẩm, làm sạch nhẹ nhàng cho da, giúp da mềm mại, mịn màng sau mỗi lần sử dụng. Thành phần tự nhiên, không gây kích ứng, thích hợp cho mọi loại da, kể cả da nhạy cảm.',55000.00,'suatum.jpg',4,'2025-05-19 07:45:00','2025-05-20 22:57:41',1),(44,'Thịt nguội','Thịt nguội thơm ngon, được chế biến từ nguyên liệu thịt tươi sạch, qua quy trình chế biến hiện đại, giữ được hương vị đậm đà, thích hợp làm món ăn nhanh hoặc dùng trong các bữa ăn gia đình.',120000.00,'thitnguoi.jpg',5,'2025-05-19 06:50:00','2025-05-20 22:57:41',1),(45,'Pizza lạnh','Pizza lạnh đóng gói sẵn, dễ dàng bảo quản trong tủ lạnh, tiện lợi khi sử dụng. Được làm từ nguyên liệu tươi ngon, phô mai béo ngậy, bột bánh mềm mại, phù hợp cho bữa ăn nhanh hoặc tiệc nhẹ.',150000.00,'pizzalanh.jpg',5,'2025-05-19 07:00:00','2025-05-20 22:57:41',1),(46,'Giấy vệ sinh cao cấp','Giấy vệ sinh mềm mại, được làm từ bột giấy nguyên chất, thân thiện với môi trường và không gây kích ứng da. Đóng gói tiện lợi, phù hợp sử dụng cho gia đình và văn phòng.',40000.00,'giayvesinh.jpg',4,'2025-05-19 11:00:00','2025-05-20 22:57:41',1),(47,'Nước lau sàn','Nước lau sàn có khả năng làm sạch hiệu quả, khử mùi và diệt khuẩn, giữ cho sàn nhà luôn sáng bóng và thơm mát. An toàn cho mọi loại sàn, không gây trơn trượt.',65000.00,'nuoclausan.jpg',1,'2025-05-19 11:15:00','2025-05-20 22:57:41',1),(48,'Nước ngọt có gas','Nước ngọt có gas thơm ngon, sảng khoái, giúp giải nhiệt nhanh chóng trong những ngày hè oi bức. Đóng chai tiện lợi, phù hợp dùng trong các buổi tiệc và sinh hoạt hằng ngày.',18000.00,'nuocngot.jpg',2,'2025-05-19 11:30:00','2025-05-20 22:57:41',1),(49,'Mì gói ăn liền','Mì gói ăn liền đa dạng hương vị, chế biến nhanh chóng tiện lợi, là lựa chọn phổ biến cho các bữa ăn nhẹ hoặc khi bận rộn. Thành phần chất lượng, được kiểm định an toàn.',9000.00,'mi_goi.jpg',3,'2025-05-19 11:45:00','2025-05-20 22:57:41',1),(50,'Bột giặt','Bột giặt hiệu quả cao, dễ dàng làm sạch các vết bẩn cứng đầu trên quần áo, giữ màu sắc tươi mới và bảo vệ sợi vải. Phù hợp cho máy giặt và giặt tay.',75000.00,'botgiat.jpg',1,'2025-05-19 12:00:00','2025-05-20 22:57:41',1),(51,'Dung dịch rửa tay khô','Dung dịch rửa tay khô chứa cồn 70%, diệt khuẩn hiệu quả, tiện lợi sử dụng khi không có nước và xà phòng. Giữ cho tay bạn sạch sẽ và an toàn mọi lúc mọi nơi.',40000.00,'ruataykho.jpg',4,'2025-05-19 12:15:00','2025-05-20 22:57:41',1),(52,'Sữa chua uống','Sữa chua uống thơm ngon, giàu probiotic giúp hỗ trợ tiêu hóa, tăng cường sức đề kháng. Đóng chai tiện lợi, phù hợp dùng cho cả người lớn và trẻ em.',20000.00,'suachua.jpg',2,'2025-05-19 12:30:00','2025-05-20 22:57:41',1),(53,'Xúc xích','Xúc xích làm từ thịt heo và gia vị tự nhiên, được đóng gói và bảo quản nghiêm ngặt, thích hợp dùng làm món ăn nhanh hoặc làm topping cho các món ăn khác.',70000.00,'xucxich.jpg',5,'2025-05-19 12:45:00','2025-05-20 22:57:41',1),(54,'Sữa rửa mặt','Sữa rửa mặt dịu nhẹ, làm sạch sâu, loại bỏ bụi bẩn và dầu thừa trên da mà không gây khô căng. Thành phần tự nhiên giúp dưỡng ẩm và bảo vệ làn da nhạy cảm.',85000.00,'surumat.jpg',4,'2025-05-19 13:00:00','2025-05-20 22:57:41',1),(55,'Đèn pin mini','Đèn pin mini tiện dụng, nhỏ gọn, ánh sáng mạnh, sử dụng pin AA dễ thay thế. Phù hợp cho gia đình dùng khi mất điện hoặc đi dã ngoại.',60000.00,'denpin.jpg',1,'2025-05-19 13:15:00','2025-05-20 22:57:41',1);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `search`
--

DROP TABLE IF EXISTS `search`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `search` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `searchcontent` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `search`
--

LOCK TABLES `search` WRITE;
/*!40000 ALTER TABLE `search` DISABLE KEYS */;
INSERT INTO `search` VALUES (47,4,'Nước rửa chén Sunlight 750ml'),(48,4,'Nước'),(49,4,'Nước'),(50,4,'Nước'),(51,4,'Nước rửa chén Sunlight 750ml'),(52,4,'Nước rửa chén Sunlight 750ml'),(53,4,'Nước rửa chén Sunlight 750ml'),(54,4,'Nước rửa chén Sunlight 750ml'),(55,4,'Nước rửa chén Sunlight 750ml'),(56,4,'Hello'),(57,4,'Hellhn'),(58,4,'Hellhn'),(59,4,'Nước rửa chén Sunlight 750ml'),(60,4,'Nước'),(61,4,'Nước'),(62,4,'Nước rửa chén Sunlight 750ml'),(63,4,'Nước'),(64,4,'Dầu'),(65,4,'Dầu'),(66,4,'Dầu'),(67,4,'Dầu'),(68,4,'Dầu ăn'),(69,4,'Dầu'),(70,4,'Dầu'),(71,4,'Dầu'),(72,4,'Dầu'),(73,4,'Dầu'),(74,4,'Dầu'),(75,4,'Nưowcz'),(76,4,'Nước'),(77,4,'Nước'),(78,4,'Nước'),(79,4,'Nước'),(80,4,'Nước'),(81,4,'Nước'),(82,4,'Nước'),(83,4,'Nước'),(84,4,'Nước'),(85,4,'Nước'),(86,4,'Nước'),(87,4,'Nước'),(88,4,'Nước'),(89,4,'Nước suối Lavie 500ml'),(90,4,'Nước suối Lavie 500ml'),(91,4,'Nước suối Lavie 500ml'),(92,4,'Nước suối Lavie 500ml'),(93,4,'Dầu'),(94,4,'Dầu'),(95,4,'Dầu'),(96,4,'Dầu'),(97,4,'Dầu'),(98,4,'Nước'),(99,4,'Nước rửa chén Sunlight 750ml'),(100,4,'Nước'),(101,4,'Mì gói Hảo Hảo tôm chua cay'),(102,4,'Nước'),(103,4,'Mì gói Hảo Hảo tôm chua cay'),(104,4,'Mì gói Hảo Hảo tôm chua cay'),(105,3,'H');
/*!40000 ALTER TABLE `search` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `role` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Hoàng','hoang','hoang@gmal.comg','hoang','0123456789','123 Admin Street',1,'2025-04-15 23:59:53'),(2,'huyhoang','huyhoang','le.b@gmail.com','hoang','0911002200','789 Nguyễn Trãi, TP.HCM',0,'2025-04-15 23:59:53'),(3,'xuanhoang','hoang2','xh@gmail.com','hoang','0382386462','55 Giải Phóng,Hà Nội',0,'2025-04-15 23:59:53'),(4,'Trần Xuân Hoàng','hoang1','Hoangtranxuan04@gmail.com','hoang','0378106753','Quỳnh Mai, Hai Bà Trưng, Hà Nội',0,'2025-04-15 23:59:53');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vouchers`
--

DROP TABLE IF EXISTS `vouchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vouchers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `discount` int DEFAULT NULL,
  `discountcode` varchar(45) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vouchers`
--

LOCK TABLES `vouchers` WRITE;
/*!40000 ALTER TABLE `vouchers` DISABLE KEYS */;
INSERT INTO `vouchers` VALUES (2,'2025-05-20 00:00:00','2025-06-19 00:00:00',20,'P2Y1U0W7','2025-05-20 16:27:35',17),(3,'2025-05-20 00:00:00','2025-06-29 00:00:00',25,'8VBZVV4R','2025-05-20 16:30:52',0),(4,'2025-05-23 00:00:00','2025-06-23 00:00:00',15,'32TB4SIC','2025-05-23 23:02:30',14),(5,'2025-05-23 00:00:00','2025-05-25 23:59:59',2,'V561SD95','2025-05-23 23:22:20',1);
/*!40000 ALTER TABLE `vouchers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-24 19:30:34
