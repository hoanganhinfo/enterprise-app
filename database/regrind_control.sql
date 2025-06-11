
CREATE TABLE `inj_mold` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `mold_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `product_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cavity` int(11) DEFAULT NULL,
  `product_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `color` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `inj_regrind_rate` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `product_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `virgin_material_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `virgin_material_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `masterbatch_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `masterbatch_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `regrind_resin_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `regrind_resin_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `color_rate` double(15,3) DEFAULT NULL,
  `regrind_rate` double(15,3) DEFAULT NULL,
  `constant_scrap` double(15,3) DEFAULT NULL,
  `runner_weight` double(15,3) DEFAULT NULL,
  `product_weight` double(15,3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `inj_manager_confirmation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_date` date DEFAULT NULL,
  `mold_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `part_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `color` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cavity` double(15,3) DEFAULT NULL,
  `runner_ratio` double(15,3) DEFAULT NULL,
  `weight_regrind_theorically` double(15,3) DEFAULT NULL,
  `part_qty_prepared` double(15,3) DEFAULT NULL,
  `virgin_material_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `virgin_material_weight` double(15,3) DEFAULT NULL,
  `regrind_material_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `regrind_material_weight` double(15,3) DEFAULT NULL,
  `regrind_rate` double(15,3) DEFAULT NULL,
  `masterbatch_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `masterbatch_weight` double(15,3) DEFAULT NULL,
  `masterbatch_rate` double(15,3) DEFAULT NULL,
  `mixed_material_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `mixed_material_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `mixed_material_weight` double(15,3) DEFAULT NULL,
  `operator_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `virgin_material_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `masterbatch_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `regrind_material_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `part_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `order_status` tinyint(4) DEFAULT NULL,
  `regrind_shortage` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `inj_mixed_material_journal` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `transdate` date DEFAULT NULL,
  `mixed_material_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `virgin_material_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `virgin_material_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `regrind_resin_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `regrind_material_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `regrind_rate` double(15,3) DEFAULT NULL,
  `color` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `mold_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `part_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `part_name` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `weight` double(15,3) DEFAULT NULL,
  `idorder` bigint(20) DEFAULT NULL,
  `operator_name` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;