# SQL Manager 2010 for MySQL 4.5.0.9
# ---------------------------------------
# Host     : localhost
# Port     : 3306
# Database : enterprise_app


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

SET FOREIGN_KEY_CHECKS=0;

DROP DATABASE IF EXISTS `enterprise_app`;

CREATE DATABASE `enterprise_app`
    CHARACTER SET 'latin1'
    COLLATE 'latin1_swedish_ci';

USE `enterprise_app`;

#
# Structure for the `asset` table : 
#

CREATE TABLE `asset` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `serial` varchar(20) DEFAULT NULL,
  `manufacturer` varchar(50) DEFAULT NULL,
  `distributor` varchar(50) DEFAULT NULL,
  `store` varchar(50) DEFAULT NULL,
  `store_address` text,
  `description` text,
  `purchased_date` date DEFAULT NULL,
  `expired_date` date DEFAULT NULL,
  `warranty` varchar(20) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

#
# Structure for the `asset_category` table : 
#

CREATE TABLE `asset_category` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) DEFAULT NULL,
  `department_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

#
# Structure for the `asset_history` table : 
#

CREATE TABLE `asset_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `asset_id` bigint(20) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `trans_type` tinyint(4) DEFAULT NULL,
  `trans_date` date DEFAULT NULL,
  `employee` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `memo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;

#
# Structure for the `hr_recruitment_order` table : 
#

CREATE TABLE `hr_recruitment_order` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `request_date` date DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_date` date DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `priority` tinyint(4) NOT NULL,
  `recruitment_position` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Structure for the `hr_recruitment_phase` table : 
#

CREATE TABLE `hr_recruitment_phase` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `phase_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `phase_name` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `posted_date` date DEFAULT NULL,
  `stop_date` date DEFAULT NULL,
  `posted_method` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `posted_content` text COLLATE utf8_unicode_ci,
  `status` mediumint(9) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Structure for the `pm_calendar` table : 
#

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

#
# Structure for the `pm_project` table : 
#

CREATE TABLE `pm_project` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `project_type` tinyint(4) DEFAULT NULL,
  `manager` int(11) DEFAULT NULL,
  `department_id` bigint(20) DEFAULT NULL,
  `department_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `clientname` varchar(20) CHARACTER SET latin1 DEFAULT NULL,
  `resource_list` varchar(20) CHARACTER SET latin1 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Structure for the `pm_project_task` table : 
#

CREATE TABLE `pm_project_task` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) NOT NULL,
  `project_task` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `parent_task_id` bigint(20) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `end_date` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `leaf` tinyint(1) DEFAULT NULL,
  `predecessor` bigint(20) DEFAULT NULL,
  `sortorder` tinyint(4) DEFAULT NULL,
  `completed_percent` tinyint(4) DEFAULT NULL,
  `resource_list` varchar(20) CHARACTER SET latin1 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

#
# Structure for the `pm_project_type` table : 
#

CREATE TABLE `pm_project_type` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Structure for the `pm_resource` table : 
#

