CREATE TABLE `qc_inspection_table` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` varchar(20) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `trans_date` date DEFAULT NULL,
  `inspection_date` date DEFAULT NULL,
  `vendor` varchar(20) DEFAULT NULL,
  `trans_qty` double(15,3) DEFAULT NULL,
  `inspection_qty` double(15,3) DEFAULT NULL,
  `critial_defect` int(11) DEFAULT NULL,
  `major_defect` int(11) DEFAULT NULL,
  `minor_defect` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `isAccept` tinyint(4) DEFAULT NULL,
  `defect_name` text,
  `memo` text,
  `trans_type` tinyint(4) DEFAULT NULL,
  `vendor_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

CREATE TABLE `qc_inspection_line` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `inspection_id` bigint(20) DEFAULT NULL,
  `defect_code` varchar(20) DEFAULT NULL,
  `defect_name` text,
  `defect_qty` int(11) DEFAULT NULL,
  `memo` text,
  `defect_level` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

CREATE TABLE `qc_inspection_defect` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `defect_name_en` text,
  `defect_name_vn` text,
  `defect_code` text,
  `status` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;