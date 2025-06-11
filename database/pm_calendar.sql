CREATE TABLE `pm_calendar` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(15) DEFAULT NULL,
  `calendar_date` date DEFAULT NULL,
  `calendar_weekday` tinyint(4) DEFAULT NULL,
  `override_start_date` date DEFAULT NULL,
  `override_end_date` date DEFAULT NULL,
  `is_working_day` tinyint(4) DEFAULT NULL,
  `availability` varchar(255) DEFAULT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;