CREATE TABLE `pm_resource` (
  `Id` bigint(20) NOT NULL AUTO_INCREMENT,
  `Name` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `employee_id` bigint(20) DEFAULT NULL,
  `email` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `resource_type` tinyint(4) DEFAULT NULL,
  `memo` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Structure for the `task` table : 
#

CREATE TABLE `task` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `scope` tinyint(4) DEFAULT NULL,
  `taskname` text COLLATE utf8_unicode_ci,
  `description` text COLLATE utf8_unicode_ci,
  `requester_id` int(11) DEFAULT NULL,
  `department` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `assignee` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `priority` tinyint(4) DEFAULT NULL,
  `request_date` date DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `targetdate` date DEFAULT NULL,
  `plan_completed_date` date DEFAULT NULL,
  `actual_completed_date` date DEFAULT NULL,
  `email` text COLLATE utf8_unicode_ci,
  `assigneeEmail` text COLLATE utf8_unicode_ci,
  `assigneeName` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for the `asset` table  (LIMIT 0,500)
#

INSERT INTO `asset` (`id`, `name`, `serial`, `manufacturer`, `distributor`, `store`, `store_address`, `description`, `purchased_date`, `expired_date`, `warranty`, `status`, `category_id`) VALUES 
  (1,'HP Laser M1132 MFG',' ','hp','FPT','FPT Binh duong','','','2013-09-01','2013-09-30','1 year',6,2),
  (2,'Asus K46CB',' ','Asus','FPT','Back khoa computer','Binh Duong','','2013-08-21','2015-09-21','2 years',6,1),
  (3,'a','','a','','','','','2013-09-23','2013-09-23','',5,NULL),
  (4,'a','','','','','','','2013-09-23','2013-09-23','',5,NULL),
  (8,'g','','','','','','','2013-09-23','2013-09-23','',8,2),
  (9,'Dell 1516','','Dell','FPT','Le Phung','HCM','','2013-10-02','2013-10-02','1 years',5,1),
  (10,'Dell','','','','','','','2013-10-02','2013-10-02','',5,1);
COMMIT;

#
# Data for the `asset_category` table  (LIMIT 0,500)
#

INSERT INTO `asset_category` (`id`, `category_name`, `department_id`) VALUES 
  (1,'Laptop',25702),
  (2,'Printer',25702),
  (3,'sdfgd',12422),
  (4,'Desktop',25702);
COMMIT;

#
# Data for the `asset_history` table  (LIMIT 0,500)
#

INSERT INTO `asset_history` (`id`, `asset_id`, `description`, `start_date`, `end_date`, `trans_type`, `trans_date`, `employee`, `user_id`, `memo`) VALUES 
  (1,0,NULL,'2013-09-26',NULL,0,'2013-09-26',NULL,NULL,NULL),
  (2,0,NULL,'2013-09-26','2013-09-27',0,'2013-09-26','dfdg',NULL,NULL),
  (3,0,NULL,'2013-09-27','2013-09-27',0,'2013-09-26',NULL,NULL,NULL),
  (6,8,NULL,'2013-09-26','2013-09-26',6,'2013-09-26','dgfgf',NULL,'fgjghj'),
  (12,8,'','2013-09-30',NULL,8,'2013-09-30','',NULL,''),
  (26,9,'','2013-10-02',NULL,6,'2013-10-02','Ngoc Anh',NULL,''),
  (27,2,'','2013-08-21',NULL,6,'2013-10-02','mattg''',NULL,''),
  (28,1,'','2013-09-23',NULL,6,'2013-10-02','QC',NULL,'');
COMMIT;

#
# Data for the `pm_calendar` table  (LIMIT 0,500)
#

INSERT INTO `pm_calendar` (`id`, `name`, `type`, `calendar_date`, `calendar_weekday`, `override_start_date`, `override_end_date`, `is_working_day`, `availability`, `project_id`) VALUES 
  (1,'Main calendar','WEEKDAYOVERRIDE',NULL,-1,'2013-10-10','2013-10-24',NULL,NULL,1);
COMMIT;

#
# Data for the `pm_project` table  (LIMIT 0,500)
#

INSERT INTO `pm_project` (`id`, `name`, `project_type`, `manager`, `department_id`, `department_name`, `start_date`, `end_date`, `status`, `clientname`, `resource_list`) VALUES 
  (1,'Online Project Operation',2,1,25702,'IT','2013-10-10','2013-10-24',1,'EWI','itsupervisor@ewi.vn'),
  (2,'gfhfghfgth',3,5476,12416,'Engineer','2013-11-16','2013-11-16',1,'fhgh',NULL),
  (3,'fgfg',4,NULL,12416,'Engineer','2013-11-20','2013-11-20',1,'bnmm',NULL),
  (4,'87',1,NULL,12416,'Engineer','2013-11-20','2013-11-20',1,'',NULL),
  (5,'45454',4,NULL,12416,'Engineer','2013-11-20','2013-11-20',1,'5657',NULL),
  (6,'eeeee1',3,NULL,25702,'IT','2013-11-20','2013-11-20',1,'',NULL);
COMMIT;

#
# Data for the `pm_project_task` table  (LIMIT 0,500)
#

INSERT INTO `pm_project_task` (`id`, `project_id`, `project_task`, `parent_task_id`, `duration`, `start_date`, `end_date`, `leaf`, `predecessor`, `sortorder`, `completed_percent`, `resource_list`) VALUES 
  (73,1,'Task A',-1,NULL,'2013-01-01 00:00:00','2013-01-23 23:59:59',0,NULL,NULL,0,NULL),
  (77,1,'Task B',-1,NULL,'2013-01-16 00:00:00','2013-01-25 23:59:59',0,NULL,NULL,0,NULL),
  (81,1,'34A1',73,NULL,'2013-01-01 00:00:00','2013-01-19 23:59:59',1,NULL,NULL,9,NULL),
  (82,1,'New taska',73,NULL,'2013-01-03 00:00:00','2013-01-12 23:59:59',1,NULL,NULL,30,NULL),
  (83,1,'À',73,NULL,'2013-01-07 00:00:00','2013-01-10 23:59:59',1,NULL,NULL,100,NULL),
  (84,1,'A2',73,NULL,'2013-01-06 00:00:00','2013-01-12 23:59:59',1,NULL,NULL,0,NULL),
  (85,1,'A2',73,NULL,'2013-01-09 00:00:00','2013-01-21 23:59:59',1,NULL,NULL,100,NULL),
  (86,1,'New task',77,NULL,'2013-01-16 00:00:00','2013-01-21 23:59:59',1,NULL,NULL,0,NULL),
  (87,1,'New task',77,NULL,'2013-01-18 00:00:00','2013-01-23 23:59:59',1,NULL,NULL,0,NULL),
  (88,1,'New task',77,NULL,'2013-01-16 00:00:00','2013-01-20 23:59:59',1,NULL,NULL,0,NULL),
  (89,1,'New task',-2,NULL,'2013-01-01 00:00:00','2013-01-02 23:59:59',0,NULL,NULL,NULL,NULL),
  (90,1,'New task',-2,NULL,'2013-01-01 00:00:00','2013-01-02 23:59:59',0,NULL,NULL,NULL,NULL),
  (91,1,'New task',-2,NULL,'2013-01-01 00:00:00','2013-01-03 23:59:59',1,NULL,NULL,NULL,NULL),
  (92,1,'New task',0,NULL,'2013-01-01 00:00:00','2013-01-03 23:59:59',1,NULL,NULL,NULL,NULL),
  (93,1,'New task',-2,NULL,'2013-01-01 00:00:00','2013-01-03 23:59:59',1,NULL,NULL,NULL,NULL),
  (94,1,'New task',0,NULL,'2013-01-01 00:00:00','2013-01-03 23:59:59',1,NULL,NULL,NULL,NULL),
  (95,1,'New task',0,NULL,'2013-01-01 00:00:00','2013-01-03 23:59:59',1,NULL,NULL,NULL,NULL),
  (96,1,'New task',0,NULL,'2013-01-01 00:00:00','2013-01-03 23:59:59',1,NULL,NULL,NULL,NULL),
  (97,1,'New task',0,NULL,'2013-01-01 00:00:00','2013-01-03 23:59:59',1,NULL,NULL,NULL,NULL),
  (98,1,'New task',89,NULL,'2013-01-01 00:00:00','2013-01-02 23:59:59',1,NULL,NULL,NULL,NULL),
  (99,1,'New task',90,NULL,'2013-01-01 00:00:00','2013-01-02 23:59:59',1,NULL,NULL,NULL,NULL),
  (100,1,'New task',89,NULL,'2013-01-01 00:00:00','2013-01-02 23:59:59',1,NULL,NULL,NULL,NULL),
  (101,1,'New task',-4,NULL,'2013-01-01 00:00:00','2013-01-11 23:59:59',0,NULL,NULL,NULL,NULL),
  (102,1,'New task',101,NULL,'2013-01-01 00:00:00','2013-01-11 23:59:59',1,NULL,NULL,NULL,NULL),
  (103,1,'New task',-4,NULL,'2013-01-11 00:00:00','2013-01-23 23:59:59',0,NULL,NULL,NULL,NULL),
  (104,1,'New task',103,NULL,'2013-01-11 00:00:00','2013-01-23 23:59:59',0,NULL,NULL,NULL,NULL),
  (105,1,'New task',104,NULL,'2013-01-11 00:00:00','2013-01-16 23:59:59',1,NULL,NULL,NULL,NULL),
  (107,1,'New task',104,NULL,'2013-01-12 00:00:00','2013-01-23 23:59:59',1,NULL,NULL,NULL,NULL),
  (108,1,'New task',77,NULL,'2013-01-16 00:00:00','2013-01-17 23:59:59',1,NULL,NULL,NULL,NULL),
  (109,1,'New task',-1,NULL,'2013-10-10 00:00:00','2013-11-01 23:59:59',0,NULL,NULL,0,NULL),
  (110,1,'New task',109,NULL,'2013-10-10 00:00:00','2013-10-15 23:59:59',1,NULL,NULL,100,NULL),
  (111,1,'New task',109,NULL,'2013-10-10 00:00:00','2013-10-11 23:59:59',1,NULL,NULL,0,NULL);
COMMIT;

#
# Data for the `pm_project_type` table  (LIMIT 0,500)
#

INSERT INTO `pm_project_type` (`id`, `name`, `status`) VALUES 
  (1,'Pilot',1),
  (2,'Interal',1),
  (3,'Prototype',1),
  (4,'Production',1);
COMMIT;

#
# Data for the `task` table  (LIMIT 0,500)
#

INSERT INTO `task` (`id`, `scope`, `taskname`, `description`, `requester_id`, `department`, `assignee`, `priority`, `request_date`, `status`, `targetdate`, `plan_completed_date`, `actual_completed_date`, `email`, `assigneeEmail`, `assigneeName`) VALUES 
  (1,1,'qwe','<font color=\"0000FF\">qweqw</font>',10196,'25702',NULL,1,'2013-06-28',2,'2013-06-28','2013-06-28','2013-06-28','itsupervisor@ewi.vn',NULL,NULL),
  (2,1,'aaaa','aaaa',10196,'25702',NULL,2,'2013-06-28',4,'2013-06-28','2013-06-28','2013-06-28','itsupervisor@ewi.vn',NULL,NULL),
  (3,1,'ddfg','dfg',10196,'12416',NULL,1,'2013-06-28',4,'2013-06-28','2013-06-28','2013-06-28','itsupervisor@ewi.vn',NULL,NULL),
  (4,1,'test task','test task​',10196,'12410',NULL,2,'2013-07-01',2,'2013-07-01',NULL,NULL,'itsupervisor@ewi.vn',NULL,NULL),
  (5,1,'test','sfgsdg',10196,'12410',NULL,1,'2013-07-01',1,'2013-07-01','2013-07-01','2013-07-01','itsupervisor@ewi.vn',NULL,NULL),
  (6,1,'123','123',10196,'25708',NULL,2,'2013-07-01',2,'2013-07-01',NULL,NULL,'itsupervisor@ewi.vn',NULL,NULL),
  (7,1,'343','3434',10196,'25702',NULL,1,'2013-07-01',2,'2013-07-01',NULL,NULL,'itsupervisor@ewi.vn',NULL,NULL),
  (9,1,'test','test',10196,'25708',NULL,1,'2013-07-08',2,'2013-07-08','2013-07-08',NULL,'itsupervisor@ewi.vn',NULL,NULL),
  (10,1,'test 1111','sdfsdf',10196,'25708',NULL,1,'2013-07-08',2,'2013-07-08',NULL,NULL,'itsupervisor@ewi.vn;dcc@ewi.vn',NULL,NULL),
  (11,1,'1111','1111',10196,'25702',NULL,1,'2013-07-08',2,'2013-07-08',NULL,NULL,'itsupervisor@ewi.vn',NULL,NULL),
  (12,1,'work order resr','<i><b>​work order resr</b></i><br>work order resr<br>work order resr<br>work order resr<br>',10196,'25702',NULL,1,'2013-07-08',2,'2013-07-08',NULL,NULL,'itsupervisor@ewi.vn',NULL,NULL),
  (13,1,'test','dfhdfh',10196,'25702',NULL,1,'2013-07-09',2,'2013-07-09',NULL,NULL,'itsupervisor@ewi.vn',NULL,NULL),
  (14,1,'sfgdfgd','dfgdfgd',10196,'25702',NULL,1,'2013-07-09',2,'2013-07-09',NULL,NULL,'itsupervisor@ewi.vn',NULL,NULL),
  (18,1,'111','111',10196,'25702',NULL,1,'2013-07-09',1,'2013-07-09',NULL,NULL,'itsupervisor@ewi.vn',NULL,NULL),
  (19,1,'aaaa','aaaa',10196,'25702',NULL,1,'2013-07-10',2,'2013-07-10',NULL,'2013-07-10','itsupervisor@ewi.vn',NULL,NULL),
  (20,1,'234','234',10196,'25702',NULL,1,'2013-07-10',2,'2013-07-10',NULL,'2013-07-24','itsupervisor@ewi.vn',NULL,NULL),
  (21,1,'111','111',10196,'25702',NULL,1,'2013-07-10',1,'2013-07-10',NULL,NULL,'itsupervisor@ewi.vn',NULL,NULL),
  (24,1,'123456','123456',10196,'25702',NULL,1,'2013-07-10',2,'2013-07-10',NULL,'2013-07-10','itsupervisor@ewi.vn',NULL,NULL),
  (26,1,'123456','123456',10196,'25702',NULL,1,'2013-07-10',2,'2013-07-10',NULL,'2013-07-24','itsupervisor@ewi.vn',NULL,NULL),
  (27,1,'aaaaa','aaaaaa',10196,'25702',NULL,1,'2013-07-10',2,'2013-07-10',NULL,'2013-07-10','itsupervisor@ewi.vn',NULL,NULL),
  (28,1,'test','test',12435,'25702',NULL,1,'2013-07-24',1,'2013-07-24',NULL,NULL,'',NULL,NULL),
  (29,1,'test','test',10196,'25702',NULL,1,'2013-07-24',1,'2013-07-24',NULL,NULL,'',NULL,NULL),
  (33,1,'etst ','test',10196,'12416','26258',1,'2013-12-20',1,'2013-12-20',NULL,NULL,'','assembly@ewi.vn',NULL);
COMMIT;



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;