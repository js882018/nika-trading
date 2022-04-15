-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 15, 2022 at 04:12 AM
-- Server version: 10.5.13-MariaDB-cll-lve
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u540186543_nikatrading`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `phone` varchar(13) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gst_no` varchar(65) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(65) CHARACTER SET utf8mb4 DEFAULT NULL,
  `landmark` varchar(124) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `email`, `phone`, `gst_no`, `location`, `landmark`, `address`, `created_by`, `created_date`, `updated_date`) VALUES
(1, 'TEST', 'TEST@GMAIL.COM', '12564789526', '33455552', 'MTM', 'TEST', 'MTMTMTM', 1, '2022-04-02 05:09:05', '2022-04-12 02:04:27'),
(2, 'New Customer', 'newcustomer@test.com', '9874563208', NULL, NULL, NULL, '', 1, '2022-04-12 01:01:04', NULL),
(3, 'new custioime rtwo', 'nre@test.com', '353453454353', NULL, NULL, NULL, '', 1, '2022-04-13 02:24:19', NULL),
(4, 'Araneesh', NULL, '9688443320', NULL, NULL, NULL, '', 1, '2022-04-13 09:31:30', NULL),
(5, 'Customer check upadte', 'customer@yopmail.com', '989898989898', 'test', 'test', 'test lanmdmark', 'test', 1, '2022-04-13 10:34:39', '2022-04-14 07:11:42'),
(6, 'Testc1', NULL, '7878787989', NULL, NULL, NULL, '', 27, '2022-04-14 07:51:52', NULL),
(7, 'Test issue check', NULL, '9874563210', NULL, 'Chennai', NULL, NULL, 1, '2022-04-14 10:10:55', '2022-04-14 10:11:02'),
(8, 'Teating', 'Test@test.com', '9715919736', NULL, 'Teat', NULL, NULL, 3, '2022-04-14 04:19:25', '2022-04-14 04:19:38'),
(9, 'Item checker', NULL, '4688999987', NULL, NULL, NULL, NULL, 1, '2022-04-14 04:49:29', NULL),
(10, 'Vishnu', NULL, '9645350999', NULL, NULL, NULL, NULL, 1, '2022-04-14 05:47:33', NULL),
(11, 'Siva store', NULL, '8086050619', NULL, NULL, NULL, NULL, 32, '2022-04-14 06:02:11', NULL),
(12, 'customer one', NULL, '56456456456', NULL, 'test', NULL, 'dasdasd', 34, '2022-04-14 11:37:23', '2022-04-14 11:37:42');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `name` varchar(125) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hsn_sac` varchar(35) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_name` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `image_path` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `name`, `hsn_sac`, `price`, `image_name`, `image_path`, `created_date`, `updated_date`) VALUES
(5, 'C15-Chilli Flavour Cashew Kernels 15gm (Pcs)', 'C15', '16.60', NULL, '', '2022-04-06 09:38:07', '2022-04-06 09:41:55'),
(6, 'M100 -Mint Flavour Cashew kernels 100gm (pcs)', 'M100', '105', NULL, '', '2022-04-06 09:41:27', NULL),
(7, 'M15-Mint Flavour Cashew kernels 15gm (Pcs)', 'M15', '16.60', NULL, '', '2022-04-06 09:42:16', '2022-04-06 09:43:36'),
(8, 'C100 - Chilli Flavoured Cashew Kernels 100gm (Pcs)', 'C100', '105', NULL, '', '2022-04-06 09:42:39', NULL),
(9, 'P100-Pepper Flavored  Cashew Kernels 100gm (Pcs)', 'P100', '105', NULL, '', '2022-04-06 09:43:03', NULL),
(10, 'P15 -Pepper Flovored Cashew Kernels 15gm (Pcs)', 'P15', '16.6', NULL, '', '2022-04-06 09:44:01', NULL),
(11, 'S100- Salted Cashew Kernels 100gm (Pcs)', 'S100', '105', NULL, '', '2022-04-06 09:46:31', NULL),
(12, 'S15- Salted Cashew Kernels 15gm (Pcs)', 'S15', '16.6', NULL, '', '2022-04-06 09:47:14', NULL),
(13, 'N100 - Natural  Cashew Kernels 100gm (Pcs)', 'N100', '105', '', '', '2022-04-06 09:47:43', '2022-04-14 06:23:12');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `reference_id` varchar(10) CHARACTER SET utf8mb4 NOT NULL,
  `customer_id` int(11) NOT NULL,
  `total_amount` varchar(25) CHARACTER SET utf8mb4 NOT NULL DEFAULT '0',
  `shipment_date` date DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_by` int(11) NOT NULL DEFAULT 0,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `reference_id`, `customer_id`, `total_amount`, `shipment_date`, `status`, `created_by`, `created_date`, `updated_date`) VALUES
(1, '00001', 2, '348.20', '2022-04-13', 4, 1, '2022-04-13 06:46:30', '2022-04-13 06:46:46'),
(2, '00002', 3, '1050.00', '2022-04-13', 2, 3, '2022-04-13 07:01:15', '2022-04-13 07:02:58'),
(3, '00003', 4, '498.00', '2022-04-13', 6, 1, '2022-04-13 09:31:30', '2022-04-13 09:32:06'),
(4, '00004', 4, '574.80', '2022-04-13', 5, 1, '2022-04-13 11:04:58', '2022-04-13 11:06:10'),
(5, '00005', 6, '166.00', '2022-04-14', 1, 27, '2022-04-14 07:51:52', NULL),
(6, '00006', 9, '3299.80', '2022-04-14', 2, 1, '2022-04-14 04:49:29', '2022-04-14 04:50:47'),
(7, '00007', 10, '1050.00', '2022-04-14', 2, 1, '2022-04-14 05:47:33', NULL),
(8, '00008', 11, '332.00', '2022-04-14', 1, 32, '2022-04-14 06:02:11', '2022-04-14 06:07:12'),
(9, '00009', 12, '166.00', '2022-04-15', 2, 34, '2022-04-14 11:38:16', '2022-04-14 11:38:47'),
(10, '00010', 12, '166.00', '2022-04-14', 2, 34, '2022-04-14 11:41:16', '2022-04-14 11:41:47');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `item_name` varchar(125) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit_price` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `total_price` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `item_id`, `item_name`, `quantity`, `unit_price`, `total_price`) VALUES
(1, 1, 5, 'C15-Chilli Flavour Cashew Kernels 15gm (Pcs)', '2', '16.60', '33.2'),
(2, 1, 6, 'M100 -Mint Flavour Cashew kernels 100gm (pcs)', '3', '105', '315.0'),
(3, 2, 8, 'C100 - Chilli Flavoured Cashew Kernels 100gm (Pcs)', '5', '105', '525.0'),
(4, 2, 11, 'S100- Salted Cashew Kernels 100gm (Pcs)', '5', '105', '525.0'),
(5, 3, 5, 'C15-Chilli Flavour Cashew Kernels 15gm (Pcs)', '10', '16.60', '166.0'),
(6, 3, 10, 'P15 -Pepper Flovored Cashew Kernels 15gm (Pcs)', '10', '16.6', '166.0'),
(7, 3, 7, 'M15-Mint Flavour Cashew kernels 15gm (Pcs)', '10', '16.60', '166.0'),
(8, 4, 9, 'P100-Pepper Flavored  Cashew Kernels 100gm (Pcs)', '1', '105', '105.0'),
(9, 4, 5, 'C15-Chilli Flavour Cashew Kernels 15gm (Pcs)', '3', '16.60', '49.8'),
(10, 4, 11, 'S100- Salted Cashew Kernels 100gm (Pcs)', '4', '105', '420.0'),
(11, 5, 5, 'C15-Chilli Flavour Cashew Kernels 15gm (Pcs)', '10', '16.60', '166.0'),
(29, 6, 5, 'C15-Chilli Flavour Cashew Kernels 15gm (Pcs)', '1', '16.60', '16.6'),
(30, 6, 6, 'M100 -Mint Flavour Cashew kernels 100gm (pcs)', '2', '105', '210.0'),
(31, 6, 7, 'M15-Mint Flavour Cashew kernels 15gm (Pcs)', '3', '16.60', '49.8'),
(32, 6, 8, 'C100 - Chilli Flavoured Cashew Kernels 100gm (Pcs)', '4', '105', '420.0'),
(33, 6, 9, 'P100-Pepper Flavored  Cashew Kernels 100gm (Pcs)', '5', '105', '525.0'),
(34, 6, 10, 'P15 -Pepper Flovored Cashew Kernels 15gm (Pcs)', '6', '16.6', '99.6'),
(35, 6, 11, 'S100- Salted Cashew Kernels 100gm (Pcs)', '7', '105', '735.0'),
(36, 6, 12, 'S15- Salted Cashew Kernels 15gm (Pcs)', '8', '16.6', '132.8'),
(37, 6, 13, 'N100 - Natural  Cashew Kernels 100gm (Pcs)', '9', '105', '945.0'),
(38, 7, 8, 'C100 - Chilli Flavoured Cashew Kernels 100gm (Pcs)', '10', '105', '1050.0'),
(40, 8, 5, 'C15-Chilli Flavour Cashew Kernels 15gm (Pcs)', '20', '16.60', '332.0'),
(41, 9, 5, 'C15-Chilli Flavour Cashew Kernels 15gm (Pcs)', '10', '16.60', '166.0'),
(43, 10, 5, 'C15-Chilli Flavour Cashew Kernels 15gm (Pcs)', '10', '16.60', '166.0');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(70) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(13) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` tinyint(4) NOT NULL DEFAULT 1,
  `approved` tinyint(1) NOT NULL DEFAULT 1,
  `image` varchar(165) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reset_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` int(11) NOT NULL DEFAULT 0,
  `created_date` datetime DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`, `approved`, `image`, `reset_code`, `created_by`, `created_date`, `updated_date`) VALUES
(1, 'Administrator', 'info@nikatrading.in', '9874563210', '25d55ad283aa400af464c76d713c07ad', 1, 1, NULL, '9451e0fe3dc3aab3d986458e9e4e5db6', 0, '2022-03-28 07:17:37', '2022-04-14 11:42:25'),
(2, 'Test Agent', 'testgency1@test.com', '1478523690', '25d55ad283aa400af464c76d713c07ad', 2, 1, NULL, NULL, 1, '2022-03-29 06:18:45', '2022-04-05 04:14:31'),
(3, 'Dickson c', 'dickson@yopmail.com', '9715919736', '25d55ad283aa400af464c76d713c07ad', 3, 1, NULL, NULL, 1, '2022-04-04 03:23:31', '2022-04-14 04:19:52'),
(4, 'PRL Distributers', 'prldistributors@gmail.com', '9946939495', '6fccbbfd080b098a90ed615f9c44d301', 2, 1, NULL, NULL, 1, '2022-04-06 09:51:31', NULL),
(5, 'Nedumangadan Associates', 'nedumangadans@gmail.com', '8075223876', '5a3fe479e1818387e23b105e201553ea', 2, 1, NULL, NULL, 1, '2022-04-06 09:53:33', NULL),
(6, 'Checking', 'Qa@yopmail.com', '9715919737', '25d55ad283aa400af464c76d713c07ad', 3, 1, NULL, NULL, 0, '2022-04-09 11:59:21', NULL),
(9, 'Dickson prabhu', 'cdickson.ece@gmail.com', '09715919736', '25d55ad283aa400af464c76d713c07ad', 3, 0, NULL, 'e12ccc15064e6308b31c21a40470cf2d', 0, '2022-04-09 12:29:05', NULL),
(12, 'test', 'sales@gmail.com', '9688443320', 'e10adc3949ba59abbe56e057f20f883e', 3, 1, NULL, NULL, 1, '2022-04-11 06:40:13', NULL),
(13, 'test', 'Tsales@gmail.com', '29688443320', 'e10adc3949ba59abbe56e057f20f883e', 3, 1, NULL, NULL, 1, '2022-04-11 06:40:43', NULL),
(14, 'test', 'testsales@gmail.com', '9547895462', 'e10adc3949ba59abbe56e057f20f883e', 3, 1, NULL, NULL, 1, '2022-04-11 06:41:26', NULL),
(15, 'Agency', 'Agency@gmail.com', '7339237979', '1adbb3178591fd5bb0c248518f39bf6d', 2, 1, NULL, NULL, 1, '2022-04-13 10:12:58', '2022-04-14 06:05:27'),
(16, 'Employe1', 'Employe1@gmail.com', '9089098789', '17ddf73881243bf3cfdf712d29af5384', 3, 1, NULL, NULL, 1, '2022-04-13 10:41:19', NULL),
(17, 'Quality assurance', 'qa@test.com', '9715919734', '25d55ad283aa400af464c76d713c07ad', 2, 1, NULL, NULL, 1, '2022-04-13 10:41:33', '2022-04-13 10:43:06'),
(18, 'Agancy person', 'person@yopmail.com', '98898989889', '8169d716646eba5a497eb08535f74bc9', 3, 1, NULL, NULL, 17, '2022-04-13 11:11:28', NULL),
(19, 'Checking user', 'testcheck@gmail.com', '898989898989', '25d55ad283aa400af464c76d713c07ad', 3, 0, NULL, NULL, 0, '2022-04-13 11:17:40', NULL),
(20, 'Checking user', 'testcheck@gmail.com', '898989898989', '25d55ad283aa400af464c76d713c07ad', 3, 0, NULL, NULL, 0, '2022-04-13 11:17:45', NULL),
(21, 'Checking user', 'testcheck@gmail.com', '898989898989', '25d55ad283aa400af464c76d713c07ad', 3, 0, NULL, NULL, 0, '2022-04-13 11:17:56', NULL),
(22, 'Checking user', 'testcheck@gmail.com', '898989898989', '25d55ad283aa400af464c76d713c07ad', 3, 0, NULL, NULL, 0, '2022-04-13 11:17:58', NULL),
(23, 'Checking user', 'testcheck@gmail.com', '898989898989', '25d55ad283aa400af464c76d713c07ad', 3, 0, NULL, NULL, 0, '2022-04-13 11:17:59', NULL),
(24, 'Checking user', 'testcheck@gmail.com', '898989898989', '25d55ad283aa400af464c76d713c07ad', 3, 0, NULL, NULL, 0, '2022-04-13 11:17:59', NULL),
(25, 'Checking user', 'testcheck@gmail.com', '898989898989', '25d55ad283aa400af464c76d713c07ad', 3, 0, NULL, NULL, 0, '2022-04-13 11:18:00', NULL),
(26, 'Checking user', 'testcheck@gmail.com', '898989898989', '25d55ad283aa400af464c76d713c07ad', 3, 0, NULL, NULL, 0, '2022-04-13 11:18:09', NULL),
(27, 'Sales1', 'sp@gmail.com', '9800998878', '17ddf73881243bf3cfdf712d29af5384', 3, 1, NULL, NULL, 1, '2022-04-14 07:50:08', NULL),
(28, 'Test issue', 'testissue@test.com', '987899877', '25d55ad283aa400af464c76d713c07ad', 3, 1, NULL, NULL, 1, '2022-04-14 01:35:03', NULL),
(30, 'Test issue', 'testissue1@test.com', '987899871', '25d55ad283aa400af464c76d713c07ad', 3, 1, NULL, NULL, 1, '2022-04-14 01:36:46', NULL),
(31, 'Agency one', 'agencyone@yopmail.com', '87241163626', '25d55ad283aa400af464c76d713c07ad', 2, 1, NULL, NULL, 1, '2022-04-14 04:33:34', NULL),
(32, 'Vishnu', 'Vishnu@gmail.com', '9645386607', 'c33f3631c7610170c73d9b1746747f97', 3, 1, NULL, NULL, 1, '2022-04-14 05:56:16', NULL),
(33, 'Dickson Agency', 'dickson1@yopmail.com', '75675675765', '25d55ad283aa400af464c76d713c07ad', 2, 1, NULL, NULL, 1, '2022-04-14 11:34:14', NULL),
(34, 'dickson Sales', 'dickson2@yopmail.com', '64566456654', '25d55ad283aa400af464c76d713c07ad', 3, 1, NULL, NULL, 0, '2022-04-14 11:35:18', '2022-04-15 08:55:10');

-- --------------------------------------------------------

--
-- Table structure for table `user_details`
--

CREATE TABLE `user_details` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `address` text CHARACTER SET utf8mb4 DEFAULT NULL,
  `bank_account` varchar(25) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ifsc` varchar(15) CHARACTER SET utf8mb4 DEFAULT NULL,
  `branch` varchar(65) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agency_id` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_details`
