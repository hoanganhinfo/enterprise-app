CREATE TABLE `wellington_test` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `motor_serial` varchar(255) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `batchno` varchar(20) DEFAULT NULL,
  `datetested` date DEFAULT NULL,
  `timetested` time DEFAULT NULL,
  `chesum` varchar(255) DEFAULT NULL,
  `tester` varchar(20) DEFAULT NULL,
  `limit_number` int(11) DEFAULT NULL,
  `limit_version` int(11) DEFAULT NULL,
  `limit_revision` int(11) DEFAULT NULL,
  `voltage` double(15,3) DEFAULT NULL,
  `input_powers` text,
  `datetimepacked` datetime DEFAULT NULL,
  `motor_type` varchar(20) DEFAULT NULL,
  `sequence` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;