-- enum, longblob, date, engine
CREATE TABLE `core_users_info` (
  `raw_id` int(11) NOT NULL,
  `displayname` varchar(35) NOT NULL DEFAULT '未命名',
  `icon_itype` varchar(15) DEFAULT NULL,
  `icon_image` longblob,
  `gender` enum('f','m','o') DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `tel` varchar(15) DEFAULT NULL,
  `facebook` text,
  `authenemail` varchar(150) DEFAULT NULL,
  `interview_date` date DEFAULT NULL,
  `verified_level` enum('red','gray','yellow','green') NOT NULL DEFAULT 'red',
  `datetime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