--

INSERT INTO `user_details` (`id`, `user_id`, `address`, `bank_account`, `ifsc`, `branch`, `agency_id`) VALUES
(1, 3, 'test', 'Test', 'UTI10078', 'Thiruvattar', 2),
(2, 30, NULL, NULL, NULL, NULL, 0),
(3, 32, NULL, NULL, NULL, NULL, 15),
(4, 34, 'sdasdasd', '1234555', '324234', 'test', 33);

-- --------------------------------------------------------

--
-- Table structure for table `wallet`
--

CREATE TABLE `wallet` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `balance_amount` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wallet`
--

INSERT INTO `wallet` (`id`, `user_id`, `balance_amount`) VALUES
(1, 3, '17.5'),
(2, 34, '15.6');

-- --------------------------------------------------------

--
-- Table structure for table `wallet_transactions`
--

CREATE TABLE `wallet_transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL DEFAULT 0,
  `amount` varchar(15) CHARACTER SET utf8mb4 NOT NULL DEFAULT '0',
  `transaction_type` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1 - Credit, 2 - Debit',
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1 - Pending, 2 - Success',
  `attachment_name` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `attachment_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comments` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `approved_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wallet_transactions`
--

INSERT INTO `wallet_transactions` (`id`, `user_id`, `order_id`, `amount`, `transaction_type`, `status`, `attachment_name`, `attachment_path`, `comments`, `created_date`, `approved_date`) VALUES
(1, 3, 2, '52.5', 1, 2, NULL, NULL, NULL, '2022-04-13 07:02:58', NULL),
(2, 3, 0, '10', 2, 2, 'Emailing Item List.pdf', 'uploads/attachments/2/1649857009.pdf', 'Test', '2022-04-13 07:03:31', '2022-04-13 07:06:49'),
(3, 3, 0, '10', 2, 2, '', '', 'dfdsfsdfdsfsdfsdfsd', '2022-04-13 07:15:47', '2022-04-13 07:18:20'),
(4, 3, 0, '15', 2, 2, 'Emailing Item List (1).pdf', 'uploads/attachments/4/1649942094.html', 'Test', '2022-04-13 07:18:53', '2022-04-14 06:44:54'),
(8, 3, 0, '5', 2, 1, 'Emailing Item List (1).pdf', 'uploads/attachments/8/1649942079.html', 'Test', '2022-04-13 07:38:15', '2022-04-14 06:44:39'),
(9, 3, 0, '10', 2, 1, '', '', 'null', '2022-04-13 07:44:45', '2022-04-13 10:26:12'),
(10, 34, 9, '8.3', 1, 2, NULL, NULL, NULL, '2022-04-14 11:38:47', NULL),
(11, 34, 0, '1', 2, 2, 'download (1).png', 'uploads/attachments/11/1649959808.png', 'null', '2022-04-14 11:39:27', '2022-04-14 11:40:08'),
(12, 34, 10, '8.3', 1, 2, NULL, NULL, NULL, '2022-04-14 11:41:47', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_details`
--
ALTER TABLE `user_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wallet`
--
ALTER TABLE `wallet`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `user_details`
--
ALTER TABLE `user_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `wallet`
--
ALTER TABLE `wallet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
