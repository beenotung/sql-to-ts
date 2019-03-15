CREATE TABLE `donates` (
  `raw_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `donate_type` varchar(25) DEFAULT NULL,
  `donate_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `donate_privacy` enum('public','followers','self') NOT NULL DEFAULT 'public',
  `donate_anonymous` enum('n','y') NOT NULL DEFAULT 'n',
  `donate_status` enum('ok','blocked') NOT NULL DEFAULT 'ok',
  `created_datetime` datetime NOT NULL,
  `admin_remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `donate_files` (
  `raw_id` int(11) NOT NULL,
  `donate_id` int(11) NOT NULL,
  `file_mime` varchar(20) NOT NULL,
  `file_blob` longblob NOT NULL,
  `created_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
