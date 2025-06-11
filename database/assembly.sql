CREATE TABLE `assy_parameter` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `parameter_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `parameter_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `parameter_size` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `assy_product_defect` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `defect_code` varchar(20) DEFAULT NULL,
  `defect_name_en` text,
  `defect_name_vn` text NOT NULL,
  `status` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

CREATE TABLE `assy_product_model` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_model` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `product_type` bigint(20) DEFAULT NULL,
  `product_param` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `assy_product_station` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_type` bigint(20) DEFAULT NULL,
  `station` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `product_params` text COLLATE utf8_unicode_ci,
  `product_defects` text COLLATE utf8_unicode_ci,
  `step` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE `assy_product_test` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_model` bigint(20) DEFAULT NULL,
  `datetimetested` datetime DEFAULT NULL,
  `operator` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `sessionId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `defectcode` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `serial` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `param_data` text COLLATE utf8_unicode_ci,
  `station` bigint(20) DEFAULT NULL,
  `station_name` text COLLATE utf8_unicode_ci,
  `station_step` int(11) DEFAULT NULL,
  `reworkid` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE `assy_product_type` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_type_code` varchar(255) NOT NULL,
  `product_type_name` text,
  `prefix_function` text,
  `serial_size` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

