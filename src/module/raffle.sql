
-- drop database raffle if exists;

drop table if exists users;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `wallet` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `discord` varchar(255) DEFAULT NULL,
  `invite_code` varchar(255) DEFAULT NULL,
  `invited_user` int DEFAULT NULL,
  `total_points` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci